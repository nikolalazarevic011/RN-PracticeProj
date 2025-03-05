// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { Firebase_api_key, authDomain, databaseURL, projectId } from "@env";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: Firebase_api_key,
    authDomain: authDomain,
    databaseURL: databaseURL,
    projectId: projectId,
    // ... other config properties
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with persistent storage using AsyncStorage
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getDatabase(app);