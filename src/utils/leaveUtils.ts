import { Leave, LeaveTypes } from "../Types"

export const calculateLeaveTypes = (leaveData: Leave[]): LeaveTypes => {
    let paidLeaves: number = 0
    let unPaidLeaves: number = 0
    for (let leave of leaveData) {
        if (leave.status !== "Cancelled" && leave.status !== "rejected") {
            if (leave.leaveType === "paid") {
                paidLeaves = paidLeaves + leave.dayDifference
            }
            else if (leave.leaveType === 'unpaid') {
                unPaidLeaves = unPaidLeaves + leave.dayDifference
            }
        }
    }
    return { paidLeaves, unPaidLeaves }
}

export const compareUpdatedData = (initialData: Leave, leaveForm: Leave): boolean => {
    let result: boolean = false;
    (Object.keys(initialData) as Array<keyof Leave>).forEach((key) => {
        if (initialData[key] !== leaveForm[key]) {
            result = true
        }
    });
    return result;
}

export const convertFirstLetterToUpperCase = (value: string): string => {
    return value.charAt(0).toUpperCase() + value.slice(1)
}
export const convertFirstLetterToLowerCase = (value: string): string => {
    return value.charAt(0).toLowerCase() + value.slice(1)
}

export const checkDuplicatedLeaves = (allLeaveData: Leave[], startDate: string, endDate: string): boolean => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    for (let leave of allLeaveData) {
        const leaveStart = new Date(leave.startDate)
        const leaveEnd = new Date(leave.endDate)
        const startValidation = (start >= leaveStart) && (leaveEnd >= start)
        const endValidation = (end >= leaveStart) && (leaveEnd >= end) 
        if ((startValidation || endValidation) && leave.status !== "Cancelled") {
            return false
        }
    }
    return true
}