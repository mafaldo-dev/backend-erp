import express from 'express'
import * as employeeController from './employee.controller.js'

const router = express.Router()

router.post('/employee', employeeController.createEmployee)
router.get('/employee', employeeController.getEmployee)

export default router