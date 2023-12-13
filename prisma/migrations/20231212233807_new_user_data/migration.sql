/*
  Warnings:

  - The primary key for the `AccessKey` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `subscribe_exp` on the `profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[modelId]` on the table `AccessKey` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `AccessKey` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accessUrl]` on the table `AccessKey` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AccessKey" DROP CONSTRAINT "AccessKey_pkey",
ADD COLUMN     "modelId" TEXT,
ADD CONSTRAINT "AccessKey_pkey" PRIMARY KEY ("accessUrl");

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "subscribe_exp";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "key" TEXT;

-- CreateTable
CREATE TABLE "Payment" (
    "paymentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "Product" (
    "product_id" UUID NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_region" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "accessUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("product_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentId_key" ON "Payment"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_product_id_key" ON "Product"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Product_accessUrl_key" ON "Product"("accessUrl");

-- CreateIndex
CREATE UNIQUE INDEX "AccessKey_modelId_key" ON "AccessKey"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "AccessKey_id_key" ON "AccessKey"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AccessKey_accessUrl_key" ON "AccessKey"("accessUrl");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
