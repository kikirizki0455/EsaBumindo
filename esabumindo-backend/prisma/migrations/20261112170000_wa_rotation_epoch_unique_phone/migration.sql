-- AlterTable
ALTER TABLE "WaSetting" ADD COLUMN     "rotationEpoch" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "SalesAgent_phone_key" ON "SalesAgent"("phone");
