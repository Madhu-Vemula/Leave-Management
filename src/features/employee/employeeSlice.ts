import { Employee ,EmployeeState} from "../../Types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"


const initialState: EmployeeState = {
    initialData: null,
    showCancelPopUp: false
}

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        setEmployeeInitialData: (state: EmployeeState, action: PayloadAction<Employee | null>) => {
            state.initialData = action.payload
        },
        setCancelPopUp: (state: EmployeeState, action: PayloadAction<boolean>) => {
            state.showCancelPopUp = action.payload
        }
    }
})

export default employeeSlice;
export const { setEmployeeInitialData, setCancelPopUp } = employeeSlice.actions