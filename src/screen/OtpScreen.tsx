import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../RootNavigator";
import LottieView from "lottie-react-native";

type OtpScreenNavigationProp = NavigationProp<RootStackParamList>;

const OtpScreen = () => {
    const [otp, setOtp] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigation = useNavigation<OtpScreenNavigationProp>();

    const handleOtpChange = (value: string) => {
        const regex = /^[0-9]*$/;
        if (regex.test(value)) {
            setOtp(value);
            setError(""); // Clear error when input is valid
        }
    };

    const handleOtpVerify = () => {
        if (!otp) {
            setError("OTP can't be empty");
            return;
        }

        if (otp.length !== 6) {
            setError("OTP must be 6 digits");
            return;
        }

        if (otp === "123456") {
            navigation.navigate("RegistrationFailed");
        } else {
            navigation.navigate("RegistrationDone");
        }
    };

    return (
        <View style={styles.container}>
            <LottieView
                source={require("../assets/phone-animation.json")}
                autoPlay
                loop
                speed={0.5}
                style={styles.animation}
            />

            <Text style={styles.title}>Enter OTP</Text>

            <TextInput
                placeholder="Enter OTP"
                style={styles.input}
                keyboardType="numeric"
                maxLength={6}
                onChangeText={handleOtpChange}
                value={otp}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleOtpVerify}>
                <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F4F6F6",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#1A1A1A",
    },
    input: {
        width: "80%",
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 20,
        fontSize: 18,
        color: "#333",
        textAlign: "center",
    },
    button: {
        backgroundColor: "#1A8F3B",
        padding: 15,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    errorText: {
        color: "#D8000C",
        fontSize: 14,
        marginTop: 8,
        width: "80%",
        textAlign: "center",
        fontWeight: "500",
    },
    animation: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
});

export default OtpScreen;
