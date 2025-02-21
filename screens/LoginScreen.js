import { useState } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { login } from "../util/auth";
import { authenticate } from "../store/authSlice";

function LoginScreen() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const dispatch = useDispatch();

    async function loginHandler({ email, password }) {
        setIsAuthenticating(true);
        try {
            const token = await login(email, password);
            dispatch(authenticate(token));
        } catch (error) {
            Alert.alert(
                "Authentication failed!",
                "Could not log you in. Please check your credentials or try again later!"
            );
            setIsAuthenticating(false); //ovde a ne ispod err screen, zato sto se screen skloni kad se login ujes i onda se zove ova fja na nepostojeci state
        }
    }

    if (isAuthenticating) {
        return <LoadingOverlay message="Logging you in..." />;
    }

    return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
