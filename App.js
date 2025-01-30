import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ThemeProvider, Button } from "@rneui/themed";

export default function App() {
    return (
        <ThemeProvider>
            <View style={styles.container}>
                <Text>Hello React Native Elements!</Text>
                <Button
                    title="Press Me"
                    onPress={() => alert("Button Pressed!")}
                />
            </View>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
