import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Card } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const MovieItem = ({ item, id }) => {
    const navigation = useNavigation();

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
            </Card>
        </Pressable>
    );
};

export default MovieItem;

const styles = StyleSheet.create({});
