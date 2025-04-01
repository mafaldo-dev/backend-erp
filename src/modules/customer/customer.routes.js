import express from 'express'
import * as customerController from './customer.controller.js'

const router = express.Router()

router.post('/customer', customerController.createCustomer)
router.get('/customer', customerController.getCustomer)
router.put('/customer/:id', customerController.updateCustomer)
router.delete('/customer/:id', customerController.deleteCustomer)
export default router