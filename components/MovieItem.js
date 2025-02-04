import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Card } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { Button } from "@rneui/themed";

const MovieItem = ({ item, id }) => {
    const navigation = useNavigation();
    const route = useRoute();

    const isDetailScreen = route.name === "MovieDetail";

    function moviePressHandler() {
        navigation.navigate("MovieDetail", { movieId: id });
    }

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
                                // Add your trailer functionality here (navigate or open URL)
                            }}
                        />
                    </>
                )}
            </Card>
        </Pressable>
    );
};

export default MovieItem;

const styles = StyleSheet.create({});
