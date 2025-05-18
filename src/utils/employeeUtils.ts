import { Employee } from "../Types";

export const checkDuplicateEmployeeIds = (allEmployeeData: Employee[], idValue: string): boolean => {
    for (let employee of allEmployeeData) {
        if (employee.empId === idValue) return true;
    }
    return false
}

export const checkDuplicateEmployeeEMails = (allEmployeeData: Employee[], email: string): boolean => {
    for (let employee of allEmployeeData) {
        if (employee.email === email) return true;
    }
    return false
}