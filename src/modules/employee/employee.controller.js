import * as employeeService from '../employee/employee.service.js'

export const createEmployee = async (req, res) => {
    const { name, email, role, salary, admissionDate, phone, password } = req.body

    if(!name || !email || !role || !salary || !admissionDate || !phone || !password) {
        res.status(400).json({ Error: 'Todos os campos são obrigatórios' })
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
        console.error('Erro ao adicionar Funcionario', Execption.message)
        res.status(500).json({ Error: 'Erro interno do servidor.' })
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
        console.error('Erro ao buscar Funcionario', Exception.message)
        return res.status(500).json({ Error: 'Erro interno do servidor.' })
    }
}

export const updateEmployee = async (req, res) => {
    const { id } =  req.params
    const { name, email, role, salary, admissionDate, phone, password } = req.body

    try {
        const getEmployeeById = await employeeService.getEmployeeById(id)

        if(!getEmployeeById){
            return res.status(404).json({ 
                Message: 'Nenhum colaborador encontrado com o ID informado.',
                UserId: id
            })
        }

        const newInfosEmployee = {}
        if(name) newInfosEmployee.name = name
        if(email) newInfosEmployee.email = email
        if(role) newInfosEmployee.role = role
        if(salary) newInfosEmployee.salary = salary
        if(admissionDate) newInfosEmployee.admissionDate = admissionDate
        if(phone) newInfosEmployee.phone = phone
        if(password) newInfosEmployee.password = password

        if (Object.keys(newInfosEmployee).length === 0) {
            return res.status(400).json({ Error: 'Nenhum campo valido foi alterado.' })
        }

        const infosEmployee = await employeeService.updateEmployee(id, newInfosEmployee)

        return res.status(200).json({ 
            Message: 'Dados alterados com sucesso.',
            UpdatedEmployee: infosEmployee
        })
    } catch(Exception) {
        console.error('Erro ao atualizar Dados do colaborador:', Exception.message)
        return res.status(500).json({ Error: 'Erro interno do servidor.' })
    }
}

export const deleteEmployee = async (req, res) => {
    const { id } = req.params

    try {
        const deleteEmployee = await employeeService.getEmployeeById(id)

        if(!deleteEmployee) {
            return res.status(404).json({ Message: 'Nenhum colaborador encontrado com o ID informado.' })
        }

        return res.status(200).json({ 
            Message: 'Colaborador excluido da base de dados com sucesso.'
         })
         
    } catch(Exception) {
        console.error('Erro ao Deletar colaborador da base de dados:', Exception.message)
        return res.status(500).json({  Error: 'Erro interno do servidor.' })
    }
}