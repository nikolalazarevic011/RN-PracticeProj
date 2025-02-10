import React from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loadMovies } from "../store/moviesSlice"; // ✅ Import Redux action
import MovieItem from "./MovieItem";

const MoviesList = ({ data }) => {
    const dispatch = useDispatch();

    const loading = useSelector((state) => state.ui.loading);
    const movies = data || useSelector((state) => state.movies.list);

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <FlatList
                data={movies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <MovieItem item={item} id={item.id} />
                )}
                onEndReached={() => {
                    // Only load more if no external data was passed:
                    if (!data) {
                        dispatch(loadMovies());
                    }
                }}
                onEndReachedThreshold={0.5}
                initialNumToRender={10}
                removeClippedSubviews={true}
                ListFooterComponent={
                    // Only show footer if loading and we're not using passed data:
                    loading && !data ? (
                        <ActivityIndicator size="large" color="#007AFF" />
                    ) : null
                }
            />
        </View>
    );
};

export default MoviesList;
