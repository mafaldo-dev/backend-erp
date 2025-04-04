import { Router } from 'express';
import controller from './orders.controller.js'

const router = Router();

// ====================================
// Order Item Routes
// ====================================
router.post('/items', controller.addItem);          
router.get('/items/pending', controller.listPendingItems); 
router.put('/items/:id', controller.updateItem);    
router.delete('/items/:id', controller.removeItem);

// ====================================
// Order Routes
// ====================================
router.post('/order', controller.createOrder);           
router.get('/', controller.listOrders);            
router.get('/order/:id', controller.getOrder);         
router.patch('/order/:id/status', controller.updateOrderStatus); 
router.delete('/order/:id', controller.cancelOrder);     

export default router;