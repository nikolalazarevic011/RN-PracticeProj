// redux/store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./moviesSlice"; // Example reducer for movies
import uiReducer from "./uiSlice"; // Example reducer for movies
import authReducer from "./authSlice"; // Example reducer for movies

import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const rootReducer = combineReducers({
    movies: moviesReducer,
    ui: uiReducer,
    auth: authReducer
  });

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    // Optionally whitelist (or blacklist) specific slices:
    whitelist: ["movies", "ui", 'auth'], // Ensure reducers are persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // needed for redux-persist actions
        }),
});

export const persistor  = persistStore(store)