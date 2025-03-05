import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../RootNavigator";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/FontAwesome";

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

            <View style={styles.inputContainer}>
                <Icon name="key" size={20} color="#9A9A9A" style={styles.icon} />
                <TextInput
                    placeholder="Enter OTP"
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={6}
                    onChangeText={handleOtpChange}
                    value={otp}
                    placeholderTextColor="#9A9A9A"
                />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleOtpVerify}>
                <Icon name="lock" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}> Verify OTP</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#000",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0F1F0",
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 50,
        elevation: 5,
        marginBottom: 15,
        width: "80%",
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        textAlign: "center",
    },
    button: {
        flexDirection: "row",
        backgroundColor: "#000",
        padding: 15,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    buttonIcon: {
        marginRight: 10,
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
