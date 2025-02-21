import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMovies, fetchSingleMovie } from "../util/http"; // ✅ API function with Axios
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, set, get } from "firebase/database";
import { db } from "../firebaseConfig";
import auth from "@react-native-firebase/auth";

// ✅ Fetch Watchlist from Firebase for the logged-in user
export const fetchWatchlist = createAsyncThunk(
    "movies/fetchWatchlist",
    async (_, { getState }) => {
        const uid = getState().auth.uid;
        if (!uid) return [];

        try {
            const watchlistRef = ref(db, `watchlists/${uid}`);
            const snapshot = await get(watchlistRef);

            return snapshot.exists() ? snapshot.val() : [];
        } catch (error) {
            console.error("Error fetching watchlist:", error);
            return [];
        }
    }
);

// ✅ Save Watchlist (Adding a Movie)
export const addToWatchlistFirebase = createAsyncThunk(
    "movies/addToWatchlistFirebase",
    async (movie, { getState }) => {
        const uid = getState().auth.uid;
        if (!uid) return;

        try {
            const watchlistRef = ref(db, `watchlists/${uid}`);
            const currentWatchlist = getState().movies.watchlist;
            const updatedWatchlist = [...currentWatchlist, movie];

            await set(watchlistRef, updatedWatchlist); // Save to Firebase

            return movie;
        } catch (error) {
            console.error("Error adding to watchlist:", error);
            return null;
        }
    }
);

// ✅ Remove from Watchlist
export const removeFromWatchlistFirebase = createAsyncThunk(
    "movies/removeFromWatchlistFirebase",
    async (movieId, { getState }) => {
        const uid = getState().auth.uid;
        if (!uid) return;

        try {
            const watchlistRef = ref(db, `watchlists/${uid}`);
            const updatedWatchlist = getState().movies.watchlist.filter(
                (movie) => movie.id !== movieId
            );

            await set(watchlistRef, updatedWatchlist); // Update Firebase

            return movieId;
        } catch (error) {
            console.error("Error removing from watchlist:", error);
            return null;
        }
    }
);

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

export const fetchMovieByIdLocally = createAsyncThunk(
    "movies/fetchMovieByIdLocally",
    async (movieId, { getState }) => {
        const state = getState();
        const movie = state.movies.list.find((m) => m.id === movieId);
        return movie ? movie : null;
    }
);
export const fetchMovieByIdAsync = createAsyncThunk(
    "movies/fetchMovieByIdAsync",
    async (movieId, { getState }) => {
        const state = getState();
        const movie = await fetchSingleMovie(movieId);
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
            state.watchlist = state.watchlist.filter(
                (movie) => movie.id !== action.payload.id
            );
        },
    },
    extraReducers: (builder) => {
        //async data gotta use this
        builder
            .addCase(loadMovies.fulfilled, (state, action) => {
                state.list = [...state.list, ...action.payload.movies]; // ✅ Append new movies
                state.page = action.payload.nextPage; // ✅ Update page count
            })
            .addCase(fetchMovieByIdLocally.fulfilled, (state, action) => {
                state.selectedMovie = action.payload;
            })
            .addCase(fetchMovieByIdAsync.fulfilled, (state, action) => {
                state.selectedMovie = action.payload;
            })
            .addCase(fetchWatchlist.fulfilled, (state, action) => {
                state.watchlist = action.payload;
            })
            .addCase(addToWatchlistFirebase.fulfilled, (state, action) => {
                if (action.payload) {
                    state.watchlist.push(action.payload);
                }
            })
            .addCase(removeFromWatchlistFirebase.fulfilled, (state, action) => {
                state.watchlist = state.watchlist.filter(
                    (movie) => movie.id !== action.payload
                );
            });
    },
});

export const { addToWatchlist, removeFromWatchlist } = moviesSlice.actions;
export default moviesSlice.reducer;
