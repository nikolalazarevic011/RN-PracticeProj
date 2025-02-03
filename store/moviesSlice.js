import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMovies } from "../util/http"; // ✅ API function with Axios

// ✅ Thunk to fetch movies (instead of calling axios inside slice)
export const loadMovies = createAsyncThunk("movies/loadMovies", async (_, { getState }) => {
    const state = getState(); // ✅ Access current Redux state
    const page = state.movies.page; // ✅ Get current page from Redux
    const newMovies = await fetchMovies(page); // ✅ API call with Axios
    return { movies: newMovies, nextPage: page + 1 }; // ✅ Return data to Redux
});

const moviesSlice = createSlice({
    name: "movies",
    initialState: {
        list: [],
        page: 1,
    },
    reducers: {}, // No need for manual reducers for async data
    extraReducers: (builder) => {
        builder.addCase(loadMovies.fulfilled, (state, action) => {
            state.list = [...state.list, ...action.payload.movies]; // ✅ Append new movies
            state.page = action.payload.nextPage; // ✅ Update page count
        });
    },
});

export default moviesSlice.reducer;
