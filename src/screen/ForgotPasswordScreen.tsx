import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../RootNavigator";
import { useState } from "react";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';

type ForgotPasswordNavigationProp = NavigationProp<RootStackParamList>;

const ForgotPasswordScreen = () => {
    const navigation = useNavigation<ForgotPasswordNavigationProp>();

    // State variables
    const [aadhaar, setAadhaar] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState<"aadhaar" | "otp" | "password">("aadhaar");

    // Handle Aadhaar Submission
    const handleSubmitAadhaar = () => {
        if (/^\d{12}$/.test(aadhaar)) {
            setStep("otp");
        } else {
            alert("Invalid Aadhaar Number. Please enter a valid 12-digit Aadhaar number.");
        }
    };

    // Handle OTP Submission
    const handleSubmitOtp = () => {
        if (/^\d{6}$/.test(otp)) {
            setStep("password");
        } else {
            alert("Invalid OTP. Please enter a valid 6-digit OTP.");
        }
    };

    // Handle Password Reset
    const handleResetPassword = () => {
        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters long.");
        } else if (newPassword !== confirmPassword) {
            alert("Passwords do not match. Please make sure both fields are identical.");
        } else {
            navigation.navigate("PasswordUpdatedScreen");
        }
    };

    return (
        <View style={styles.container}>
            {step === "aadhaar" && (
                <View>
                    <LottieView source={require("../assets/phone-animation.json")} autoPlay loop style={styles.lottie} />
                    <Text style={styles.title}>Enter Aadhaar Number</Text>
                    <View style={styles.inputContainer}>
                        <FontAwesome name="id-card" size={24} color="#9A9A9A" style={styles.inputIcon} />
                        <TextInput
                            placeholder="Aadhaar Number"
                            keyboardType="numeric"
                            maxLength={12}
                            style={styles.inputText}
                            value={aadhaar}
                            onChangeText={setAadhaar}
                        />
                    </View>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleSubmitAadhaar}>
                        <Text style={styles.actionBtnText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            )}

            {step === "otp" && (
                <View>
                    <LottieView source={require("../assets/phone-animation.json")} autoPlay loop style={styles.lottie} />
                    <Text style={styles.title}>Enter OTP</Text>
                    <View style={styles.inputContainer}>
                        <FontAwesome name="key" size={24} color="#9A9A9A" style={styles.inputIcon} />
                        <TextInput
                            placeholder="OTP"
                            keyboardType="numeric"
                            maxLength={6}
                            style={styles.inputText}
                            value={otp}
                            onChangeText={setOtp}
                        />
                    </View>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleSubmitOtp}>
                        <Text style={styles.actionBtnText}>Submit OTP</Text>
                    </TouchableOpacity>
                </View>
            )}

            {step === "password" && (
                <View>
                    <LottieView source={require("../assets/phone-animation.json")} autoPlay loop style={styles.lottie} />
                    <Text style={styles.title}>Reset Password</Text>
                    <View style={styles.inputContainer}>
                        <FontAwesome name="lock" size={24} color="#9A9A9A" style={styles.inputIcon} />
                        <TextInput
                            placeholder="New Password"
                            secureTextEntry
                            style={styles.inputText}
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <FontAwesome name="lock" size={24} color="#9A9A9A" style={styles.inputIcon} />
                        <TextInput
                            placeholder="Confirm Password"
                            secureTextEntry
                            style={styles.inputText}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </View>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleResetPassword}>
                        <Text style={styles.actionBtnText}>Reset Password</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: "#E0E5E0",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    lottie: {
        width: 150,
        height: 150,
        alignSelf: "center",
        marginBottom: 20,
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
    },
    inputText: {
        flex: 1,
        fontSize: 16,
        paddingLeft: 10,
        color: "#333",
    },
    actionBtn: {
        backgroundColor: "#257C25",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        width: "85%",
        alignSelf: "center",
        marginTop: 20,
    },
    actionBtnText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    inputIcon: {
        marginRight: 10,
    }
});

export default ForgotPasswordScreen;
function alert(arg0: string) {
    throw new Error("Function not implemented.");
}

