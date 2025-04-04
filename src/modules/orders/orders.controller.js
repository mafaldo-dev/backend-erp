import service from './orders.service.js';


  // ==========================================
  // INITIAL ORDER 
  // ==

export default {
  async addItem(req, res) {
    try {
      const item = await service.createOrderItem(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateItem(req, res) {
    try {
      const updatedItem = await service.updateOrderItem(
        req.params.id, 
        req.body
      );
      res.json(updatedItem);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async removeItem(req, res) {
    try {
      await service.deleteOrderItem(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async listPendingItems(req, res) {
    try {
      const items = await service.getPendingOrderItems();
      res.json(items);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // ==========================================
  // ORDER METHODS (Pedidos completos + NF)
  // ==========================================

  async createOrder(req, res) {
    
    try {
      
      const { customerId, employeeId, paymentMethod } = req.body;

      const order = await service.createFinalOrder({
        customerId,
        employeeId,
        paymentMethod
      });
      
      const invoiceData = await service.getOrderForInvoice(order.id);
      res.status(201).json(invoiceData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateOrderStatus(req, res) {
    try {
      const updatedOrder = await service.updateOrder(
        req.params.id, 
        { status: req.body.status }
      );
      res.json(updatedOrder);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async cancelOrder(req, res) {
    try {
      await service.cancelOrderWithItems(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },


  async getOrder(req, res) {
    try {
      const order = await service.getOrderWithItems(req.params.id);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async listOrders(req, res) {
    try {
      const orders = await service.getAllOrders(req.query);
      res.json(orders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};