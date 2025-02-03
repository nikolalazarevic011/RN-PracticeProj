import React from "react";
import {
    View,
    FlatList,
    Text,
    Image,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { Card } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { loadMovies } from "../store/moviesSlice"; // ✅ Import Redux action

const MoviesList = ({ }) => {
    const dispatch = useDispatch();

    const loading = useSelector((state) => state.ui.loading);
    const movies = useSelector((state) => state.movies.list);

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <FlatList
                data={movies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Card>
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Divider />
                        <Image
                            source={{ uri: item.poster }}
                            style={{ height: 300, resizeMode: "cover" }}
                        />
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                marginTop: 5,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 5,
                                }}
                            >
                                <Ionicons name="star" size={20} color="gold" />
                                <Text style={{ marginLeft: 5 }}>
                                    {item.rating}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 5,
                                }}
                            >
                                <Ionicons
                                    name="calendar"
                                    size={20}
                                    color="#007AFF"
                                />
                                <Text style={{ marginLeft: 5 }}>
                                    {item.releaseDate}
                                </Text>
                            </View>
                        </View>
                    </Card>
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
