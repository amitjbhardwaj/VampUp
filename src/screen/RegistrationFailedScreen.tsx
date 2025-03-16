import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { RootStackParamList } from "../RootNavigator";
import { useTheme } from "../context/ThemeContext";

type RegistrationFailedScreenNavigationProp = NavigationProp<RootStackParamList>;

const RegistrationFailedScreen = () => {
    const { theme } = useTheme(); 
    const navigation = useNavigation<RegistrationFailedScreenNavigationProp>();

    useEffect(() => {
        // Auto-redirect to LoginScreen after 3 seconds
        const timeout = setTimeout(() => {
            navigation.navigate("LoginScreen");
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    const isDarkMode = theme.mode === "dark";  // Check if the theme is dark

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? theme.background : "#FFF" }]}>
            <LottieView
                source={require("../assets/registration_failed.json")} // Use an appropriate failure animation
                autoPlay
                loop={true}
                style={styles.animation}
            />
            <Text style={[styles.errorMessage, { color: isDarkMode ? "#FF6347" : "#D8000C" }]}>
                OTP Verification Failed!
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    animation: {
        width: 250,
        height: 250,
    },
    errorMessage: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
    },
});

export default RegistrationFailedScreen;
