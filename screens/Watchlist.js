import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { Card } from "@rneui/themed";
import MovieItem from "../components/MovieItem";

const Watchlist = () => {
    const watchlist = useSelector((state) => state.movies.watchlist);

    if (!watchlist.length) {
        return (
            <View style={styles.centered}>
                <Text>No movies in your watchlist yet.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={watchlist}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <MovieItem item={item} id={item.id} />
            )}
        />
    );
};

export default Watchlist;

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
