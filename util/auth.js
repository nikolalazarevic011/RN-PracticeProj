import axios from "axios";
import { Firebase_api_key } from "@env";

async function authenticate(mode, email, password) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${Firebase_api_key}`;

    const response = await axios.post(url, {
        email: email,
        password: password,
        returnSecureToken: true,
    });

    // console.log(response.data);
    const token = response.data.idToken;

    return token;
}

export async function createUser(email, password) {
    const token = await authenticate("signUp", email, password);
    return token;
}

export async function login(email, password) {
    const token = await authenticate("signInWithPassword", email, password);
    return token;
}
