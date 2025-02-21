import { useState } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { createUser } from "../util/auth";
import { authenticate } from "../store/authSlice";

function SignupScreen() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const dispatch = useDispatch();

    async function signupHandler({ email, password }) {
        setIsAuthenticating(true);
        try {
            const token = await createUser(email, password);
            dispatch(authenticate(token));
        } catch (error) {
            Alert.alert(
                "Authentication failed",
                "Could not create user, please check your input and try again later."
            );
        }
        setIsAuthenticating(false);
    }

    if (isAuthenticating) {
        return <LoadingOverlay message="Creating user..." />;
    }

    return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;
