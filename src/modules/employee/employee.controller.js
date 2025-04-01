import * as employeeService from '../employee/employee.service.js'

export const createEmployee = async (req, res) => {
    const { name, email, role, salary, admissionDate, phone, password } = req.body

    if(!name || !email || !role || !salary || !admissionDate || !phone || !password) {
        res.status(400).json({ Error: 'Tods os campos são obrigatórios' })
        return
    }
    try {
        const newEmployee = await employeeService.createEmployee({
            name,
            email,
            role,
            salary,
            admissionDate,
            phone,
            password
        })

        return res.status(201).json({ 
            Message: 'Novo colaborador adicionado com sucesso.',
            newEmployee
        })
    } catch(Execption) {
        console.error('Erro ao adicionar Funcionario', Execption)
        res.status(500).json({ Error: 'Erro internio do servidor.' })
    }
}
export const getEmployee = async (req, res) => {
    try {
        const employees = await employeeService.getEmployee()
        return res.status(200).json({ 
            Message: 'Funcionarios recuperados com sucesso.', 
            employees
         })
    } catch(Exception){
        console.error('Erro ao buscar Funcionario', Exception)
        return res.status(500).json({ Error: 'Erro internio do servidor.' })
    }
}