import { StyleSheet } from "react-native";
import { ThemeProvider } from "@rneui/themed";
import theme from "./theme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import AllMovies from "./screens/AllMovies";
import Watchlist from "./screens/Watchlist";
import MovieDetail from "./screens/MovieDetail";
import { Ionicons } from "@expo/vector-icons";
import { Provider } from "react-redux";
import { store } from "./store/store";

export default function App() {
    const Stack = createNativeStackNavigator();
    const BottomTabs = createBottomTabNavigator();

    function MoviesOverview() {
        return (
            <BottomTabs.Navigator
                screenOptions={{
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
            <ThemeProvider theme={theme}>
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            headerStyle: {
                                backgroundColor: theme.lightColors.secondary,
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
                                presentation: "modal", title: "Movie Details"
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </ThemeProvider>
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
