import { StyleSheet } from "react-native";
import { ThemeProvider } from "@rneui/themed";
import theme from "./theme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AllMovies from "./screens/AllMovies";
import Watchlist from "./screens/Watchlist";
import MovieDetail from "./screens/MovieDetail";
import { Ionicons } from "@expo/vector-icons";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store";
import SearchMovie from "./screens/SearchMovie";
import { PersistGate } from "redux-persist/integration/react";

export default function App() {
    const Stack = createNativeStackNavigator();
    const BottomTabs = createBottomTabNavigator();

    function MoviesOverview() {
        const navigation = useNavigation();

        return (
            <BottomTabs.Navigator
                screenOptions={{
                    headerRight: () => (
                        <Ionicons
                            name="search-outline"
                            size={24}
                            color="white"
                            onPress={() => {
                                navigation.navigate("SearchMovie");
                            }}
                            style={{ marginRight: 15 }}
                        />
                    ),
                    headerStyle: {
                        backgroundColor: theme.lightColors.secondary,
                    },
                    headerTintColor: "white",
                    tabBarStyle: {
                        backgroundColor: theme.lightColors.secondary,
                    },
                    tabBarActiveTintColor: theme.darkColors.secondary,
                }}
            >
                <BottomTabs.Screen
                    name="AllMovies"
                    component={AllMovies}
                    options={{
                        title: "All Movies",
                        tabBarLabel: "All Movies",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="home-outline"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <BottomTabs.Screen
                    name="Watchlist"
                    component={Watchlist}
                    options={{
                        title: "Watchlist",
                        tabBarLabel: "Watchlist",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="bookmark-outline"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
            </BottomTabs.Navigator>
        );
    }
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider theme={theme}>
                    <NavigationContainer>
                        <Stack.Navigator
                            screenOptions={{
                                headerStyle: {
                                    backgroundColor:
                                        theme.lightColors.secondary,
                                },
                                headerTintColor: "white",
                            }}
                        >
                            <Stack.Screen
                                name="MoviesOverview"
                                component={MoviesOverview}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="MovieDetail"
                                component={MovieDetail}
                                options={{
                                    presentation: "modal",
                                    title: "Movie Details",
                                }}
                            />
                            <Stack.Screen
                                name="SearchMovie"
                                component={SearchMovie}
                                options={{
                                    presentation: "modal",
                                    title: "Movie Search",
                                }}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </ThemeProvider>
            </PersistGate>
        </Provider>
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
