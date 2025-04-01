import * as productService from '../products/products.service.js'

export const createProduct = async (req, res) => {
    const { name, description, price, image, stock } = req.body

    if(!name || !description || !price || !image || !stock) {
        res.status(400).json({ Error: 'Todos os campos são obrigatórios' })
        return
    }
    try {
        const newProduct = await productService.createNewProduct({
            name,
            description,
            price,
            image,
            stock
        })

        return res.status(201).json({ 
            Message: 'Novo Produto adicionado com sucesso.',
            newProduct
        })
    } catch(Execption) {
        console.error('Erro ao adicionar Produto', Execption.message)
        res.status(500).json({ Error: 'Erro interno do servidor.' })
    }
}
export const getProduct = async (req, res) => {
    try {
        
        const products = await productService.listAllProducts()
        return res.status(200).json({ 
            Message: 'Todos os produtos recuperados com sucesso.', 
            products
         })

    } catch(Exception){
        console.error('Erro ao buscar Produtos', Exception.message)
        return res.status(500).json({ Error: 'Erro interno do servidor.' })
    }
}

export const ProductById = async (req, res) => {
    const { id } = req.params
    
    try {

        const product = await productService.getProductById(id)
        
        return res.status(200).json({ 
            Message: 'Produto recuperado com sucesso.', 
            product
         })

    } catch(Exception){
        console.error('Erro ao recuperar Produto', Exception.message)        
        return res.status(500).json({ Error: 'Erro interno do servidor.' })
    }
}

export const updateProduct = async (req, res) => {
    const { id } =  req.params
    const { name, description, price, image, stock } = req.body

    try {
        const getProductById = await productService.getProductById(id)

        if(!getProductById){
            return res.status(404).json({ 
                Message: 'Nenhum Produto encontrado com o ID informado.',
                Product: id
            })
        }

        const newInfosProduct = {}
        if(name) newInfosProduct.name = name
        if(description) newInfosProduct.description = description
        if(price) newInfosProduct.price = price
        if(image) newInfosProduct.image = image
        if(stock) newInfosProduct.stock = stock
        

        if (Object.keys(newInfosProduct).length === 0) {
            return res.status(400).json({ Error: 'Nenhum campo valido foi alterado.' })
        }

        const infosProduct = await productService.updateProduct(id, newInfosProduct)

        return res.status(200).json({ 
            Message: 'Dados alterados com sucesso.',
            UpdatedProduct: infosProduct
        })
    } catch(Exception) {
        console.error('Erro ao atualizar Dados do colaborador:', Exception.message)
        return res.status(500).json({ Error: 'Erro interno do servidor.' })
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params

    try {
        const product = await productService.getProductById(id)

        if(!product) {
            return res.status(404).json({ Message: 'Nenhum Produto encontrado com o ID informado.' })
        }

        await productService.deleteProduct(id)

        return res.status(200).json({ Message: 'Produto deletado com sucesso.' })
         
    } catch(Exception) {
        console.error('Erro ao Deletar colaborador da base de dados:', Exception.message)
        return res.status(500).json({  Error: 'Erro interno do servidor.' })
    }
}