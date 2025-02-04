import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMovies } from "../util/http"; // ✅ API function with Axios

// ✅ Thunk to fetch movies (instead of calling axios inside slice)
export const loadMovies = createAsyncThunk(
    "movies/loadMovies",
    async (_, { getState }) => {
        const state = getState(); // ✅ Access current Redux state
        const page = state.movies.page; // ✅ Get current page from Redux
        const newMovies = await fetchMovies(page); // ✅ API call with Axios
        return { movies: newMovies, nextPage: page + 1 }; // ✅ Return data to Redux
    }
);

export const fetchMovieById = createAsyncThunk(
    "movies/fetchMovieById",
    async (movieId, { getState }) => {
        const state = getState();
        const movie = state.movies.list.find((m) => m.id === movieId);
        return movie ? movie : null;
    }
);

const moviesSlice = createSlice({
    name: "movies",
    initialState: {
        list: [],
        page: 1,
        selectedMovie: null,
        watchlist: [],
    },
    reducers: {
        addToWatchlist: (state, action) => {
            const exists = state.watchlist.find(
                (movie) => movie.id === action.payload.id
            );
            if (!exists) {
                state.watchlist.push(action.payload);
            }
        },
        removeFromWatchlist: (state, action) => {
            state.watchlist = state.watchlist.filter(movie => movie.id !== action.payload.id);
          },
    }, 
    extraReducers: (builder) => { //async data gotta use this
        builder
            .addCase(loadMovies.fulfilled, (state, action) => {
                state.list = [...state.list, ...action.payload.movies]; // ✅ Append new movies
                state.page = action.payload.nextPage; // ✅ Update page count
            })
            .addCase(fetchMovieById.fulfilled, (state, action) => {
                state.selectedMovie = action.payload;
            });
    },
});

export const { addToWatchlist , removeFromWatchlist} = moviesSlice.actions;
export default moviesSlice.reducer;
