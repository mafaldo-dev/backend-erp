import prisma from '../../../prisma/prismaClient.js'

export const createPayments = async (data) => {
    const { orderId, amount, status, method, transatioId } = data

    const existngOrder = await prisma.order.findUnique({
        where: { id: orderId} 
    })

    if(!existngOrder) {
        throw new Error('Nenhum pedido encontrado.')
    }

    return await prisma.payment.create({
        data: { orderId, amount, status, method, transatioId }
    })
}

export const getPaymentsById = async(id) => {
    return await prisma.payment.findUnique({ 
        where: { id }
    })
}

export const listAllPayments = async () => {
    return await prisma.payment.findMany()
}

export const updatePayment = async (id, data) => {
    return await prisma.payment.update({
        where: { id },
        data
    })
}

export const deletePayment = async (id) => {
    return await prisma.payment.delete({
        where: { id }
    })
}