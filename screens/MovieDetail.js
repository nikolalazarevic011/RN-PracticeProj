import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieById } from "../store/moviesSlice";
import { Card, Icon, Button } from "@rneui/themed";

const MovieDetail = ({ route }) => {
    const { movieId } = route.params;
    const dispatch = useDispatch();
    const movie = useSelector((state) => state.movies.selectedMovie);

    useEffect(() => {
        dispatch(fetchMovieById(movieId));
    }, [dispatch, movieId]);

    if (!movie) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Card>
                <Card.Image source={{ uri: movie.poster }} />
                <Card.Title>{movie.title}</Card.Title>
                <Card.Divider />
                <Text style={{ marginBottom: 10, fontSize: 18 }}>{movie.overview}</Text>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Icon name="star" type="font-awesome" color="gold" />
                        <Text style={{ marginLeft: 5, fontSize: 16 }}>{movie.rating}</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Icon name="calendar" type="font-awesome" color="#007AFF" />
                        <Text style={{ marginLeft: 5, fontSize: 16 }}>{movie.releaseDate}</Text>
                    </View>
                </View>

                <Button
                    title="Watch Trailer"
                    icon={<Icon name="video-camera" type="font-awesome" color="white" />}
                    buttonStyle={{ backgroundColor: "#007AFF", marginTop: 15 }}
                    onPress={() => {
                        // Navigate to trailer screen or open trailer URL
                    }}
                />
            </Card>
        </ScrollView>
    );
};

export default MovieDetail;