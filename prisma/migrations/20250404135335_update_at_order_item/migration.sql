-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "customerName" TEXT DEFAULT 'cliente desconhecido',
ADD COLUMN     "employeeName" TEXT DEFAULT 'funcionário desconhecido';
