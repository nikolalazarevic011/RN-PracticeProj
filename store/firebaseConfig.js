// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { Firebase_api_key, authDomain, databaseURL, projectId } from "@env";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: Firebase_api_key,
    authDomain: authDomain,
    databaseURL: databaseURL,
    projectId: projectId,
    // ... other config properties
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
