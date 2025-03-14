import React, { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Card } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import { getMovieTrailer, resetTrailer } from "../store/moviesSlice";
import { Linking } from "react-native";

const MovieItem = ({ item, id }) => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const isDetailScreen = route.name === "MovieDetail";
    const trailerUrl = useSelector(
        (state) => state.movies.selectedMovieTrailer
    );

    function moviePressHandler() {
        navigation.navigate("MovieDetail", { movieId: id });
    }

    function locationPressHandler(title) {
        navigation.navigate("MovieLocation", { title: title });
    }

    function trailerPressHandler(movieId) {
        dispatch(getMovieTrailer(movieId)); // Fetch trailer
    }

    // Open trailer when it's available
    useEffect(() => {
        if (trailerUrl) {
            Linking.openURL(trailerUrl);
            dispatch(resetTrailer()); // ✅ Reset trailer state to prevent auto-reopening

        }
    }, [trailerUrl]);

    return (
        <Pressable onPress={moviePressHandler}>
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
                        <Text style={{ marginLeft: 5 }}>{item.rating}</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 5,
                        }}
                    >
                        <Ionicons name="calendar" size={20} color="#007AFF" />
                        <Text style={{ marginLeft: 5 }}>
                            {item.releaseDate}
                        </Text>
                    </View>
                </View>
                {isDetailScreen && (
                    <>
                        <Text style={{ marginTop: 10, fontSize: 16 }}>
                            {item.overview}
                        </Text>
                        <Button
                            title="Watch Trailer"
                            buttonStyle={{
                                backgroundColor: "#007AFF",
                                marginTop: 15,
                            }}
                            onPress={() => {
                                trailerPressHandler(id);
                            }}
                        />
                        <Button
                            title="Nearby Screenings"
                            buttonStyle={{
                                backgroundColor: "#007AFF",
                                marginTop: 15,
                            }}
                            onPress={() => locationPressHandler(item.title)}
                        />
                    </>
                )}
            </Card>
        </Pressable>
    );
};

export default MovieItem;

const styles = StyleSheet.create({});
