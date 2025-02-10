import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text } from "react-native";
import { fetchSearchResults } from "../util/http";
import MoviesList from "../components/MoviesList";

const SearchMovie = () => {
    const [searchParams, setSearchParams] = useState({
        query: "",
        genre: "",
        type: "", // "movie" or "tv", or leave empty for multi-search.
    });
    const [results, setResults] = useState([]);

    const searchHandler = async () => {
        const data = await fetchSearchResults(searchParams);
        setResults(data);
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TextInput
                placeholder="Movie name..."
                value={searchParams.query}
                onChangeText={(text) =>
                    setSearchParams((prev) => ({ ...prev, query: text }))
                }
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <TextInput
                placeholder='Type ("movie" or "tv", optional)'
                value={searchParams.type}
                onChangeText={(text) =>
                    setSearchParams((prev) => ({ ...prev, type: text }))
                }
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <Button title="Search" onPress={searchHandler} />
            <MoviesList data={results}/>
        </View>
    );
};

export default SearchMovie;
