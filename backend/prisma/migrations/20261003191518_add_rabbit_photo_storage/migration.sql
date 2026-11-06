/*
  Warnings:

  - Added the required column `path` to the `RabbitPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RabbitPhoto" ADD COLUMN     "path" TEXT NOT NULL;
