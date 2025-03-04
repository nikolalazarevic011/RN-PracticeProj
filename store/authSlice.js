// authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../store/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

// Set up auth state listener when your app initializes
export const initAuthListener = (dispatch) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            dispatch(setUser({
                uid: user.uid,
                email: user.email,
                // Other user fields you need
            }));
        } else {
            dispatch(clearUser());
        }
    });
};

const authSlice = createSlice({
    name: "auth",
    initialState: {
        uid: null,
        email: null,
        token: null,
        isAuthenticated: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.uid = action.payload.uid;
            state.email = action.payload.email;
            state.token = action.payload.idToken;
            state.isAuthenticated = true;
        },
        clearUser: (state) => {
            state.uid = null;
            state.email = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;