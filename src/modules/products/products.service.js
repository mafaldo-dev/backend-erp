import prisma from '../../../prisma/prismaClient.js '

export const createNewProduct = async(data) => {
    const { name, description, price, image, stock } = data

    const newProduct = await prisma.product.create({
        data: {
            name,
            description,
            price,
            image,
            stock,
        }
    })
    return newProduct
}

export const getProductById = async (id) => {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: id 
            }
        })
        return product
    } catch (error) {
        throw new Error('Erro ao buscar produto pelo ID: ' + error.message)
    }
}

export const updateProduct = async (id, data) => {
    const product = await prisma.product.findUnique({ where: { id}})
    if(!product) {
        return null
    }

    const updateData = { ...data}

    return prisma.product.update({
        where: { id },
        data: updateData
    })
}

export const deleteProduct = async (id) => {
    try {
        const deleteProduct = await prisma.product.delete({ 
            where: { 
                id: id 
            }
        })
        return deleteProduct
    } catch(Exception) {
        throw new Error('Erro ao exluir Produto:', Exception.message)
    }
}

export const listAllProducts = async () => {
    const products = await prisma.product.findMany()
    return products
}