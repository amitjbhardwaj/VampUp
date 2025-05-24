import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useState, useRef, useEffect } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import LottieView from "lottie-react-native";
import { RootStackParamList } from "../RootNavigator";
import { useTheme } from "../context/ThemeContext";

type ForgotPasswordNavigationProp = NavigationProp<RootStackParamList>;

const ForgotPasswordScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<ForgotPasswordNavigationProp>();

    const [step, setStep] = useState<"aadhaar" | "otp" | "password">("aadhaar");

    const [aadhaar, setAadhaar] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [aadhaarError, setAadhaarError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const aadhaarShakeAnim = useRef(new Animated.Value(0)).current;
    const otpShakeAnim = useRef(new Animated.Value(0)).current;
    const passwordShakeAnim = useRef(new Animated.Value(0)).current;

    const [countdown, setCountdown] = useState(60);
    const [showResend, setShowResend] = useState(false);

    const [aadharFocused, setAadharFocused] = useState(false);
    const [otpFocused, setOtpFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (step === "otp" && countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev === 1) {
                        clearInterval(interval);
                        setShowResend(true);
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [step, countdown]);

    const handleResendOtp = () => {
        // TODO: add actual resend API call here if needed
        setCountdown(30);
        setShowResend(false);
    };

    const triggerShake = (anim: Animated.Value) => {
        Animated.sequence([
            Animated.timing(anim, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(anim, {
                toValue: -10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(anim, {
                toValue: 6,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(anim, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            }),
        ]).start();
    };

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [step]);

    const handleSubmitAadhaar = () => {
        if (!/^\d{12}$/.test(aadhaar)) {
            setAadhaarError("Enter a valid 12-digit Aadhaar number.");
            triggerShake(aadhaarShakeAnim);
        } else {
            setAadhaarError("");
            setStep("otp");
            fadeAnim.setValue(0);
        }
    };

    const handleSubmitOtp = () => {
        if (!/^\d{6}$/.test(otp)) {
            setOtpError("Enter a valid 6-digit OTP.");
            triggerShake(otpShakeAnim);
        } else {
            setOtpError("");
            setStep("password");
            fadeAnim.setValue(0);
        }
    };

    const handleResetPassword = () => {
        if (!newPassword || !confirmPassword) {
            setPasswordError("Please enter and confirm your new password.");
            triggerShake(passwordShakeAnim);
        } else if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            triggerShake(passwordShakeAnim);
        } else {
            setPasswordError("");
            navigation.navigate("PasswordUpdatedScreen");
        }
    };

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
                <LottieView source={getLottieSource()} style={styles.lottie} autoPlay loop={false} />

                {/* Steps */}
                <View style={styles.stepContainer}>
                    {["aadhaar", "otp", "password"].map((s, index) => (
                        <View key={s} style={styles.stepItem}>
                            <Text
                                style={[
                                    styles.step,
                                    step === s && { backgroundColor: theme.primary, color: "#fff" },
                                ]}
                            >
                                {index + 1}
                            </Text>
                            <View style={styles.stepLabelContainer}>
                                <Text style={styles.stepLabel}>{s.charAt(0).toUpperCase() + s.slice(1)}</Text>
                            </View>
                            {index < 3 && <View style={styles.line} />}
                        </View>
                    ))}
                </View>

                {/* Aadhaar Input */}
                {step === "aadhaar" && (
                    <Animated.View style={{ transform: [{ translateX: aadhaarShakeAnim }] }}>
                        <Text style={[styles.title, { color: theme.text }]}>Enter Aadhaar Number</Text>
                        <View
                            style={[
                                styles.inputContainer,
                                { backgroundColor: theme.inputBackground },
                                aadhaarError && { borderColor: theme.errorText, borderWidth: 1 },
                            ]}
                        >
                            <FontAwesome name="id-card" size={24} color={theme.iconColor} style={styles.inputIcon} />
                            <TextInput
                                placeholder={aadharFocused ? "" : "Aadhaar Number"}
                                placeholderTextColor={theme.placeholderTextColor}
                                keyboardType="numeric"
                                maxLength={12}
                                style={[styles.inputText, { color: theme.text }]}
                                value={aadhaar}
                                onChangeText={setAadhaar}
                                onFocus={() => setAadharFocused(true)}
                                onBlur={() => setAadharFocused(false)}
                            />
                        </View>
                        {aadhaarError ? (
                            <Text style={[styles.errorText, { color: theme.errorText }]}>{aadhaarError}</Text>
                        ) : null}
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.primary }]} onPress={handleSubmitAadhaar}>
                            <Text style={[styles.actionBtnText, { color: theme.buttonText }]}>Submit</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {/* OTP Input */}
                {step === "otp" && (
                    <Animated.View style={{ transform: [{ translateX: otpShakeAnim }] }}>
                        <Text style={[styles.title, { color: theme.text }]}>Enter OTP</Text>

                        <View
                            style={[
                                styles.inputContainer,
                                { backgroundColor: theme.inputBackground },
                                otpError && { borderColor: theme.errorText, borderWidth: 1 },
                            ]}
                        >
                            <FontAwesome name="key" size={24} color={theme.iconColor} style={styles.inputIcon} />
                            <TextInput
                                placeholder={otpFocused ? "" : "OTP"}
                                placeholderTextColor={theme.placeholderTextColor}
                                keyboardType="numeric"
                                maxLength={6}
                                style={[styles.inputText, { color: theme.text }]}
                                value={otp}
                                onChangeText={setOtp}
                                onFocus={() => setOtpFocused(true)}
                                onBlur={() => setOtpFocused(false)}
                            />
                        </View>

                        {otpError ? (
                            <Text style={[styles.errorText, { color: theme.errorText }]}>{otpError}</Text>
                        ) : null}

                        {!showResend ? (
                            <Text style={{ textAlign: "center", color: theme.text, marginTop: 5 }}>
                                Resend OTP in {countdown}s
                            </Text>
                        ) : (
                            <TouchableOpacity onPress={handleResendOtp}>
                                <Text style={{ textAlign: "center", color: theme.primary, marginTop: 5 }}>
                                    Resend OTP
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: theme.primary }]}
                            onPress={handleSubmitOtp}
                        >
                            <Text style={[styles.actionBtnText, { color: theme.buttonText }]}>Submit OTP</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}


                {/* Password Reset */}
                {step === "password" && (
                    <Animated.View style={{ transform: [{ translateX: passwordShakeAnim }] }}>
                        <Text style={[styles.actionBtnText, { color: theme.buttonText }]}>Reset Password</Text>
                        <View
                            style={[
                                styles.inputContainer,
                                { backgroundColor: theme.inputBackground },
                                passwordError && { borderColor: theme.errorText, borderWidth: 1 },
                            ]}
                        >
                            <FontAwesome name="lock" size={24} color={theme.iconColor} style={styles.inputIcon} />
                            <TextInput
                                placeholder={passwordFocused ? "" : "New Password"}
                                placeholderTextColor={theme.placeholderTextColor}
                                secureTextEntry
                                style={[styles.inputText, { color: theme.text }]}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                            />
                        </View>
                        <View
                            style={[
                                styles.inputContainer,
                                { backgroundColor: theme.inputBackground },
                                passwordError && { borderColor: theme.errorText, borderWidth: 1 },
                            ]}
                        >
                            <FontAwesome name="lock" size={24} color={theme.iconColor} style={styles.inputIcon} />
                            <TextInput
                                placeholder={confirmPasswordFocused ? "" : "Confirm Password"}
                                placeholderTextColor={theme.placeholderTextColor}
                                secureTextEntry
                                style={[styles.inputText, { color: theme.text }]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                onFocus={() => setConfirmPasswordFocused(true)}
                                onBlur={() => setConfirmPasswordFocused(false)}
                            />
                        </View>
                        {passwordError ? (
                            <Text style={[styles.errorText, { color: theme.errorText }]}>{passwordError}</Text>
                        ) : null}
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.primary }]} onPress={handleResetPassword}>
                            <Text style={[styles.actionBtnText, { color: theme.buttonText }]}>Reset Password</Text>
                        </TouchableOpacity>
                    </Animated.View>
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
        marginBottom: 10,
    },
    actionBtn: {
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 15,
    },
    actionBtnText: {
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
