import express from 'express'
import * as productController from './products.controller.js'

const router = express.Router()

router.post('/product', productController.createProduct)
router.get('/product', productController.getProduct)
router.put('/product/:id', productController.updateProduct)
router.delete('/product/:id', productController.deleteProduct)
export default router