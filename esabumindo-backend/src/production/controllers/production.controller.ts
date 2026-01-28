import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  Request,
  Query,
} from '@nestjs/common';
import { ProductionService } from '../services/production.service';
import { CreateProductionPlanDto } from '../dto/create-production-plan.dto';
import { WarehouseConfirmDto } from '../dto/warehouse-confirm.dto';
import { CreateProductionLogDto } from '../dto/create-production-log.dto';

@Controller('production')
export class ProductionController {
  constructor(private productionService: ProductionService) {}

  // ==================== MASTER DATA ENDPOINTS ====================
  // Must be defined BEFORE parameter routes to avoid conflicts

  /**
   * GET /api/production/master/products
   * Get all products with BOM details
   */
  @Get('master/products')
  async getProducts() {
    return this.productionService.getAllProducts();
  }

  /**
   * POST /api/production/master/products
   * Create new product with BOM/Formula
   */
  @Post('master/products')
  async createProduct(@Body() body: any) {
    return this.productionService.createProduct(body);
  }

  /**
   * PUT /api/production/master/products/:id
   * Update product with BOM/Formula
   */
  @Put('master/products/:id')
  async updateProduct(@Param('id') productId: string, @Body() body: any) {
    return this.productionService.updateProduct(productId, body);
  }

  /**
   * DELETE /api/production/master/products/:id
   * Delete/deactivate product
   */
  @Put('master/products/:id/delete')
  async deleteProduct(@Param('id') productId: string) {
    return this.productionService.deleteProduct(productId);
  }

  /**
   * GET /api/production/master/materials
   * Get all materials with stock info
   */
  @Get('master/materials')
  async getMaterials() {
    return this.productionService.getAllMaterials();
  }

  /**
   * POST /api/production/master/materials
   * Create new material
   */
  @Post('master/materials')
  async createMaterial(@Body() body: any) {
    return this.productionService.createMaterial(body);
  }

  /**
   * DELETE /api/production/master/materials/:id
   * Delete material
   */
  @Put('master/materials/:id')
  async deleteMaterial(@Param('id') materialId: string) {
    return this.productionService.deleteMaterial(materialId);
  }

  /**
   * POST /api/production/master/material-stocks
   * Create or update material stock
   */
  @Post('master/material-stocks')
  async createMaterialStock(@Body() body: any) {
    return this.productionService.createOrUpdateMaterialStock(body);
  }

  /**
   * GET /api/production/master/packaging-types
   * Get all packaging types
   */
  @Get('master/packaging-types')
  async getPackagingTypes() {
    return this.productionService.getAllPackagingTypes();
  }

  /**
   * GET /api/production/master/warehouses
   * Get all warehouses
   */
  @Get('master/warehouses')
  async getWarehouses() {
    return this.productionService.getAllWarehouses();
  }

  // ==================== PRODUCTION PLAN ENDPOINTS ====================

  /**
   * POST /api/production/plans
   * Create new production plan (PPIC only)
   */
  @Post('plans')
  async createPlan(@Body() dto: CreateProductionPlanDto, @Request() req: any) {
    const userId = req.user?.id;
    return this.productionService.createProductionPlan(dto, userId);
  }

  /**
   * GET /api/production/plans
   * Get all production plans with filters
   */
  @Get('plans')
  async getPlans(
    @Query('status') status?: string,
    @Query('reactor') reactor?: string,
    @Query('productId') productId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (reactor) filters.reactor = reactor;
    if (productId) filters.productId = productId;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    return this.productionService.getProductionPlans(filters);
  }

  /**
   * GET /api/production/bom/:productId
   * Get BOM details for a product
   */
  @Get('bom/:productId')
  async getBOM(@Param('productId') productId: string) {
    return this.productionService.getProductWithBOM(productId);
  }

  /**
   * GET /api/production/plans/:id
   * Get production plan details with materials and logs
   */
  @Get('plans/:id')
  async getPlan(@Param('id') planId: string) {
    return this.productionService.getProductionPlan(planId);
  }

  /**
   * PUT /api/production/plans/:id/status
   * Update production plan status
   */
  @Put('plans/:id/status')
  async updatePlanStatus(
    @Param('id') planId: string,
    @Body() body: { status: string },
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    return this.productionService.updateProductionPlanStatus(
      planId,
      body.status,
      userId,
    );
  }

  /**
   * PATCH /api/production/plans/:id
   * Update production plan with schedule change tracking
   */
  @Put('plans/:id')
  async updatePlan(
    @Param('id') planId: string,
    @Body() body: any,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    return this.productionService.updateProductionPlanWithTracking(
      planId,
      body,
      userId,
    );
  }

  /**
   * POST /api/production/order-details/:id/warehouse-confirm
   * Warehouse confirmation of material with actual quantity and lot number
   */
  @Post('order-details/:id/warehouse-confirm')
  async warehouseConfirm(
    @Param('id') orderDetailId: string,
    @Body() dto: WarehouseConfirmDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    const warehouseId = req.user?.warehouseId; // Should be set from user context

    return this.productionService.warehouseConfirmMaterials(
      orderDetailId,
      dto,
      userId,
      warehouseId,
    );
  }

  // ==================== LOGS & DASHBOARD ENDPOINTS ====================

  /**
   * POST /api/production/plans/:id/logs
   * Add production log (append only)
   */
  @Post('plans/:id/logs')
  async addLog(
    @Param('id') planId: string,
    @Body() dto: CreateProductionLogDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    return this.productionService.addProductionLog(planId, dto, userId);
  }

  /**
   * GET /api/production/plans/:id/logs
   * Get all logs for a production plan
   */
  @Get('plans/:id/logs')
  async getLogs(@Param('id') planId: string) {
    return this.productionService.getProductionLogs(planId);
  }

  /**
   * GET /api/production/warehouse/dashboard
   * Warehouse dashboard statistics
   */
  @Get('warehouse/dashboard')
  async getWarehouseDashboard(
    @Query('plant') plant?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const filters: any = {};
    if (plant) filters.plant = plant;
    if (month) filters.month = parseInt(month);
    if (year) filters.year = parseInt(year);

    return this.productionService.getWarehouseDashboardStats(filters);
  }

  /**
   * GET /api/production/ppic/dashboard
   * PPIC dashboard with schedule changes tracking
   */
  @Get('ppic/dashboard')
  async getPPICDashboard(
    @Query('plant') plant?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const filters: any = {};
    if (plant) filters.plant = plant;
    if (month) filters.month = parseInt(month);
    if (year) filters.year = parseInt(year);

    return this.productionService.getPPICDashboardStats(filters);
  }

  /**
   * GET /api/production/schedule-changes
   * Get schedule changes for reporting
   */
  @Get('schedule-changes')
  async getScheduleChanges(
    @Query('plant') plant?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const filters: any = {};
    if (plant) filters.plant = plant;
    if (month) filters.month = parseInt(month);
    if (year) filters.year = parseInt(year);

    return this.productionService.getScheduleChanges(filters);
  }
}
