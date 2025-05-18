import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Leave, ManagerState } from "../../Types";

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