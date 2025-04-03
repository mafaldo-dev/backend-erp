import * as paymentService from "../payments/payments.service.js";

export const createPayment = async (req, res) => {
    try {
        const payment = await paymentService.createPayments(req.body);
        return res.status(201).json(payment);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const getPaymentById = async (req, res) => {
    try {
        const payment = await paymentService.getPaymentsById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: "Pagamento não encontrado." });
        }
        return res.json(payment);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const listAllPayments = async (req, res) => {
    try {
        const payments = await paymentService.listAllPayments();
        return res.json(payments);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updatePayment = async (req, res) => {
    try {
        const updatedPayment = await paymentService.updatePayment(req.params.id, req.body);
        return res.json(updatedPayment);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const deletePayment = async (req, res) => {
    try {
        await paymentService.deletePayment(req.params.id);
        return res.status(204).send(); 
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
