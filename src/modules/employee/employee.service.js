import prisma from '../../../prisma/prismaClient.jsgi '

export const createNewEmployee = async(data) => {
    if(!data.email.includes('@')) {
        throw new Error('Insira um E-mail válido')
    }

    const newEmployee =await prisma.employee.create({
        data: {
            name: data.name,
            email: data.email,
            role: data.role,
            salary: data.salary,
            admissionDate: data.admissionDate,
            phone: data.phone,
            password: data.password
        }
    })
    return newEmployee
}

export const listAllEmployees = async () => {
    const employees = await prisma.employee.findMany()
    return employees
}