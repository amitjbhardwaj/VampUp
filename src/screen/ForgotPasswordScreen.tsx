import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../RootNavigator";
import { useState, useRef, useEffect } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import LottieView from "lottie-react-native";
import { useTheme } from "../context/ThemeContext";

type ForgotPasswordNavigationProp = NavigationProp<RootStackParamList>;

const ForgotPasswordScreen = () => {
    const { theme } = useTheme(); 
    const navigation = useNavigation<ForgotPasswordNavigationProp>();

    // State variables
    const [aadhaar, setAadhaar] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState<"aadhaar" | "otp" | "password">("aadhaar");

    // Error states
    const [aadhaarError, setAadhaarError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Animation for smooth transition
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [step]);

    // Handle Aadhaar Submission
    const handleSubmitAadhaar = () => {
        if (!/^\d{12}$/.test(aadhaar)) {
            setAadhaarError("Invalid Aadhaar number!");
        } else {
            setAadhaarError("");
            setStep("otp");
            fadeAnim.setValue(0);
        }
    };

    // Handle OTP Submission
    const handleSubmitOtp = () => {
        if (!/^\d{6}$/.test(otp)) {
            setOtpError("Invalid OTP!");
        } else {
            setOtpError("");
            setStep("password");
            fadeAnim.setValue(0);
        }
    };

    // Handle Password Reset
    const handleResetPassword = () => {
        if (!newPassword || !confirmPassword) {
            setPasswordError("Please enter a new password!");
        } else if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match!");
        } else {
            setPasswordError("");
            navigation.navigate("PasswordUpdatedScreen");
        }
    };

    // Determine which Lottie file to show
    const getLottieSource = () => {
        switch (step) {
            case "aadhaar":
                return require("../assets/aadhar_latest.json");
            case "otp":
                return require("../assets/phone-animation.json");
            case "password":
                return require("../assets/password.json");
            default:
                return require("../assets/aadhar_latest.json");
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Animated.View style={{ opacity: fadeAnim }}>
                <LottieView
                    source={getLottieSource()}
                    style={styles.lottie}
                    autoPlay
                    loop={false}
                />
                <View style={styles.stepContainer}>
                    <Text style={[styles.step, step === "aadhaar" && styles.activeStep]}>1</Text>
                    <Text style={[styles.step, step === "otp" && styles.activeStep]}>2</Text>
                    <Text style={[styles.step, step === "password" && styles.activeStep]}>3</Text>
                </View>

                {/* Aadhaar Step */}
                {step === "aadhaar" && (
                    <View>
                        <Text style={[styles.title, { color: theme.text }]}>Enter Aadhaar Number</Text>
                        <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
                            <FontAwesome name="id-card" size={24} color={theme.iconColor} style={styles.inputIcon} />
                            <TextInput
                                placeholder="Aadhaar Number"
                                keyboardType="numeric"
                                maxLength={12}
                                style={[styles.inputText, { color: theme.text }]}
                                value={aadhaar}
                                onChangeText={setAadhaar}
                            />
                        </View>
                        {aadhaarError ? <Text style={[styles.errorText, { color: theme.errorText }]}>{aadhaarError}</Text> : null}
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.buttonBackground }]} onPress={handleSubmitAadhaar}>
                            <Text style={styles.actionBtnText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* OTP Step */}
                {step === "otp" && (
                    <View>
                        <Text style={[styles.title, { color: theme.text }]}>Enter OTP</Text>
                        <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
                            <FontAwesome name="key" size={24} color={theme.iconColor} style={styles.inputIcon} />
                            <TextInput
                                placeholder="OTP"
                                keyboardType="numeric"
                                maxLength={6}
                                style={[styles.inputText, { color: theme.text }]}
                                value={otp}
                                onChangeText={setOtp}
                            />
                        </View>
                        {otpError ? <Text style={[styles.errorText, { color: theme.errorText }]}>{otpError}</Text> : null}
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.buttonBackground }]} onPress={handleSubmitOtp}>
                            <Text style={styles.actionBtnText}>Submit OTP</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Password Step */}
                {step === "password" && (
                    <View>
                        <Text style={[styles.title, { color: theme.text }]}>Reset Password</Text>
                        <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
                            <FontAwesome name="lock" size={24} color={theme.iconColor} style={styles.inputIcon} />
                            <TextInput
                                placeholder="New Password"
                                secureTextEntry
                                style={[styles.inputText, { color: theme.text }]}
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />
                        </View>
                        <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
                            <FontAwesome name="lock" size={24} color={theme.iconColor} style={styles.inputIcon} />
                            <TextInput
                                placeholder="Confirm Password"
                                secureTextEntry
                                style={[styles.inputText, { color: theme.text }]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>
                        {passwordError ? <Text style={[styles.errorText, { color: theme.errorText }]}>{passwordError}</Text> : null}
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.buttonBackground }]} onPress={handleResetPassword}>
                            <Text style={styles.actionBtnText}>Reset Password</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={[styles.backButtonText, { color: theme.text }]}>Back</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
    },
    lottie: {
        width: 200,
        height: 200,
        alignSelf: "center",
    },
    stepContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 20,
    },
    step: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#ccc",
        textAlign: "center",
        lineHeight: 30,
        color: "#fff",
        fontSize: 18,
        marginHorizontal: 5,
    },
    activeStep: {
        backgroundColor: "#2C786C",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
        elevation: 3,
        marginBottom: 15,
    },
    inputText: {
        flex: 1,
        fontSize: 16,
        paddingLeft: 10,
    },
    errorText: {
        fontSize: 14,
        textAlign: "center",
    },
    actionBtn: {
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 15,
    },
    actionBtnText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    backButton: {
        marginTop: 20,
        alignItems: "center",
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    inputIcon: {
        marginRight: 10,
    },
});

export default ForgotPasswordScreen;
