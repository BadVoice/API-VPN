/*
  Warnings:

  - The primary key for the `profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `first_name` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `profiles` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `last_name` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - The required column `user_id` was added to the `profiles` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles__id_fkey";

-- AlterTable
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_pkey",
DROP COLUMN "_id",
ADD COLUMN     "first_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "id" UUID NOT NULL,
ADD COLUMN     "img_url" TEXT,
ADD COLUMN     "last_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL,
ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
