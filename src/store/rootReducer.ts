import { combineReducers } from "@reduxjs/toolkit";
import uiSlice from "./uiSlice";
import leaveSlice from "../features/leave/leaveSlice";
import employeeSlice from "../features/employee/employeeSlice";
import managerSlice from "../features/dashboard/managerSlice";
import { employeeApi } from "../services/employeeService";

const rootReducer = combineReducers({
    [uiSlice.reducerPath]: uiSlice.reducer,
    [leaveSlice.reducerPath]: leaveSlice.reducer,
    [employeeSlice.reducerPath]: employeeSlice.reducer,
    [managerSlice.reducerPath]: managerSlice.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer
});

export default rootReducer;
