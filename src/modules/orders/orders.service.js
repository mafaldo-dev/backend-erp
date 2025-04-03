import prisma from '../../../prisma/prismaClient.js';

export default {
    /**
     * Cria um item temporário (ainda não vinculado a um pedido)
     */
    async createOrderItem({ productId, quantity, unitPrice }) {
      const product = await prisma.product.findUnique({ 
        where: { id: productId },
        select: { name: true, stock: true, price: true }
      });
  
      if (!product) throw new Error('Produto não existe');
      if (product.stock < quantity) throw new Error('Estoque insuficiente');
  
      return await prisma.orderItem.create({
        data: {
          productId,
          quantity,
          unitPrice: unitPrice || product.price, // Usa o preço do produto se não informado
          name: product.name
        },
        select: { id: true, name: true, quantity: true, unitPrice: true }
      });
    },

  async updateOrderItem(id, data) {
    const { quantity, unitPrice } = data;
    
    if (quantity <= 0) throw new Error('Quantidade inválida');
    if (unitPrice <= 0) throw new Error('Preço inválido');

    return await prisma.orderItem.update({
      where: { id },
      data: { quantity, unitPrice },
      select: { id: true, name: true, quantity: true, unitPrice: true }
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
        product: { select: { id: true, image: true } }
      }
    });
  },

  // ======================
  // Order Services
  // ======================

  async createOrderWithItems({ customerId, employeeId, paymentMethod }) {
    // Validações iniciais
    if (!employeeId) throw new Error('ID do funcionário é obrigatório');
    if (!customerId) throw new Error('ID do cliente é obrigatório');
    if (!paymentMethod) throw new Error('Método de pagamento é obrigatório');

    // Verifica existência das entidades relacionadas
    const [employeeExists, customerExists, items] = await Promise.all([
        prisma.employee.findUnique({
            where: { id: employeeId },
            select: { id: true }
        }),
        prisma.customerData.findUnique({
            where: { id: customerId },
            select: { id: true }
        }),
        prisma.orderItem.findMany({
            where: { orderId: null },
            include: { product: true }
        })
    ]);

    if (!employeeExists) throw new Error('Funcionário não encontrado');
    if (!customerExists) throw new Error('Cliente não encontrado');
    if (items.length === 0) throw new Error('Nenhum item no carrinho');

    // Cálculos financeiros
    const subtotal = items.reduce((total, item) => {
        return total + (item.quantity * item.unitPrice);
    }, 0);

    const taxRate = 0.1; // 10% de imposto
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    // Transação atômica
    return await prisma.$transaction(async (tx) => {
        // Cria o pedido
        const order = await tx.order.create({
            data: {
                customer: { connect: { id: customerId } },
                employee: { connect: { id: employeeId } },
                paymentMethod,
                subtotal,
                taxAmount,
                totalAmount,
                status: 'PENDING',
                issueDate: new Date()
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                employee: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        // Vincula os itens ao pedido
        await tx.orderItem.updateMany({
            where: { id: { in: items.map(item => item.id) } },
            data: { orderId: order.id }
        });

        // Atualiza estoque dos produtos
        await Promise.all(items.map(item => {
            return tx.product.update({
                where: { id: item.productId },
                data: { 
                    stock: { decrement: item.quantity },
                    updatedAt: new Date()
                }
            });
        }));

        // Retorna o pedido com informações básicas
        return {
            ...order,
            items: items.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.unitPrice
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