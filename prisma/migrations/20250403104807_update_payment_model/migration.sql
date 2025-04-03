/*
  Warnings:

  - Added the required column `method` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "method" TEXT NOT NULL,
ADD COLUMN     "trasactionId" TEXT,
ALTER COLUMN "status" SET DEFAULT 'pendente';
