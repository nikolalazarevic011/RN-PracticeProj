import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: "",
        uid: null,
        isAuthenticated: false,
    },
    reducers: {
        authenticate: (state, action) => {
            state.token = action.payload.token;
            state.uid = action.payload.uid; 
            state.isAuthenticated = true;
        },
        logout: (state, action) => {
            state.token = "";
            state.uid = null;
            state.isAuthenticated = false;
        },
    },
});

export const { authenticate, logout } = authSlice.actions;
export default authSlice.reducer;
