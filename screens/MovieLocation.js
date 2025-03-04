import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import {
    getCurrentPositionAsync,
    useForegroundPermissions,
    PermissionStatus,
} from "expo-location";

export default function MovieLocation({ route }) {
    const [location, setLocation] = useState(null);
    const { title } = route.params;

    const [locationPermissionInformation, requestPermission] =
        useForegroundPermissions();

    async function verifyPermissions() {
        if (!locationPermissionInformation) {
            return false; // Prevent accessing undefined status
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
                "You need to grant location permissions to use this app."
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
            const location = await getCurrentPositionAsync({ accuracy: 6 });
            setLocation(location.coords);
            console.log("User's location:", location);

        } catch (error) {
            console.error("Error fetching location:", error);
        }
    }

    useEffect(() => {
        (async () => {
            await getLocationHandler();
        })();
    }, []);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.text}>Movie Location Screen</Text>
            </View>
            {location && (
                <View>
                    <Text style={styles.text}>
                        Your Location: {location.latitude}, {location.longitude}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
        marginVertical: 10,
    },
});
