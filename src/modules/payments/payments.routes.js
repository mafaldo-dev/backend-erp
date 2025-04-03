import express from "express";
import * as paymentController from "../payments/payments.controller.js";

const router = express.Router();

router.post("/payment", paymentController.createPayment);
router.get("/payment", paymentController.listAllPayments);
router.get("/payment/:id", paymentController.getPaymentById);
router.put("/payment/:id", paymentController.updatePayment);
router.delete("/payment/:id", paymentController.deletePayment);

export default router;
