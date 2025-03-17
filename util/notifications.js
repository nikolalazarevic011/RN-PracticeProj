import * as Notifications from "expo-notifications";
import { fetchMovies } from "./http";
import { navigationRef } from "./navigationRef";

// ✅ Set up notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

// ✅ Function to request notification permissions
export async function registerForPushNotifications() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
        alert("Permission for notifications was denied!");
        return;
    }

    const token = await Notifications.getExpoPushTokenAsync();
    // console.log("Expo Push Token:", token.data);
}

// ✅ Function to schedule movie recommendations (every 5s for testing)
export async function scheduleMovieNotification() {
    const trendingMovies = await fetchMovies();
    if (!trendingMovies.length) return;

    const randomMovie =
        trendingMovies[Math.floor(Math.random() * trendingMovies.length)];

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "🔥 Movie Recommendation!",
            body: `Check out "${randomMovie.title}" (⭐ ${randomMovie.rating})!`,
            data: { movieId: randomMovie.id },
        },
        trigger: { seconds: 5, repeats: true }, // Runs every 5 seconds (for testing)
    });

    // console.log("📢 Notification scheduled for:", randomMovie.title);
}

// ✅ Function to handle incoming notifications
export function setupNotificationListeners() {
    const subscription1 = Notifications.addNotificationReceivedListener(
        (notification) => {
            // console.log("🔔 Notification received:", notification);
        }
    );

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
        (response) => {
            // console.log("🎬 Notification clicked:", response);
            const movieId = response.notification.request.content.data.movieId;

            if (movieId) {
                navigationRef.current?.navigate("MovieDetail", { movieId });
            }
        }
    );

    return () => {
        subscription1.remove();
        subscription2.remove();
    };
}
