import { createTheme } from "@rneui/themed";

const theme = createTheme({
    lightColors: {
        primary: "#007AFF",
        secondary: "#FF9500",
        background: "#F5F5F5",
        text: "#FFF",
    },
    darkColors: {
        primary: "#0A84FF",
        secondary: "#FF3B30",
        background: "#1C1C1E",
        text: "#333",
    },
    mode: "light", // Default mode, can be switched dynamically
    components: {
        Button: {
            raised: true, // Adds elevation
            buttonStyle: {
                backgroundColor: "#007AFF",
                borderRadius: 8,
                paddingVertical: 12,
            },
            titleStyle: {
                fontSize: 16,
                fontWeight: "bold",
                color: "#FFF",
            },
        },
    },
});

export default theme;
