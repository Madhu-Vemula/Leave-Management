import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Leave } from "../../Types";
interface ManagerState {
    actionStatus: string,
    leaveData: Leave | null
}

const initialState: ManagerState = {
    actionStatus: '',
    leaveData: null
}
const managerSlice = createSlice({
    name: 'manager',
    initialState,
    reducers: {
        setActionStatus: (state: ManagerState, action: PayloadAction<string>) => {
            state.actionStatus = action.payload
        },
        setLeaveData: (state: ManagerState, action: PayloadAction<Leave>) => {
            state.leaveData = action.payload
        }
    }
})

export const { setActionStatus, setLeaveData } = managerSlice.actions
export default managerSlice;