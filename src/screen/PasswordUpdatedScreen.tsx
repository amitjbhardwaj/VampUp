import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Animated } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { RootStackParamList } from "../RootNavigator";
import { useTheme } from "../context/ThemeContext";

type PasswordUpdatedScreenNavigationProp = NavigationProp<RootStackParamList>;

const PasswordUpdatedScreen = () => {
    const { theme } = useTheme(); // Assuming theme is an object with properties like mode, background, etc.
    const navigation = useNavigation<PasswordUpdatedScreenNavigationProp>();
    const fadeAnim = useRef(new Animated.Value(0)).current; // For fade-in effect

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    // Ensure theme.mode is checked for dark mode
    const isDarkMode = theme.mode === "dark";  // Check if the theme mode is dark

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? theme.background : "#F4F8FB" }]}>
            <Animated.View style={[styles.animationContainer, { opacity: fadeAnim }]}>
                <LottieView
                    source={require("../assets/registration_successfully.json")}
                    autoPlay
                    loop={false}
                    style={styles.animation}
                />
                <Text style={[styles.successText, { color: isDarkMode ? theme.text : "#2C786C" }]}>
                    Password Updated Successfully!
                </Text>
                <Text style={[styles.subText, { color: isDarkMode ? theme.textColor : "#555" }]}>
                    You can now log in with your new password.
                </Text>

                {/* Manual navigation button */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: isDarkMode ? theme.buttonBackgroundColor : "#2C786C" }]}
                    onPress={() => navigation.navigate("LoginScreen")}
                >
                    <Text style={styles.buttonText}>Go to Login</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    animationContainer: {
        alignItems: "center",
        width: "90%",
    },
    animation: {
        width: 250,
        height: 250,
    },
    successText: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 20,
        textAlign: "center",
    },
    subText: {
        fontSize: 16,
        marginTop: 5,
        textAlign: "center",
    },
    button: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default PasswordUpdatedScreen;
