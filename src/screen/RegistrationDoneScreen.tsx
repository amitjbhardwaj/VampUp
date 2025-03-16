import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { RootStackParamList } from "../RootNavigator";
import { useTheme } from "../context/ThemeContext";

type RegistrationDoneScreenNavigationProp = NavigationProp<RootStackParamList>;

const RegistrationDoneScreen = () => {
    const { theme } = useTheme();  // Access the theme from context
    const navigation = useNavigation<RegistrationDoneScreenNavigationProp>();

    useEffect(() => {
        // Redirect to Login after 3 seconds
        const timeout = setTimeout(() => {
            navigation.navigate("LoginScreen");
        }, 3000);

        return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }, []);

    const isDarkMode = theme.mode === "dark";  // Check if the theme is dark

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? theme.background : "#fff" }]}>
            {/* Lottie animation for successful registration */}
            <LottieView
                source={require("../assets/registration_successfully.json")}
                autoPlay
                loop={true} // Play animation once
                style={styles.animation}
            />
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
        width: 300,  // Adjust size to fit the screen properly
        height: 300,
    },
});

export default RegistrationDoneScreen;
