/*
  Warnings:

  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT', 'DEBIT', 'PIX', 'CASH', 'BOLETO');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentId" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "paymentMethod" "PaymentMethod"[];

-- DropTable
DROP TABLE "Payment";
