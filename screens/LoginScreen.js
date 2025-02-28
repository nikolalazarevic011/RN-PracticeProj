import { useState } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { setUser } from "../store/authSlice";
import { fetchWatchlist } from "../store/moviesSlice";
import { login } from "../util/auth";

function LoginScreen() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const dispatch = useDispatch();

    async function loginHandler({ email, password }) {
        setIsAuthenticating(true);
        try {
            const userData = await login(email, password);
            // console.log(userData);
            dispatch(
                setUser({
                    uid: userData.localId,
                    email: userData.email,
                    token: userData.idToken,
                })
            );
            dispatch(fetchWatchlist());
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
