import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // # action 1
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;     
        },
        // # action 1
        logout: () => initialState
    }
})

export default authSlice.reducer;
export const { login, logout } = authSlice.actions;
