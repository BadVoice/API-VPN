/*
  Warnings:

  - The primary key for the `AccessKey` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `first_name` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `img_url` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `img_url` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - Made the column `modelId` on table `AccessKey` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "AccessKey_modelId_key";

-- AlterTable
ALTER TABLE "AccessKey" DROP CONSTRAINT "AccessKey_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "usedAt" TIMESTAMP(3),
ALTER COLUMN "modelId" SET NOT NULL,
ADD CONSTRAINT "AccessKey_pkey" PRIMARY KEY ("modelId");

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "first_name",
DROP COLUMN "img_url",
DROP COLUMN "last_name";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "first_name",
DROP COLUMN "img_url",
DROP COLUMN "key",
DROP COLUMN "last_name";
