
export interface ProtectedRouteProps {
    children: React.ReactNode,
    role: string
}
export interface Leave {
    id?: string,
    empId: string,
    email: string,
    startDate: string,
    endDate: string,
    leaveType: string,
    reason: string,
    dayDifference: number,
    status: string,
    respondedBy?: string
}
export interface Employee {
    id?: string,
    empId: string,
    name: string,
    email: string,
    role: string,
    managerEmail: string,
    leaveBalance: number,
    password: string
}
export interface User {
    email: string,
    password: string,
    role?: string
}

export interface LeaveStatusProps {
    leave: Leave
}

export interface LeaveTypes {
    paidLeaves: number,
    unPaidLeaves: number
}

export interface DonutChartProps {
    leaveTypes: LeaveTypes
}
export interface ProfileProps {
    employeeData: Employee
}
export interface EmployeeDataProps {
    employeeData: Employee
}
export interface LeaveBalanceCardProps {
    leaveData: Leave[],
    employeeData: Employee
}

export interface LeaveState {
    initialData: Leave | null,
    updateLeaveItem: Leave | null,
    refetchLeaveHistory: boolean,
    leaveTypeFilter: string,
    leaveStatusFilter: string
} 

export interface EmployeeState {
    initialData: Employee | null,
    showCancelPopUp: boolean
} 

export interface ManagerState {
    actionStatus: string,
    leaveData: Leave | null
}