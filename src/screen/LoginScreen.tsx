import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,  // Import Image
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";

type LoginScreenNavigationProp = NavigationProp<RootStackParamList>;

const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secureText, setSecureText] = useState(true);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleLogin = () => {
        let valid = true;
        if (!email) {
            setEmailError("Enter email address");
            valid = false;
        } else {
            setEmailError("");
        }
        
        if (!password) {
            setPasswordError("Enter password");
            valid = false;
        } else {
            setPasswordError("");
        }

        if (valid) {
            if (email === "worker" && password === "worker") {
                navigation.navigate({ name: "WorkerHomeScreen" } as never);
            } else {
                setEmailError("Invalid email or password");
                setPasswordError("Invalid email or password");
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* Logo */}
            <View style={styles.headerContainer}>
                <Image
                    source={require("../assets/logo.png")} // Replace with the correct path to your logo
                    style={styles.logo}
                    resizeMode="contain" // Ensure logo is fully visible and properly scaled
                />
                <Text style={styles.helloText}>
                    Welcome 
                </Text>
                <Text style={styles.signInText}>Sign in to your account</Text>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
                <Icon name="user" size={20} color="#9A9A9A" style={styles.icon} />
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#9A9A9A"
                />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            {/* Password Input */}
            <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#9A9A9A" style={styles.icon} />
                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    secureTextEntry={secureText}
                    autoCapitalize="none"
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#9A9A9A"
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
                    <Icon name={secureText ? "eye-slash" : "eye"} size={20} color="#9A9A9A" />
                </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            {/* Forgot Password */}
            <TouchableOpacity onPress={() => navigation.navigate({ name: "ForgotPassword" } as never)}>
                <Text style={styles.forgotPassword}>Forgot your password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Icon name="lock" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}> Login</Text>
            </TouchableOpacity>

            {/* Create Account Link */}
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.footerText}>
                    Don't have an account? <Text style={styles.createText}>Create</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "flex-start",  // Make sure to use flex-start to align content from top
        paddingHorizontal: 20,
    },
    headerContainer: {
        alignItems: "center",
        marginTop: 50, // Adjusted top margin to ensure logo fits
        marginBottom: 20, // Adjust the bottom margin for proper spacing
    },
    logo: {
        width: 150,  // Adjust the size of the logo as needed
        height: 150, // Adjust the size of the logo as needed
        marginBottom: 30, // Reduced space between logo and text
    },
    helloText: {
        fontSize: 50,
        fontWeight: "bold",
    },
    signInText: {
        fontSize: 18,
        color: "#020E02",
        marginTop: 5,
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
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    eyeIcon: {
        padding: 10,
    },
    forgotPassword: {
        textAlign: "right",
        fontSize: 14,
        color: "#333",
        marginBottom: 20,
    },
    createText: {
        fontWeight: "bold",
        textDecorationLine: "underline",
        color: "#000",
    },
    footerText: {
        textAlign: "center",
        fontSize: 16,
        color: "#000",
    },
    button: {
        flexDirection: "row",
        backgroundColor: "#000",
        padding: 15,
        borderRadius: 10,
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
        color: "red",
        fontSize: 14,
        marginBottom: 10,
        marginLeft: 10,
    },
});

export default LoginScreen;
