import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { RootStackParamList } from "../RootNavigator";

type PasswordUpdatedScreenNavigationProp = NavigationProp<RootStackParamList>;

const PasswordUpdatedScreen = () => {
    const navigation = useNavigation<PasswordUpdatedScreenNavigationProp>();

    useEffect(() => {
        // Redirect to Login after 3 seconds
        const timeout = setTimeout(() => {
            navigation.navigate("LoginScreen");
        }, 3000);

        return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }, []);

    return (
        <View style={styles.container}>
            {/* Lottie animation for successful registration */}
            <LottieView
                source={require("../assets/registration_successfully.json")}
                autoPlay
                loop={false} // Play animation once
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
        backgroundColor: "#fff", // Ensure background color matches app theme
    },
    animation: {
        width: 300,  // Adjust size to fit the screen properly
        height: 300,
    },
});

export default PasswordUpdatedScreen;
