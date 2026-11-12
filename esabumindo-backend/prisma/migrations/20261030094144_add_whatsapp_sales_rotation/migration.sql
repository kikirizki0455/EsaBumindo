-- CreateEnum
CREATE TYPE "WaRotationStrategy" AS ENUM ('ROUND_ROBIN', 'WEIGHTED_ROUND_ROBIN', 'LEAST_ASSIGNED', 'RANDOM');

-- CreateTable
CREATE TABLE "SalesAgent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,
    "lastAssignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaClick" (
    "id" TEXT NOT NULL,
    "salesId" TEXT NOT NULL,
    "visitorId" TEXT,
    "page" TEXT,
    "userAgent" TEXT,
    "ipHash" TEXT,
    "sticky" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaClick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaSetting" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "strategy" "WaRotationStrategy" NOT NULL DEFAULT 'ROUND_ROBIN',
    "stickyDays" INTEGER NOT NULL DEFAULT 7,
    "greeting" TEXT NOT NULL DEFAULT 'Halo, saya ingin bertanya tentang produk ESABOND.',
    "fallbackPhone" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SalesAgent_isActive_sortOrder_idx" ON "SalesAgent"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "WaClick_salesId_createdAt_idx" ON "WaClick"("salesId", "createdAt");

-- CreateIndex
CREATE INDEX "WaClick_visitorId_createdAt_idx" ON "WaClick"("visitorId", "createdAt");

-- AddForeignKey
ALTER TABLE "WaClick" ADD CONSTRAINT "WaClick_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES "SalesAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
