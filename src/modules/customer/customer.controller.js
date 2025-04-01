import * as customerService from '../customer/customer.service.js'

export const createCustomer = async (req, res) => {
    const { name, email, birthDate, phone } = req.body

    if(!name || !email || !phone || !birthDate) {
        res.status(400).json({ Error: 'Todos os campos são obrigatórios' })
        return
    }
    try {
        const newCustomer = await customerService.createNewCustomer({
            name,
            email,
            phone,
            birthDate
        })

        return res.status(201).json({ 
            Message: 'Novo Cliente adicionado com sucesso.',
            newCustomer
        })

    } catch(Execption) {
        console.error('Erro ao adicionar Cliente', Execption.message)
        res.status(500).json({ Error: 'Erro interno do servidor.' })
    }
}
export const getCustomer = async (req, res) => {
    try {
        const customer = await customerService.listAllCustomer()
        
        return res.status(200).json({ 
            Message: 'Lista de Clientes recuperados com sucesso.', 
            customer
         })

    } catch(Exception){
        console.error('Erro ao buscar Clientes', Exception.message)
        return res.status(500).json({ Error: 'Erro interno do servidor.' })
    }
}

export const customerById = async (req, res) => {
    const { id } = req.params
    
    try {

        const customer = await customerService.getCustomerById(id)
        
        return res.status(200).json({ 
            Message: 'Cliente recuperado com sucesso.', 
            customer
         })

    } catch(Exception){
        console.error('Erro ao recuperar Cliente', Exception.message)        
        return res.status(500).json({ Error: 'Erro interno do servidor.' })
    }
}

export const updateCustomer = async (req, res) => {
    const { id } =  req.params
    const { name, email, phone, birthDate } = req.body

    try {
        const getCustomerById = await customerService.getCustomerById(id)

        if(!getCustomerById){
            return res.status(404).json({ 
                Message: 'Nenhum Cliente encontrado com o ID informado.',
                Customer: id
            })
        }

        const newInfosCustomer = {}
        if(name) newInfosCustomer.name = name
        if(email) newInfosCustomer.email = email
        if(phone) newInfosCustomer.phone = phone
        if(birthDate) newInfosCustomer.birthDate = birthDate

        if (Object.keys(newInfosCustomer).length === 0) {
            return res.status(400).json({ Error: 'Nenhum campo valido foi alterado.' })
        }

        const infosCustomer = await customerService.updateCustomer(id, newInfosCustomer)

        return res.status(200).json({ 
            Message: 'Dados alterados com sucesso.',
            UpdatedCustomer: infosCustomer
        })
    } catch(Exception) {
        console.error('Erro ao atualizar Dados do Cliente:', Exception.message)
        return res.status(500).json({ Error: 'Erro interno do servidor.' })
    }
}

export const deleteCustomer= async (req, res) => {
    const { id } = req.params

    try {
        const customer = await customerService.getCustomerById(id)

        if(!customer) {
            return res.status(404).json({ Message: 'Nenhum Cliente encontrado com o ID informado.' })
        }

        await customerService.deleteCustomer(id)

        return res.status(200).json(deleteCustomer)
         
    } catch(Exception) {
        console.error('Erro ao Deletar Cliente da base de dados:', Exception.message)
        return res.status(500).json({  Error: 'Erro interno do servidor.' })
    }
}