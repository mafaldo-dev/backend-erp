import prisma from '../../../prisma/prismaClient.js'

export const createNewCustomer = async(data) => {
    const { name, email, phone, birthDate } = data
    console.log(data)

    const newCustomer = await prisma.customerData.create({
        data: {
            name,
            email,
            phone,
            birthDate
        }
    })
    return newCustomer
}

export const getCustomerById = async (id) => {
    try {
        const customer = await prisma.customerData.findUnique({
            where: {
                id: id 
            }
        })
        return customer

    } catch (error) {
        throw new Error('Erro ao buscar Cliente pelo ID: ' + error.message)
    }
}

export const updateCustomer = async (id, data) => {
    const customer = await prisma.customerData.findUnique({ where: { id}})
    if(!customer) {
        return null
    }

    const updateData = { ...data}

    return prisma.customerData.update({
        where: { id },
        data: updateData
    })
}

export const deleteCustomer = async (id) => {
    try {
        const deleteCustomer = await prisma.customerData.delete({ 
            where: { 
                id: id 
            }
        })
        return deleteCustomer
    } catch(Exception) {
        throw new Error('Erro ao exluir Cliente:', Exception.message)
    }
}

export const listAllCustomer = async () => {
    const customer = await prisma.customerData.findMany()
    return customer
}