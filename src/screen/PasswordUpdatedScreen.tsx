import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Animated } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { RootStackParamList } from "../RootNavigator";

type PasswordUpdatedScreenNavigationProp = NavigationProp<RootStackParamList>;

const PasswordUpdatedScreen = () => {
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

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.animationContainer, { opacity: fadeAnim }]}>
                <LottieView
                    source={require("../assets/registration_successfully.json")}
                    autoPlay
                    loop={false}
                    style={styles.animation}
                />
                <Text style={styles.successText}>Password Updated Successfully!</Text>
                <Text style={styles.subText}>You can now log in with your new password.</Text>

                {/* Manual navigation button */}
                <TouchableOpacity
                    style={styles.button}
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
        backgroundColor: "#F4F8FB",
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
        color: "#2C786C",
        marginTop: 20,
        textAlign: "center",
    },
    subText: {
        fontSize: 16,
        color: "#555",
        marginTop: 5,
        textAlign: "center",
    },
    button: {
        marginTop: 20,
        backgroundColor: "#2C786C",
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
