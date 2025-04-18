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
                    <View style={styles.stepItem}>
                        <Text style={[styles.step, step === "aadhaar" && { backgroundColor: theme.primary, color: "#fff" }]}>1</Text>
                        <View style={styles.stepLabelContainer}>
                            <Text style={styles.stepLabel}>Aadhaar</Text>
                        </View>
                    </View>
                    <View style={styles.line} />
                    <View style={styles.stepItem}>
                        <Text style={[styles.step, step === "otp" && { backgroundColor: theme.primary, color: "#fff" }]}>2</Text>
                        <View style={styles.stepLabelContainer}>
                            <Text style={styles.stepLabel}>OTP</Text>
                        </View>
                    </View>
                    <View style={styles.line} />
                    <View style={styles.stepItem}>
                        <Text style={[styles.step, step === "password" && { backgroundColor: theme.primary, color: "#fff" }]}>3</Text>
                        <View style={styles.stepLabelContainer}>
                            <Text style={styles.stepLabel}>Password</Text>
                        </View>
                    </View>
                </View>


                {/* Aadhaar Step */}
                {step === "aadhaar" && (
                    <View>
                        <Text style={[styles.title, { color: theme.text }]}>Enter Aadhaar Number</Text>
                        <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
                            <FontAwesome name="id-card" size={24} color={theme.iconColor} style={styles.inputIcon} />
                            <TextInput
                                placeholder="Aadhaar Number"
                                placeholderTextColor={theme.mode === "dark" ? "#fff" : "#999"}
                                keyboardType="numeric"
                                maxLength={12}
                                style={[styles.inputText, { color: theme.text }]}
                                value={aadhaar}
                                onChangeText={setAadhaar}
                            />
                        </View>
                        {aadhaarError ? <Text style={[styles.errorText, { color: theme.errorText }]}>{aadhaarError}</Text> : null}
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.primary }]} onPress={handleSubmitAadhaar}>
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
                                placeholderTextColor={theme.mode === "dark" ? "#fff" : "#999"}
                                keyboardType="numeric"
                                maxLength={6}
                                style={[styles.inputText, { color: theme.text }]}
                                value={otp}
                                onChangeText={setOtp}
                            />
                        </View>
                        {otpError ? <Text style={[styles.errorText, { color: theme.errorText }]}>{otpError}</Text> : null}
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.primary }]} onPress={handleSubmitOtp}>
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
                                placeholderTextColor={theme.mode === "dark" ? "#fff" : "#999"}
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
                                placeholderTextColor={theme.mode === "dark" ? "#fff" : "#999"}
                                secureTextEntry
                                style={[styles.inputText, { color: theme.text }]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>
                        {passwordError ? <Text style={[styles.errorText, { color: theme.errorText }]}>{passwordError}</Text> : null}
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.primary }]} onPress={handleResetPassword}>
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
    stepContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    },

    stepItem: {
        alignItems: "center",
    },

    step: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#eee",
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 18,
        fontWeight: "600",
        color: "#666",
    },

    activeStep: {
        backgroundColor: "#1E90FF",
        color: "#fff",
    },

    line: {
        height: 2,
        width: 40,
        backgroundColor: "#ccc",
        marginHorizontal: 8,
    },

    stepLabelContainer: {
        marginTop: 4,
    },

    stepLabel: {
        fontSize: 12,
        color: "#888",
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
