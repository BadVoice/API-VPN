/*
  Warnings:

  - The primary key for the `AccessKey` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `modelId` on the `AccessKey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AccessKey" DROP CONSTRAINT "AccessKey_pkey",
DROP COLUMN "modelId",
ADD CONSTRAINT "AccessKey_pkey" PRIMARY KEY ("id");
