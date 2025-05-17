import { configureStore } from "@reduxjs/toolkit";
import { employeeApi } from "../services/employeeService";
import rootReducer from "./rootReducer";

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => (
        getDefaultMiddleware()
            .concat(employeeApi.middleware)
    )
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch