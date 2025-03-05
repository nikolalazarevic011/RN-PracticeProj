import React, { useEffect, useLayoutEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
    addToWatchlistFirebase,
    fetchMovieByIdAsync,
    fetchMovieByIdLocally,
    removeFromWatchlistFirebase,
} from "../store/moviesSlice";
import IconButton from "../components/UI/IconButton";
import MovieItem from "../components/MovieItem";

const MovieDetail = ({ route, navigation }) => {
    const { movieId } = route.params;
    const dispatch = useDispatch();
    const movie = useSelector((state) => state.movies.selectedMovie);
    const watchlist = useSelector((state) => state.movies.watchlist);
    const uid = useSelector((state) => state.auth.uid);

    const isOnWatchlist = movie
        ? watchlist.some((item) => item.id === movie.id)
        : false;

    useEffect(() => {
        const loadMovie = () => {
            const result = dispatch(fetchMovieByIdLocally(movieId));
            if (!result.payload) {
                // If no movie was found locally, fetch it from the remote source.
                dispatch(fetchMovieByIdAsync(movieId));
            }
        };
        loadMovie();
    }, [dispatch, movieId]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton
                    icon={isOnWatchlist ? "star" : "star-outline"}
                    size={24}
                    color="white"
                    onPress={() => {
                        if (movie) {
                            if (isOnWatchlist) {
                                dispatch(removeFromWatchlistFirebase(movieId));
                            } else {
                                dispatch(addToWatchlistFirebase(movie));
                            }
                        }
                    }}
                />
            ),
        });
    }, [navigation, dispatch, movie, isOnWatchlist]);

    if (!movie) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <MovieItem item={movie} id={movie.id} />
        </ScrollView>
    );
};

export default MovieDetail;
