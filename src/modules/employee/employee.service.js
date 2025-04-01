import prisma from '../../../prisma/prismaClient.js '

export const createNewEmployee = async(data) => {
    const { name, email, role, salary, admissionDate, phone, password } = data

    
    if(!data.email.includes('@')) {
        throw new Error('Insira um E-mail válido')
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const newEmployee = await prisma.employee.create({
        data: {
            name,
            email,
            role,
            salary,
            admissionDate,
            phone,
            password: hashedPassword
        }
    })
    return newEmployee
}

export const updateEmployee = async (id, data) => {
    const employee = await prisma.employee.findUnique({ where: { id}})
    if(!employee) {
        return null
    }

    const updateData = { ...data}

    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10)
    }

    return prisma.employee.update({
        where: { id },
        data: updateData
    })
}

export const deleteEmployee = async (id) => {
    const employee = await prisma.employee.findUnique({ where: { id }})

    if(!employee) {
        return null
    }

    await prisma.employee.delete({ where: { id }})
    return  { Message: 'Colaborador excluido da base de dados.' }
}

export const listAllEmployees = async () => {
    const employees = await prisma.employee.findMany()
    return employees
}