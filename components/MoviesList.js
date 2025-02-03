import React from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loadMovies } from "../store/moviesSlice"; // ✅ Import Redux action
import MovieItem from "./MovieItem";

const MoviesList = () => {
    const dispatch = useDispatch();

    const loading = useSelector((state) => state.ui.loading);
    const movies = useSelector((state) => state.movies.list);

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <FlatList
                data={movies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <MovieItem item={item} id={item.id} />
                )}
                onEndReached={() => {
                    dispatch(loadMovies()); // ✅ Dispatch Redux action on scroll
                }}
                onEndReachedThreshold={0.5}
                initialNumToRender={10}
                removeClippedSubviews={true}
                ListFooterComponent={
                    loading ? (
                        <ActivityIndicator size="large" color="#007AFF" />
                    ) : null
                }
            />
        </View>
    );
};

export default MoviesList;
