import prisma from '../../../prisma/prismaClient.js';

export default {
  async createOrderItem({ productId, quantity, unitPrice, paymentMethod, employeeId, customerId }) {      
      const product = await prisma.product.findUnique({ 
          where: { id: productId },
          select: { name: true, stock: true, price: true }
      });

      const customer = await prisma.customerData.findUnique({ 
          where: { id: customerId },
          select: { name: true }
      });

      const employee = await prisma.employee.findUnique({ 
          where: { id: employeeId },
          select: { name: true }
      });

      if (!product) throw new Error('Produto não existe');
      if (product.stock < quantity) throw new Error('Estoque insuficiente');
      if (!customer) throw new Error('Cliente não encontrado');
      if (!employee) throw new Error('Funcionário não encontrado');

      return await prisma.orderItem.create({
          data: {
              name: product.name,
              productId,
              quantity,
              unitPrice: unitPrice || product.price,
              paymentMethod,
              employeeName: employee.name,
              customerName: customer.name
          },
          select: { 
              id: true, 
              name: true,
              quantity: true, 
              unitPrice: true, 
              paymentMethod: true,
              employeeName: true,
              customerName: true,
          }
      });
  },

  async updateOrderItem(id, data) {
    const { quantity, unitPrice, paymentMethod } = data;
    
    if (quantity <= 0) throw new Error('Quantidade inválida');
    if (unitPrice <= 0) throw new Error('Preço inválido');

    return await prisma.orderItem.update({
      where: { id },
      data: { quantity, unitPrice, paymentMethod },
      select: { id: true, name: true, quantity: true, unitPrice: true, paymentMethod: true }
    });
  },

  async deleteOrderItem(id) {
    const item = await prisma.orderItem.findUnique({
      where: { id },
      select: { orderId: true }
    });

    if (item?.orderId) {
      throw new Error('Não é possível remover itens já vinculados a pedidos');
    }

    await prisma.orderItem.delete({ where: { id } });
  },

  async getPendingOrderItems() {
    return await prisma.orderItem.findMany({
      where: { orderId: null },
      select: {
        id: true,
        name: true,
        quantity: true,
        unitPrice: true,
        paymentMethod: true,
        employeeName: true,
        customerName: true,
        product: { select: { id: true, image: true } }
      }
    });
  },

  // ======================
  // Order Services
  // ======================
    async createFinalOrder(orderId, customerId, employeeId, ) {
        if (!orderId) throw new Error('O orderId é obrigatório');

        const customer = await prisma.customerData.findUnique({ 
            where: { id: customerId},
            select: { name: true }
        });
        console.log(customer)

        const employee = await prisma.employee.findUnique({ 
            where: { id: employeeId },
            select: { id: true, name: true }
        });

        return await prisma.$transaction(async (tx) => {
            // 1. Busca todos os OrderItems com o orderId fornecido
            const orderItems = await tx.orderItem.findMany({
                where: { id: orderId },
                include: {
                    product: {
                        select: { id: true, image: true, stock: true }
                    }
                }
            });

            if (orderItems.length === 0) {
                throw new Error('Nenhum item encontrado para este orderId');
            }

            // 3. Calcula os valores totais
            const subtotal = orderItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
            const taxRate = 0.1; // Exemplo: 10% de imposto
            const taxAmount = subtotal * taxRate;
            const totalAmount = subtotal + taxAmount;

            // 4. Cria a Order final
            const finalOrder = await tx.order.create({
                data: {
                    id: orderId,
                    customerId: customer.id,
                    employeeId: employee.id,
                    subtotal,
                    taxAmount,
                    totalAmount,
                    status: 'COMPLETED',
                    createdAt: new Date(),
                    items: {
                        connect: orderItems.map(item => ({ id: item.id })) // Conecta os OrderItems já existentes
                    }
                },
                include: {
                    items: {
                        include: {
                            product: {
                                select: { id: true, image: true }
                            }
                        }
                    }
                }
            });

            // 5. Atualiza o estoque dos produtos
            await Promise.all(orderItems.map(item => {
                if (item.product.stock < item.quantity) {
                    throw new Error(`Estoque insuficiente para o produto ${item.product.id}`);
                }
                return tx.product.update({
                    where: { id: item.product.id },
                    data: {
                        stock: { decrement: item.quantity }
                    }
                });
            }));

            return {
                ...finalOrder,
                items: finalOrder.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    paymentMethod: item.paymentMethod,
                    product: {
                        id: item.product.id,
                        image: item.product.image
                    }
                }))
            };
        });
    },

  async updateOrder(id, data) {
    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];
    
    if (data.status && !validStatuses.includes(data.status)) {
      throw new Error('Status inválido');
    }

    return await prisma.order.update({
      where: { id },
      data,
      include: {
        items: true,
        customer: true
      }
    });
  },

  async cancelOrderWithItems(id) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id },
        data: { status: 'CANCELLED' },
        include: { items: true }
      });

      await Promise.all(order.items.map(item =>
        tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } }
        })
      ));
    });
  },

  async getOrderWithItems(id) {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        customer: true,
        employee: true
      }
    });
  },

  async getAllOrders(filters = {}) {
    const { status, customerId, startDate, endDate } = filters;
    
    const where = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (startDate || endDate) {
      where.issueDate = {};
      if (startDate) where.issueDate.gte = new Date(startDate);
      if (endDate) where.issueDate.lte = new Date(endDate);
    }

    return await prisma.order.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true } },
        _count: { select: { items: true } }
      },
      orderBy: { issueDate: 'desc' }
    });
  }
};