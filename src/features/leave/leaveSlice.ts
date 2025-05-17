import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Leave } from "../../Types"
interface LeaveState {
    initialData: Leave | null,
    updateLeaveItem: Leave | null,
    refetchLeaveHistory: boolean,
    leaveTypeFilter: string,
    leaveStatusFilter: string
}
const initialState: LeaveState = {
    initialData: null,
    updateLeaveItem: null,
    refetchLeaveHistory: false,
    leaveTypeFilter: "all",
    leaveStatusFilter: 'all'
}
const leaveSlice = createSlice({
    name: 'leave',
    initialState,
    reducers: {
        setLeaveInitialData: (state: LeaveState, action: PayloadAction<Leave | null>) => {
            state.initialData = action.payload
        },
        setUpdateLeaveItem: (state: LeaveState, action: PayloadAction<Leave>) => {
            state.updateLeaveItem = action.payload
        },
        setRefetchLeaveHistory: (state: LeaveState, action: PayloadAction<boolean>) => {
            state.refetchLeaveHistory = action.payload
        },
        setLeaveTypeFilter: (state: LeaveState, action: PayloadAction<string>) => {
            state.leaveTypeFilter = action.payload
        },
        setLeaveStatusFilter: (state: LeaveState, action: PayloadAction<string>) => {
            state.leaveStatusFilter = action.payload
        }
    }
})
export const {
    setLeaveInitialData,
    setUpdateLeaveItem,
    setRefetchLeaveHistory,
    setLeaveTypeFilter,
    setLeaveStatusFilter } = leaveSlice.actions
export default leaveSlice;