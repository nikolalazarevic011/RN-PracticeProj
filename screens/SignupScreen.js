import { useState } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { createUser } from "../util/auth";
import {  setUser } from "../store/authSlice";

function SignupScreen() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const dispatch = useDispatch();

    async function signupHandler({ email, password }) {
        setIsAuthenticating(true);
        try {
            const userData = await createUser(email, password);
            dispatch(
                setUser({
                    uid: userData.localId,
                    email: userData.email,
                    token: userData.idToken,
                })
            );
        } catch (error) {
            Alert.alert(
                "Authentication failed",
                "Could not create user, please check your input and try again later."
            );
            setIsAuthenticating(false);
        }
    }

    if (isAuthenticating) {
        return <LoadingOverlay message="Creating user..." />;
    }

    return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;
