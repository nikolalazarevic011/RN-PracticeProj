import { StyleSheet, Text, View, Alert, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import {
    getCurrentPositionAsync,
    useForegroundPermissions,
    PermissionStatus,
} from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../store/locationSlice";
import { fetchClosestShowing } from "../util/movieGluHttp";

export default function MovieLocation({ route }) {
    const { title } = route.params;
    const dispatch = useDispatch();
    const location = useSelector((state) => state.location?.location) || null;
    
    const [cinemas, setCinemas] = useState([]); // Store fetched cinema data
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [locationPermissionInformation, requestPermission] =
        useForegroundPermissions();

    async function verifyPermissions() {
        if (!locationPermissionInformation) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }

        if (
            locationPermissionInformation.status ===
            PermissionStatus.UNDETERMINED
        ) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }

        if (locationPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert(
                "Insufficient Permissions!",
                "You need to grant location permissions to use this feature."
            );
            return false;
        }

        return true;
    }

    async function getLocationHandler() {
        const hasPermission = await verifyPermissions();

        if (!hasPermission) {
            return;
        }

        try {
            const fetchedLocation = await getCurrentPositionAsync({ accuracy: 6 });
            console.log("📍 User's fetchedLocation:", fetchedLocation);
            dispatch(setLocation(fetchedLocation));
        } catch (error) {
            console.error("❌ Error fetching location:", error);
        }
    }

    async function loadCinemas() {
        if (!location || !location.latitude || !location.longitude) {
            console.warn("⚠️ No location available for fetching cinemas.");
            return;
        }

        if (!title) {
            setError("Movie title is required to find showtimes.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log(`🎬 Searching for "${title}" showtimes near lat=${location.latitude}, lon=${location.longitude}`);
            
            // Pass the location explicitly to fetchClosestShowing
            const showtimes = await fetchClosestShowing(title, location);
            
            if (showtimes && showtimes.cinemas && showtimes.cinemas.length > 0) {
                console.log(`✅ Found ${showtimes.cinemas.length} cinemas showing "${title}"`);
                setCinemas(showtimes.cinemas);
            } else if (showtimes && showtimes.error) {
                setError(showtimes.error);
            } else {
                setError(`No theaters showing "${title}" were found nearby.`);
            }
        } catch (error) {
            console.error("❌ Error fetching cinemas:", error);
            setError("An unexpected error occurred while searching for cinema showtimes.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            await getLocationHandler();
        })();
    }, []);

    useEffect(() => {
        if (location) {
            loadCinemas(); // Fetch cinemas once location is available
        }
    }, [location]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nearby Cinemas for {title}</Text>

            {isLoading && <Text>Loading cinemas...</Text>}
            {error && <Text style={styles.error}>{error}</Text>}

            {cinemas.length > 0 ? (
                <FlatList
                    data={cinemas}
                    keyExtractor={(item) => item.cinema_id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.cinemaItem}>
                            <Text style={styles.cinemaTitle}>{item.cinema_name}</Text>
                            <Text style={styles.cinemaDetails}>{item.address}</Text>
                            <Text style={styles.cinemaDetails}>
                                Distance: {item.distance} miles
                            </Text>
                        </View>
                    )}
                />
            ) : (
                !isLoading && <Text>No cinemas found.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    cinemaItem: {
        width: "100%",
        padding: 10,
        marginVertical: 5,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
    },
    cinemaTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    cinemaDetails: {
        fontSize: 14,
        color: "#555",
    },
    error: {
        color: "red",
        marginBottom: 10,
    },
});

