import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductionPlanDto } from '../dto/create-production-plan.dto';
import { WarehouseConfirmDto } from '../dto/warehouse-confirm.dto';
import { CreateProductionLogDto } from '../dto/create-production-log.dto';

@Injectable()
export class ProductionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create production schedule (PPIC only)
   * Input: date, plant, reactor, product_id, target_qty
   * Output: production_plan with status DRAFT
   */
  async createProductionPlan(dto: CreateProductionPlanDto, userId?: number) {
    try {
      console.log('Creating production plan with DTO:', dto);
      console.log('User ID:', userId);

      // Validate required fields
      if (!dto.planDate) {
        throw new BadRequestException('planDate is required');
      }
      if (!dto.plant) {
        throw new BadRequestException('plant is required');
      }
      if (!dto.reactor) {
        throw new BadRequestException('reactor is required');
      }
      if (!dto.productId) {
        throw new BadRequestException('productId is required');
      }
      if (!dto.targetQty || dto.targetQty <= 0) {
        throw new BadRequestException('targetQty must be greater than 0');
      }

      if (!dto.noLot) {
        throw new BadRequestException('noLot is required');
      }

      // Validate product exists
      const product: any = await (this.prisma as any).product.findUnique({
        where: { id: dto.productId },
        include: { bom: { include: { details: true } } },
      });

      if (!product) {
        throw new NotFoundException(
          `Product dengan ID '${dto.productId}' tidak ditemukan di database. Pastikan produk sudah dibuat di halaman Manajemen Produk.`,
        );
      }

      // Check if product has BOM
      if (!product.bom) {
        throw new BadRequestException(
          `Produk '${product.name}' belum memiliki BOM/Formula. Silakan lengkapi BOM terlebih dahulu.`,
        );
      }

      if (!product.bom.details || product.bom.details.length === 0) {
        throw new BadRequestException(
          `BOM untuk produk '${product.name}' tidak memiliki detail material. Silakan tambahkan minimal 1 material ke BOM.`,
        );
      }

      console.log(
        `Product found: ${product.name}, BOM details: ${product.bom.details.length}`,
      );

      // Create production plan with fallback userId
      const plan: any = await (this.prisma as any).productionPlan.create({
        data: {
          planDate: new Date(dto.planDate),
          plant: dto.plant,
          reactor: dto.reactor,
          productId: dto.productId,
          targetQty: parseFloat(String(dto.targetQty)),
          noBatch: dto.noLot, // Simpan No Lot ke field noBatch
          noBPM: dto.noBpm, // Simpan No BPM
          status: 'DRAFT',
          notes: dto.notes || null,
          createdBy: userId || 0, // Use 0 if no userId
        },
        include: { product: true },
      });

      console.log(`Production plan created: ${plan.id}`);

      // Auto-generate production order details from BOM
      const orderDetails: any[] = [];
      for (const bomDetail of product.bom.details) {
        // Validate material exists
        const material: any = await (this.prisma as any).material.findUnique({
          where: { id: bomDetail.materialId },
        });

        if (!material) {
          console.warn(
            `Material ${bomDetail.materialId} not found, skipping...`,
          );
          continue;
        }

        const orderDetail = await (
          this.prisma as any
        ).productionOrderDetail.create({
          data: {
            productionPlanId: plan.id,
            bomStep: bomDetail.step || 'A',
            materialId: bomDetail.materialId,
            requiredQty: (plan.targetQty * (bomDetail.percentage || 0)) / 100,
          },
          include: { material: true },
        });
        orderDetails.push(orderDetail);
      }

      console.log(`Order details created: ${orderDetails.length}`);

      // Create initial log
      await (this.prisma as any).productionLog.create({
        data: {
          productionPlanId: plan.id,
          role: 'PPIC',
          type: 'INFO',
          message: `Rencana produksi dibuat - Target: ${plan.targetQty} unit, Plant: ${plan.plant}`,
          createdBy: userId || 0,
        },
      });

      return {
        id: plan.id,
        planDate: plan.planDate,
        plant: plan.plant,
        reactor: plan.reactor,
        product: plan.product,
        productId: plan.productId,
        targetQty: plan.targetQty,
        notes: plan.notes,
        status: plan.status,
        orderDetails,
        createdAt: plan.createdAt,
      };
    } catch (error) {
      console.error('Error in createProductionPlan:', error);
      throw error;
    }
  }

  /**
   * Get production plan with all details
   */
  async getProductionPlan(planId: string) {
    const plan: any = await (this.prisma as any).productionPlan.findUnique({
      where: { id: planId },
      include: {
        product: true,
        orderDetails: {
          include: { material: true },
          orderBy: { bomStep: 'asc' },
        },
        logs: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException('Production plan tidak ditemukan');
    }

    return plan;
  }

  /**
   * Get all production plans with filters
   */
  async getProductionPlans(filters?: {
    status?: string;
    reactor?: string;
    productId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.reactor) where.reactor = filters.reactor;
    if (filters?.productId) where.productId = filters.productId;

    if (filters?.startDate || filters?.endDate) {
      where.planDate = {};
      if (filters.startDate) {
        where.planDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.planDate.lte = filters.endDate;
      }
    }

    return (this.prisma as any).productionPlan.findMany({
      where,
      include: {
        product: true,
        orderDetails: { include: { material: true } },
      },
      orderBy: [{ planDate: 'desc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Warehouse submit actual quantities
   * Rules:
   * - Validate stock availability
   * - Deduct stock based on actual_qty
   * - Create stock_movements OUT
   * - Add production_log with type MATERIAL_OUT
   */
  async warehouseConfirmMaterials(
    orderDetailId: string,
    dto: WarehouseConfirmDto,
    userId: number,
    warehouseId: string,
  ) {
    const orderDetail: any = await (
      this.prisma as any
    ).productionOrderDetail.findUnique({
      where: { id: orderDetailId },
      include: {
        material: true,
        productionPlan: true,
      },
    });

    if (!orderDetail) {
      throw new NotFoundException('Production order detail tidak ditemukan');
    }

    if (orderDetail.warehouseConfirmedAt) {
      throw new BadRequestException(
        'Material sudah dikonfirmasi oleh warehouse',
      );
    }

    // Validate stock availability
    const stock: any = await (this.prisma as any).materialStock.findUnique({
      where: {
        materialId_warehouseId: {
          materialId: orderDetail.materialId,
          warehouseId,
        },
      },
    });

    const actualQtyNum = Number(dto.actualQty);
    const stockQtyNum = stock ? Number(stock.quantity) : 0;

    if (!stock || stockQtyNum < actualQtyNum) {
      throw new BadRequestException(
        `Stok tidak cukup. Available: ${stockQtyNum}, Diminta: ${actualQtyNum}`,
      );
    }

    // Update order detail with warehouse confirmation
    const updated: any = await (
      this.prisma as any
    ).productionOrderDetail.update({
      where: { id: orderDetailId },
      data: {
        actualQty: actualQtyNum,
        lotNumber: dto.lotNumber,
        warehouseConfirmedAt: new Date(),
        warehouseConfirmedBy: userId,
      },
      include: { material: true },
    });

    // Deduct stock
    await (this.prisma as any).materialStock.update({
      where: {
        materialId_warehouseId: {
          materialId: orderDetail.materialId,
          warehouseId,
        },
      },
      data: {
        quantity: stockQtyNum - actualQtyNum,
      },
    });

    // Create stock movement
    await (this.prisma as any).stockMovement.create({
      data: {
        materialId: orderDetail.materialId,
        warehouseId,
        movementType: 'OUT',
        quantity: actualQtyNum,
        referenceType: 'PRODUCTION_ORDER',
        referenceId: orderDetail.productionPlanId,
        notes: `Lot: ${dto.lotNumber}, Production Plan: ${orderDetail.productionPlanId}`,
        createdBy: userId,
      },
    });

    // Create production log
    await (this.prisma as any).productionLog.create({
      data: {
        productionPlanId: orderDetail.productionPlanId,
        role: 'WAREHOUSE',
        type: 'MATERIAL_OUT',
        message: `Material ${orderDetail.material.name} dikeluarkan dari gudang - Qty: ${actualQtyNum} ${orderDetail.material.unit}, Lot: ${dto.lotNumber}`,
        metadata: {
          materialId: orderDetail.materialId,
          actualQty: actualQtyNum,
          lotNumber: dto.lotNumber,
        },
        createdBy: userId,
      },
    });

    return updated;
  }

  /**
   * Add production log (timeline event)
   * Logs are immutable (append only)
   */
  async addProductionLog(
    planId: string,
    dto: CreateProductionLogDto,
    userId: number,
  ) {
    const plan: any = await (this.prisma as any).productionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Production plan tidak ditemukan');
    }

    const log: any = await (this.prisma as any).productionLog.create({
      data: {
        productionPlanId: planId,
        role: dto.role,
        type: dto.type,
        message: dto.message,
        metadata: dto.metadata || null,
        createdBy: userId,
      },
    });

    return log;
  }

  /**
   * Get production logs for a plan
   */
  async getProductionLogs(planId: string) {
    return (this.prisma as any).productionLog.findMany({
      where: { productionPlanId: planId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Update production plan status
   */
  async updateProductionPlanStatus(
    planId: string,
    status: string,
    userId?: number,
  ) {
    try {
      const validStatuses = [
        'DRAFT',
        'CONFIRMED',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED',
      ];

      if (!validStatuses.includes(status)) {
        throw new BadRequestException(`Status tidak valid: ${status}`);
      }

      const plan: any = await (this.prisma as any).productionPlan.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        throw new NotFoundException('Production plan tidak ditemukan');
      }

      const updated: any = await (this.prisma as any).productionPlan.update({
        where: { id: planId },
        data: { status },
        include: {
          product: true,
          orderDetails: { include: { material: true } },
          logs: { orderBy: { createdAt: 'asc' } },
        },
      });

      // Create log for status change
      await (this.prisma as any).productionLog.create({
        data: {
          productionPlanId: planId,
          role: 'PPIC',
          type: 'INFO',
          message: `Status berubah menjadi ${status}`,
          createdBy: userId || 0, // Use 0 if no userId
        },
      });

      return updated;
    } catch (error) {
      console.error('Error in updateProductionPlanStatus:', error);
      throw error;
    }
  }

  /**
   * Generate No BPM dengan format: P{plant}.{year}{month}{day}{sequence}
   * Contoh: P2.202601070 (Plant 2, 2026-01-07, urutan ke-0)
   */
  private async generateNoBPM(plant: string): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    // Hitung berapa plan sudah dibuat hari ini untuk plant ini
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );

    const countToday: any = await (this.prisma as any).productionPlan.count({
      where: {
        plant,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    const sequence = String(countToday).padStart(1, '0');
    return `${plant}.${year}${month}${day}${sequence}`;
  }

  /**
   * Generate No Batch/Lot (simple format)
   * Format: {plant}-{date}-{sequence}
   * Contoh: P2-20260107-001
   */
  private async generateNoBatch(plant: string): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );

    const countToday: any = await (this.prisma as any).productionPlan.count({
      where: {
        plant,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    const sequence = String(countToday + 1).padStart(3, '0');
    return `${plant}-${dateStr}-${sequence}`;
  }

  /**
   * Track schedule changes
   * Hanya dicatat jika material sudah ditimbang (warehouseConfirmedAt exists)
   */
  async trackScheduleChange(
    planId: string,
    changeType: string,
    oldValue: string,
    newValue: string,
    reason: string | null,
    userId: number,
  ) {
    const plan: any = await (this.prisma as any).productionPlan.findUnique({
      where: { id: planId },
      include: {
        orderDetails: true,
      },
    });

    if (!plan) {
      throw new NotFoundException('Production plan tidak ditemukan');
    }

    // Hitung berapa material sudah ditimbang
    const weighedCount = plan.orderDetails.filter(
      (od: any) => od.warehouseConfirmedAt !== null,
    ).length;

    // Jika ada material yang sudah ditimbang, catat perubahan
    if (weighedCount > 0) {
      await (this.prisma as any).scheduledChange.create({
        data: {
          productionPlanId: planId,
          changeType,
          oldValue,
          newValue,
          materialWeighedCount: weighedCount,
          materialTotalCount: plan.orderDetails.length,
          reason,
          changedBy: userId,
        },
      });

      // Create production log untuk tracking perubahan
      await (this.prisma as any).productionLog.create({
        data: {
          productionPlanId: planId,
          role: 'PPIC',
          type: 'ADJUST',
          message: `Jadwal berubah - ${changeType}: ${oldValue} → ${newValue} (${weighedCount}/${plan.orderDetails.length} material sudah ditimbang). Alasan: ${reason || 'Tidak ada'}`,
          metadata: {
            changeType,
            oldValue,
            newValue,
            weighedCount,
            reason,
          },
          createdBy: userId,
        },
      });
    }

    return {
      tracked: weighedCount > 0,
      weighedCount,
      totalCount: plan.orderDetails.length,
    };
  }

  /**
   * Get schedule changes for reporting
   */
  async getScheduleChanges(filters?: {
    plant?: string;
    month?: number;
    year?: number;
  }) {
    const where: any = {};

    // Filter berdasarkan tanggal jika ada
    if (filters?.month && filters?.year) {
      const startDate = new Date(filters.year, filters.month - 1, 1);
      const endDate = new Date(filters.year, filters.month, 0);
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (filters?.plant) {
      where.productionPlan = {
        plant: filters.plant,
      };
    }

    return (this.prisma as any).scheduledChange.findMany({
      where,
      include: {
        productionPlan: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get schedule change summary by month and plant
   */
  async getScheduleChangeSummary(plant: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const changes: any[] = await (this.prisma as any).scheduledChange.findMany({
      where: {
        productionPlan: {
          plant,
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        productionPlan: {
          include: {
            product: true,
          },
        },
      },
    });

    // Group by change type
    const summary = {
      totalChanges: changes.length,
      affectedPlans: new Set(changes.map((c: any) => c.productionPlanId)).size,
      byChangeType: {
        DATE: changes.filter((c: any) => c.changeType === 'DATE').length,
        QUANTITY: changes.filter((c: any) => c.changeType === 'QUANTITY')
          .length,
        REACTOR: changes.filter((c: any) => c.changeType === 'REACTOR').length,
        PRODUCT: changes.filter((c: any) => c.changeType === 'PRODUCT').length,
        NOTES: changes.filter((c: any) => c.changeType === 'NOTES').length,
      },
      changes: changes.map((c: any) => ({
        ...c,
        percentage: `${Math.round((c.materialWeighedCount / c.materialTotalCount) * 100)}%`,
      })),
    };

    return summary;
  }

  /**
   * Update production plan dengan tracking perubahan jadwal
   */
  async updateProductionPlanWithTracking(
    planId: string,
    updateData: any,
    userId: number,
  ) {
    const plan: any = await (this.prisma as any).productionPlan.findUnique({
      where: { id: planId },
      include: { orderDetails: true },
    });

    if (!plan) {
      throw new NotFoundException('Production plan tidak ditemukan');
    }

    // Track perubahan untuk setiap field yang berubah
    if (updateData.planDate && updateData.planDate !== plan.planDate) {
      await this.trackScheduleChange(
        planId,
        'DATE',
        new Date(plan.planDate).toLocaleDateString('id-ID'),
        new Date(updateData.planDate).toLocaleDateString('id-ID'),
        updateData.changeReason,
        userId,
      );
    }

    if (updateData.reactor && updateData.reactor !== plan.reactor) {
      await this.trackScheduleChange(
        planId,
        'REACTOR',
        plan.reactor,
        updateData.reactor,
        updateData.changeReason,
        userId,
      );
    }

    if (updateData.targetQty && updateData.targetQty !== plan.targetQty) {
      await this.trackScheduleChange(
        planId,
        'QUANTITY',
        plan.targetQty.toString(),
        updateData.targetQty.toString(),
        updateData.changeReason,
        userId,
      );
    }

    if (updateData.notes && updateData.notes !== plan.notes) {
      await this.trackScheduleChange(
        planId,
        'NOTES',
        plan.notes || '',
        updateData.notes,
        updateData.changeReason,
        userId,
      );
    }

    // Update plan
    const updated: any = await (this.prisma as any).productionPlan.update({
      where: { id: planId },
      data: {
        ...(updateData.planDate && { planDate: new Date(updateData.planDate) }),
        ...(updateData.reactor && { reactor: updateData.reactor }),
        ...(updateData.targetQty && { targetQty: updateData.targetQty }),
        ...(updateData.notes && { notes: updateData.notes }),
      },
      include: {
        product: true,
        orderDetails: { include: { material: true } },
        logs: true,
        scheduledChanges: true,
      },
    });

    return updated;
  }

  /**
   * Get product with BOM details
   */
  async getProductWithBOM(productId: string) {
    return (this.prisma as any).product.findUnique({
      where: { id: productId },
      include: {
        bom: {
          include: {
            details: {
              include: { material: true },
              orderBy: { step: 'asc' },
            },
          },
        },
      },
    });
  }

  /**
   * Get warehouse dashboard statistics
   */
  async getWarehouseDashboardStats(filters?: {
    plant?: string;
    month?: number;
    year?: number;
  }) {
    let dateFilter: any = {};
    if (filters?.month && filters?.year) {
      const startDate = new Date(filters.year, filters.month - 1, 1);
      const endDate = new Date(filters.year, filters.month, 0);
      dateFilter = {
        gte: startDate,
        lte: endDate,
      };
    }

    // Get all plans for the filter
    const plans: any[] = await (this.prisma as any).productionPlan.findMany({
      where: {
        ...(filters?.plant && { plant: filters.plant }),
        ...(Object.keys(dateFilter).length > 0 && { planDate: dateFilter }),
      },
      include: {
        orderDetails: {
          include: { material: true },
        },
      },
    });

    // Calculate stats
    const totalPlans = plans.length;
    let confirmedMaterials = 0;
    let pendingMaterials = 0;

    plans.forEach((plan: any) => {
      plan.orderDetails.forEach((od: any) => {
        if (od.warehouseConfirmedAt) {
          confirmedMaterials++;
        } else {
          pendingMaterials++;
        }
      });
    });

    const confirmationRate =
      confirmedMaterials + pendingMaterials > 0
        ? Math.round(
            (confirmedMaterials / (confirmedMaterials + pendingMaterials)) *
              100,
          )
        : 0;

    // Get low stock materials
    const lowStockMaterials: any[] = await (this.prisma as any).materialStock
      .findMany({
        where: {
          quantity: {
            lt: (this.prisma as any).raw('min_stock'),
          },
        },
        include: { material: true },
        take: 10,
      })
      .catch(() => []);

    // Get recent activities (stock movements)
    const recentActivities: any[] = await (this.prisma as any).stockMovement
      .findMany({
        where: {
          ...(filters?.plant && {
            warehouse: { code: filters.plant },
          }),
        },
        include: { material: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      })
      .catch(() => []);

    // Calculate daily confirmations
    const dailyConfirmations: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('id-ID', {
        weekday: 'short',
      });

      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const dayConfirmed: any = await (this.prisma as any).productionOrderDetail
        .count({
          where: {
            warehouseConfirmedAt: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        })
        .catch(() => 0);

      dailyConfirmations.push({
        label: dateStr,
        value: dayConfirmed,
      });
    }

    return {
      totalPlans,
      confirmedMaterials,
      pendingMaterials,
      confirmationRate,
      lowStockMaterials: lowStockMaterials.map((ms: any) => ({
        name: ms.material?.name,
        quantity: ms.quantity,
        minStock: ms.minStock,
        unit: ms.material?.unit,
      })),
      recentActivities: recentActivities.map((activity: any) => ({
        material: activity.material?.name,
        message: `${activity.movementType} - ${activity.quantity} ${activity.material?.unit}`,
        createdAt: activity.createdAt,
      })),
      dailyConfirmations,
    };
  }

  /**
   * Get PPIC dashboard statistics dengan schedule changes tracking
   */
  async getPPICDashboardStats(filters?: {
    plant?: string;
    month?: number;
    year?: number;
  }) {
    let dateFilter: any = {};
    if (filters?.month && filters?.year) {
      const startDate = new Date(filters.year, filters.month - 1, 1);
      const endDate = new Date(filters.year, filters.month, 0);
      dateFilter = {
        gte: startDate,
        lte: endDate,
      };
    }

    // Get schedule statistics
    const plans: any[] = await (this.prisma as any).productionPlan.findMany({
      where: {
        ...(filters?.plant && { plant: filters.plant }),
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
      },
    });

    const totalSchedules = plans.length;
    const draftSchedules = plans.filter(
      (p: any) => p.status === 'DRAFT',
    ).length;
    const confirmedSchedules = plans.filter(
      (p: any) => p.status === 'CONFIRMED',
    ).length;
    const inProgressSchedules = plans.filter(
      (p: any) => p.status === 'IN_PROGRESS',
    ).length;
    const completedSchedules = plans.filter(
      (p: any) => p.status === 'COMPLETED',
    ).length;

    // Get schedule changes summary
    const changesSummary = await this.getScheduleChangeSummary(
      filters?.plant || 'P1',
      filters?.month || new Date().getMonth() + 1,
      filters?.year || new Date().getFullYear(),
    );

    // Get schedule changes with details
    const scheduleChanges: any[] = await (
      this.prisma as any
    ).scheduledChange.findMany({
      where: {
        productionPlan: {
          plant: filters?.plant,
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
        },
      },
      include: {
        productionPlan: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate weekly schedule data
    const weeklyScheduleData: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('id-ID', {
        weekday: 'short',
      });

      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const daySchedules: any = await (this.prisma as any).productionPlan
        .count({
          where: {
            plant: filters?.plant,
            createdAt: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        })
        .catch(() => 0);

      weeklyScheduleData.push({
        label: dateStr,
        value: daySchedules,
      });
    }

    return {
      totalSchedules,
      draftSchedules,
      confirmedSchedules,
      inProgressSchedules,
      completedSchedules,
      totalChanges: changesSummary.totalChanges,
      affectedPlans: changesSummary.affectedPlans,
      changesSummary: changesSummary.byChangeType,
      scheduleChanges,
      weeklyScheduleData,
    };
  }

  // ==================== MASTER DATA METHODS ====================

  /**
   * Get all products dengan BOM details
   */
  async getAllProducts() {
    return (this.prisma as any).product.findMany({
      where: { status: 'active' },
      include: {
        bom: {
          include: {
            details: {
              include: { material: true },
              orderBy: { step: 'asc' },
            },
          },
        },
      },
      orderBy: { code: 'asc' },
    });
  }

  /**
   * Get all materials dengan stock info
   */
  async getAllMaterials() {
    try {
      const materials: any[] = await (this.prisma as any).material.findMany({
        where: { status: 'active' },
        include: {
          materialStocks: {
            include: { warehouse: true },
          },
        },
        orderBy: { code: 'asc' },
      });

      // Transform materialStocks array menjadi currentStock & minStock
      return materials.map((material) => {
        // Aggregate stock dari semua warehouse
        const totalStock = material.materialStocks.reduce(
          (sum: number, stock: any) => sum + Number(stock.quantity || 0),
          0,
        );

        // Ambil minStock dari warehouse pertama (atau bisa di-customize)
        const minStock =
          material.materialStocks.length > 0
            ? Number(material.materialStocks[0].minStock || 0)
            : 0;

        return {
          id: material.id,
          code: material.code,
          name: material.name,
          unit: material.unit,
          description: material.description,
          category: material.category,
          status: material.status,
          currentStock: totalStock, // Total stok dari semua warehouse
          minStock: minStock, // Stok minimum
          createdAt: material.createdAt,
        };
      });
    } catch (error) {
      console.error('Error in getAllMaterials:', error);
      throw error;
    }
  }

  /**
   * Get all packaging types
   */
  async getAllPackagingTypes() {
    return (this.prisma as any).packagingType.findMany({
      where: { status: 'active' },
      orderBy: { code: 'asc' },
    });
  }

  /**
   * Get all warehouses
   */
  async getAllWarehouses() {
    return (this.prisma as any).warehouse.findMany({
      where: { status: 'active' },
      orderBy: { code: 'asc' },
    });
  }

  /**
   * Create new material
   */
  async createMaterial(data: {
    code: string;
    name: string;
    unit: string;
    description?: string;
    category?: string;
    status?: string;
  }) {
    try {
      // Validate required fields
      if (!data.code || !data.name || !data.unit) {
        throw new BadRequestException('code, name, dan unit harus diisi');
      }

      // Check if material code already exists
      const existing = await (this.prisma as any).material.findUnique({
        where: { code: data.code },
      });

      if (existing) {
        throw new BadRequestException(
          `Material dengan kode '${data.code}' sudah ada`,
        );
      }

      // Create material
      const material = await (this.prisma as any).material.create({
        data: {
          code: data.code,
          name: data.name,
          unit: data.unit,
          description: data.description || null,
          category: data.category || null,
          status: data.status || 'active',
        },
      });

      return material;
    } catch (error) {
      console.error('Error in createMaterial:', error);
      throw error;
    }
  }

  /**
   * Delete material (soft delete by changing status)
   */
  async deleteMaterial(materialId: string) {
    try {
      // Check if material exists
      const material = await (this.prisma as any).material.findUnique({
        where: { id: materialId },
      });

      if (!material) {
        throw new NotFoundException('Material tidak ditemukan');
      }

      // Soft delete - change status to inactive
      const updated = await (this.prisma as any).material.update({
        where: { id: materialId },
        data: { status: 'inactive' },
      });

      return updated;
    } catch (error) {
      console.error('Error in deleteMaterial:', error);
      throw error;
    }
  }

  /**
   * Create or update material stock
   */
  async createOrUpdateMaterialStock(data: {
    materialId: string;
    warehouseId: string;
    quantity: number;
    minStock: number;
  }) {
    try {
      // Validate material exists
      const material = await (this.prisma as any).material.findUnique({
        where: { id: data.materialId },
      });

      if (!material) {
        throw new NotFoundException(
          `Material dengan ID '${data.materialId}' tidak ditemukan`,
        );
      }

      // Validate warehouse exists
      const warehouse = await (this.prisma as any).warehouse.findUnique({
        where: { id: data.warehouseId },
      });

      if (!warehouse) {
        throw new NotFoundException(
          `Warehouse dengan ID '${data.warehouseId}' tidak ditemukan`,
        );
      }

      // Check if stock already exists
      const existingStock = await (this.prisma as any).materialStock.findUnique(
        {
          where: {
            materialId_warehouseId: {
              materialId: data.materialId,
              warehouseId: data.warehouseId,
            },
          },
        },
      );

      if (existingStock) {
        // Update existing stock
        return await (this.prisma as any).materialStock.update({
          where: {
            materialId_warehouseId: {
              materialId: data.materialId,
              warehouseId: data.warehouseId,
            },
          },
          data: {
            quantity: parseFloat(String(data.quantity)) || 0,
            minStock: parseFloat(String(data.minStock)) || 0,
          },
          include: { material: true, warehouse: true },
        });
      } else {
        // Create new stock
        return await (this.prisma as any).materialStock.create({
          data: {
            materialId: data.materialId,
            warehouseId: data.warehouseId,
            quantity: parseFloat(String(data.quantity)) || 0,
            minStock: parseFloat(String(data.minStock)) || 0,
          },
          include: { material: true, warehouse: true },
        });
      }
    } catch (error) {
      console.error('Error in createOrUpdateMaterialStock:', error);
      throw error;
    }
  }

  /**
   * Create new product with BOM/Formula
   */
  async createProduct(data: {
    code: string;
    name: string;
    type: string;
    description?: string;
    baseQty?: number;
    bomDetails?: any[];
  }) {
    try {
      console.log('Creating product:', data);

      // Validate required fields
      if (!data.code || !data.name || !data.type) {
        throw new BadRequestException('code, name, dan type harus diisi');
      }

      // Check if product code already exists
      const existing = await (this.prisma as any).product.findUnique({
        where: { code: data.code },
      });

      if (existing) {
        throw new BadRequestException(
          `Produk dengan kode '${data.code}' sudah ada`,
        );
      }

      // Validate BOM details if provided
      if (data.bomDetails && data.bomDetails.length > 0) {
        const totalPercentage = data.bomDetails.reduce(
          (sum, detail) => sum + parseFloat(detail.percentage || 0),
          0,
        );

        if (Math.abs(totalPercentage - 100) > 0.01) {
          throw new BadRequestException(
            `Total persentase BOM harus 100% (saat ini: ${totalPercentage.toFixed(2)}%)`,
          );
        }
      }

      // Create product
      const product = await (this.prisma as any).product.create({
        data: {
          code: data.code,
          name: data.name,
          type: data.type,
          description: data.description || null,
          baseQty: data.baseQty || 5400,
          status: 'active',
        },
      });

      console.log('Product created:', product.id);

      // Create BOM if details provided
      if (data.bomDetails && data.bomDetails.length > 0) {
        const bom = await (this.prisma as any).productBom.create({
          data: {
            productId: product.id,
          },
        });

        console.log('BOM created:', bom.id);

        // Create BOM details
        const details: any[] = [];
        for (const detail of data.bomDetails) {
          if (!detail.materialId || detail.percentage <= 0) {
            continue; // Skip invalid details
          }

          // Validate material exists
          const material = await (this.prisma as any).material.findUnique({
            where: { id: detail.materialId },
          });

          if (!material) {
            console.warn(
              `Material ${detail.materialId} not found, skipping...`,
            );
            continue;
          }

          const bomDetail = await (this.prisma as any).productBomDetail.create({
            data: {
              bomId: bom.id,
              materialId: detail.materialId,
              step: detail.step || 'A',
              percentage: parseFloat(detail.percentage) || 0,
              notes: detail.notes || null,
            },
            include: { material: true },
          });
          details.push(bomDetail);
          console.log(
            `BOM detail created: Step ${detail.step}, Material ${material.code}, ${detail.percentage}%`,
          );
        }

        // FIX BARIS INI - hapus backslash
        console.log(`Total BOM details created: ${details.length}`);
      }

      // Return product with BOM
      const result = await (this.prisma as any).product.findUnique({
        where: { id: product.id },
        include: {
          bom: {
            include: {
              details: {
                include: { material: true },
                orderBy: { step: 'asc' },
              },
            },
          },
        },
      });

      console.log('✅ Product created successfully with BOM');
      return result;
    } catch (error) {
      console.error('❌ Error in createProduct:', error);
      throw error;
    }
  }

  /**
   * Update product with BOM/Formula
   */
  async updateProduct(productId: string, data: any) {
    try {
      console.log('Updating product:', productId);

      // Check if product exists
      const product = await (this.prisma as any).product.findUnique({
        where: { id: productId },
        include: { bom: true },
      });

      if (!product) {
        throw new NotFoundException('Product tidak ditemukan');
      }

      // Update product basic info
      const updated = await (this.prisma as any).product.update({
        where: { id: productId },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.type && { type: data.type }),
          ...(data.description && { description: data.description }),
          ...(data.baseQty && { baseQty: data.baseQty }),
        },
      });

      // Update BOM details if provided
      if (data.bomDetails && data.bomDetails.length > 0) {
        // Get or create BOM
        let bom = product.bom;

        if (!bom) {
          bom = await (this.prisma as any).productBom.create({
            data: {
              productId: productId,
              totalPercentage: 100,
            },
          });
        }

        // Delete existing BOM details
        await (this.prisma as any).productBomDetail.deleteMany({
          where: { bomId: bom.id },
        });

        // Create new BOM details
        const details: any[] = [];
        for (const detail of data.bomDetails) {
          if (!detail.materialId || detail.percentage <= 0) {
            continue;
          }

          const material = await (this.prisma as any).material.findUnique({
            where: { id: detail.materialId },
          });

          if (!material) {
            console.warn(`Material ${detail.materialId} not found, skipping`);
            continue;
          }

          const bomDetail = await (this.prisma as any).productBomDetail.create({
            data: {
              bomId: bom.id,
              materialId: detail.materialId,
              step: detail.step || 'A',
              percentage: parseFloat(detail.percentage) || 0,
              notes: detail.notes || null,
            },
            include: { material: true },
          });
          details.push(bomDetail);
        }

        console.log(`BOM details updated: ${details.length}`);
      }

      // Return updated product with BOM
      const result = await (this.prisma as any).product.findUnique({
        where: { id: productId },
        include: {
          bom: {
            include: {
              details: {
                include: { material: true },
                orderBy: { step: 'asc' },
              },
            },
          },
        },
      });

      return result;
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  }

  /**
   * Delete/deactivate product
   */
  async deleteProduct(productId: string) {
    try {
      // Check if product exists
      const product = await (this.prisma as any).product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException('Product tidak ditemukan');
      }

      // Soft delete - change status to inactive
      const updated = await (this.prisma as any).product.update({
        where: { id: productId },
        data: { status: 'inactive' },
      });

      return updated;
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  }
}
