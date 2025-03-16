import { StyleSheet, View } from "react-native";
import { ThemeProvider } from "@rneui/themed";
import theme from "./theme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AllMovies from "./screens/AllMovies";
import Watchlist from "./screens/Watchlist";
import MovieDetail from "./screens/MovieDetail";
import { Ionicons } from "@expo/vector-icons";
import { Provider, useDispatch } from "react-redux";
import { persistor, store } from "./store/store";
import SearchMovie from "./screens/SearchMovie";
import { PersistGate } from "redux-persist/integration/react";
import SignupScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";
import { useSelector } from "react-redux";
import { clearUser, initAuthListener } from "./store/authSlice";
import MovieLocation from "./screens/MovieLocation";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function AuthStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: theme.lightColors.secondary },
                headerTintColor: "white",
                contentStyle: { backgroundColor: theme.lightColors.secondary },
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
    );
}

function BottomButtons() {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    return (
        <BottomTabs.Navigator
            screenOptions={{
                headerRight: () => (
                    <View style={{ flexDirection: "row", marginRight: 15 }}>
                        <Ionicons
                            name="search-outline"
                            size={24}
                            color="white"
                            onPress={() => {
                                navigation.navigate("SearchMovie");
                            }}
                            style={{ marginRight: 15 }}
                        />
                        <Ionicons
                            name="log-out-outline"
                            size={24}
                            color="white"
                            onPress={() => {
                                dispatch(clearUser());
                                // Insert your logout logic here.
                            }}
                        />
                    </View>
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

function AuthenticatedStack() {
    // const navigation = useNavigation();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.lightColors.secondary,
                },
                headerTintColor: "white",
            }}
        >
            <Stack.Screen
                name="BottomButtons"
                component={BottomButtons}
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
            <Stack.Screen
                name="MovieLocation"
                component={MovieLocation}
                options={{
                    presentation: "modal",
                    title: "Movie Location",
                }}
            />
        </Stack.Navigator>
    );
}

function Navigation() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return (
        <NavigationContainer>
            {!isAuthenticated && <AuthStack />}

            {isAuthenticated && <AuthenticatedStack />}
        </NavigationContainer>
    );
}

export default function App() {
    // sa ovim ce app da se logout kad force close the app, kao pomaze firebase
    // da zna dal si auth, kad se startuje app, mada firebase valjda ima token
    //  koji istekne posle nekog vremena i ne mozes onda da npr save the movie to watchlist
    //  znaci ako neces ovo promeni podesavaja u firebase da ne istice token tako cesto?
    initAuthListener(store.dispatch);


    async function registerForPushNotifications() {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
            alert("Permission for notifications was denied!");
            return;
        }
    
        const token = await Notifications.getExpoPushTokenAsync();
        console.log("Expo Push Token:", token.data);
    }
    
    useEffect(() => {
        registerForPushNotifications();
    }, []);
    

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider theme={theme}>
                    <Navigation />
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
