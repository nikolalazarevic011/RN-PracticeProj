// auth.js
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../store/firebaseConfig"; 

export async function createUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        return {
            idToken: await userCredential.user.getIdToken(),
            localId: userCredential.user.uid,
            email: userCredential.user.email,
            // Add other fields you need
        };
    } catch (error) {
        throw error;
    }
}

export async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        return {
            idToken: await userCredential.user.getIdToken(),
            localId: userCredential.user.uid,
            email: userCredential.user.email,
            // Add other fields you need
        };
    } catch (error) {
        throw error;
    }
}
