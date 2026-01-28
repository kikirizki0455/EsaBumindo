-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'PPIC';
ALTER TYPE "Role" ADD VALUE 'WAREHOUSE';
ALTER TYPE "Role" ADD VALUE 'QC';
ALTER TYPE "Role" ADD VALUE 'PRODUCTION';

-- AlterTable
ALTER TABLE "CompanySetting" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Salary" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "baseQty" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionBom" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductionBom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionBomDetail" (
    "id" TEXT NOT NULL,
    "bomId" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionBomDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackagingType" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" DECIMAL(10,2) NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackagingType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialStock" (
    "id" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "minStock" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaterialStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionPlan" (
    "id" TEXT NOT NULL,
    "planDate" TIMESTAMP(3) NOT NULL,
    "reactor" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "plant" TEXT NOT NULL,
    "targetQty" DECIMAL(10,2) NOT NULL,
    "noBatch" TEXT,
    "noBPM" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledChange" (
    "id" TEXT NOT NULL,
    "productionPlanId" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "oldValue" TEXT NOT NULL,
    "newValue" TEXT NOT NULL,
    "materialWeighedCount" INTEGER NOT NULL,
    "materialTotalCount" INTEGER NOT NULL,
    "reason" TEXT,
    "changedBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScheduledChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionOrderDetail" (
    "id" TEXT NOT NULL,
    "productionPlanId" TEXT NOT NULL,
    "bomStep" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "requiredQty" DECIMAL(10,2) NOT NULL,
    "actualQty" DECIMAL(10,2),
    "lotNumber" TEXT,
    "warehouseConfirmedAt" TIMESTAMP(3),
    "warehouseConfirmedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductionOrderDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionLog" (
    "id" TEXT NOT NULL,
    "productionPlanId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "movementType" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "referenceType" TEXT NOT NULL,
    "referenceId" TEXT,
    "notes" TEXT,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_code_key" ON "Product"("code");

-- CreateIndex
CREATE INDEX "Product_code_idx" ON "Product"("code");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionBom_productId_key" ON "ProductionBom"("productId");

-- CreateIndex
CREATE INDEX "ProductionBom_productId_idx" ON "ProductionBom"("productId");

-- CreateIndex
CREATE INDEX "ProductionBomDetail_bomId_idx" ON "ProductionBomDetail"("bomId");

-- CreateIndex
CREATE INDEX "ProductionBomDetail_materialId_idx" ON "ProductionBomDetail"("materialId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionBomDetail_bomId_step_materialId_key" ON "ProductionBomDetail"("bomId", "step", "materialId");

-- CreateIndex
CREATE UNIQUE INDEX "Material_code_key" ON "Material"("code");

-- CreateIndex
CREATE INDEX "Material_code_idx" ON "Material"("code");

-- CreateIndex
CREATE INDEX "Material_status_idx" ON "Material"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PackagingType_code_key" ON "PackagingType"("code");

-- CreateIndex
CREATE INDEX "PackagingType_code_idx" ON "PackagingType"("code");

-- CreateIndex
CREATE INDEX "MaterialStock_materialId_idx" ON "MaterialStock"("materialId");

-- CreateIndex
CREATE INDEX "MaterialStock_warehouseId_idx" ON "MaterialStock"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialStock_materialId_warehouseId_key" ON "MaterialStock"("materialId", "warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_code_key" ON "Warehouse"("code");

-- CreateIndex
CREATE INDEX "Warehouse_code_idx" ON "Warehouse"("code");

-- CreateIndex
CREATE INDEX "ProductionPlan_productId_idx" ON "ProductionPlan"("productId");

-- CreateIndex
CREATE INDEX "ProductionPlan_status_idx" ON "ProductionPlan"("status");

-- CreateIndex
CREATE INDEX "ProductionPlan_planDate_idx" ON "ProductionPlan"("planDate");

-- CreateIndex
CREATE INDEX "ProductionPlan_reactor_idx" ON "ProductionPlan"("reactor");

-- CreateIndex
CREATE INDEX "ProductionPlan_plant_idx" ON "ProductionPlan"("plant");

-- CreateIndex
CREATE INDEX "ScheduledChange_productionPlanId_idx" ON "ScheduledChange"("productionPlanId");

-- CreateIndex
CREATE INDEX "ScheduledChange_changeType_idx" ON "ScheduledChange"("changeType");

-- CreateIndex
CREATE INDEX "ScheduledChange_createdAt_idx" ON "ScheduledChange"("createdAt");

-- CreateIndex
CREATE INDEX "ProductionOrderDetail_productionPlanId_idx" ON "ProductionOrderDetail"("productionPlanId");

-- CreateIndex
CREATE INDEX "ProductionOrderDetail_materialId_idx" ON "ProductionOrderDetail"("materialId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionOrderDetail_productionPlanId_bomStep_materialId_key" ON "ProductionOrderDetail"("productionPlanId", "bomStep", "materialId");

-- CreateIndex
CREATE INDEX "ProductionLog_productionPlanId_idx" ON "ProductionLog"("productionPlanId");

-- CreateIndex
CREATE INDEX "ProductionLog_type_idx" ON "ProductionLog"("type");

-- CreateIndex
CREATE INDEX "ProductionLog_createdAt_idx" ON "ProductionLog"("createdAt");

-- CreateIndex
CREATE INDEX "StockMovement_materialId_idx" ON "StockMovement"("materialId");

-- CreateIndex
CREATE INDEX "StockMovement_warehouseId_idx" ON "StockMovement"("warehouseId");

-- CreateIndex
CREATE INDEX "StockMovement_referenceId_idx" ON "StockMovement"("referenceId");

-- CreateIndex
CREATE INDEX "StockMovement_createdAt_idx" ON "StockMovement"("createdAt");

-- AddForeignKey
ALTER TABLE "ProductionBom" ADD CONSTRAINT "ProductionBom_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionBomDetail" ADD CONSTRAINT "ProductionBomDetail_bomId_fkey" FOREIGN KEY ("bomId") REFERENCES "ProductionBom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionBomDetail" ADD CONSTRAINT "ProductionBomDetail_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialStock" ADD CONSTRAINT "MaterialStock_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialStock" ADD CONSTRAINT "MaterialStock_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionPlan" ADD CONSTRAINT "ProductionPlan_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledChange" ADD CONSTRAINT "ScheduledChange_productionPlanId_fkey" FOREIGN KEY ("productionPlanId") REFERENCES "ProductionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionOrderDetail" ADD CONSTRAINT "ProductionOrderDetail_productionPlanId_fkey" FOREIGN KEY ("productionPlanId") REFERENCES "ProductionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionOrderDetail" ADD CONSTRAINT "ProductionOrderDetail_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionLog" ADD CONSTRAINT "ProductionLog_productionPlanId_fkey" FOREIGN KEY ("productionPlanId") REFERENCES "ProductionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
