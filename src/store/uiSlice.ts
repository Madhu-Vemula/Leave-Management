import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UIState {
    showFormPopUp: boolean
}
const initialState: UIState = {
    showFormPopUp: false
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setShowPopUp: (state: UIState, action: PayloadAction<boolean>) => {
            state.showFormPopUp = action.payload
        }
    }
})

export const { setShowPopUp }=uiSlice.actions; 
export default uiSlice