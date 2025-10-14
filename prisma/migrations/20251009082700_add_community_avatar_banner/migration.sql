/*
  Warnings:

  - You are about to drop the column `image` on the `Community` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Community` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Community" DROP COLUMN "image",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "banner" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Community_name_key" ON "Community"("name");
