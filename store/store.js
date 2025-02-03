// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./moviesSlice"; // Example reducer for movies
import uiReducer from "./uiSlice"; // Example reducer for movies

export const store = configureStore({
    reducer: {
        movies: moviesReducer,
        ui: uiReducer,
    },
});
