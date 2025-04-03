import { Router } from 'express';
import controller from './orders.controller.js'

const router = Router();

// ====================================
// Order Item Routes
// ====================================
router.post('/items', controller.addItem);          // Criar item
router.put('/items/:id', controller.updateItem);    // Atualizar item
router.delete('/items/:id', controller.removeItem); // Remover item
router.get('/items/pending', controller.listPendingItems); // Listar carrinho

// ====================================
// Order Routes
// ====================================
router.post('/order', controller.createOrder);           // Criar pedido
router.get('/order/:id', controller.getOrder);           // Ver pedido
router.patch('/order/:id/status', controller.updateOrderStatus); // Atualizar status
router.delete('/order/:id', controller.cancelOrder);     // Cancelar pedido
router.get('/', controller.listOrders);            // Listar pedidos (com filtros)

export default router;