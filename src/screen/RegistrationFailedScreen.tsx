import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { RootStackParamList } from "../RootNavigator";

type RegistrationFailedScreenNavigationProp = NavigationProp<RootStackParamList>;

const RegistrationFailedScreen = () => {
    const navigation = useNavigation<RegistrationFailedScreenNavigationProp>();

    useEffect(() => {
        // Auto-redirect to LoginScreen after 3 seconds
        const timeout = setTimeout(() => {
            navigation.navigate("Login");
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <View style={styles.container}>
            <LottieView
                source={require("../assets/registration_failed.json")} // Use an appropriate failure animation
                autoPlay
                loop={true}
                style={styles.animation}
            />
            <Text style={styles.errorMessage}>OTP Verification Failed!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
    },
    animation: {
        width: 250,
        height: 250,
    },
    errorMessage: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#D8000C",
        marginTop: 20,
    },
});

export default RegistrationFailedScreen;
