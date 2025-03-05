import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
    Alert
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
    const scheme = useColorScheme();
    const isDarkMode = scheme === "dark";

    const handleLogin = () => {
        if (email === "worker" && password === "worker") {
            navigation.navigate({ name: "WorkerHomeScreen" } as never);
        } else {
            Alert.alert("Login Failed", "Invalid email or password.");
        }
    };

    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <Text style={[styles.helloText, isDarkMode && styles.darkText]}>
                    Hello <Entypo name="hand" size={24} color={isDarkMode ? "white" : "black"} />
                </Text>
                <Text style={[styles.signInText, isDarkMode && styles.darkText]}>Sign in to your account</Text>
            </View>

            {/* Email Input */}
            <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
                <Icon name="user" size={20} color={isDarkMode ? "#fff" : "#9A9A9A"} style={styles.icon} />
                <TextInput
                    placeholder="Email"
                    style={[styles.input, isDarkMode && styles.darkInput]}
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor={isDarkMode ? "#B0B0B0" : "#9A9A9A"}
                />
            </View>

            {/* Password Input */}
            <View style={[styles.inputContainer, isDarkMode && styles.darkInputContainer]}>
                <Icon name="lock" size={20} color={isDarkMode ? "#fff" : "#9A9A9A"} style={styles.icon} />
                <TextInput
                    placeholder="Password"
                    style={[styles.input, isDarkMode && styles.darkInput]}
                    secureTextEntry={secureText}
                    autoCapitalize="none"
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor={isDarkMode ? "#B0B0B0" : "#9A9A9A"}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
                    <Icon name={secureText ? "eye-slash" : "eye"} size={20} color={isDarkMode ? "#fff" : "#9A9A9A"} />
                </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity onPress={() => navigation.navigate({ name: "ForgotPassword" } as never)}>
                <Text style={[styles.forgotPassword, isDarkMode && styles.darkText]}>Forgot your password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Create Account Link */}
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={[styles.footerText, isDarkMode && styles.darkText]}>
                    Don't have an account? <Text style={[styles.createText, isDarkMode && styles.darkCreateText]}>Create</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(255, 255, 255)",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    darkContainer: {
        backgroundColor: "#121212",
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 30,
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
    darkText: {
        color: "#fff",
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
    darkInputContainer: {
        backgroundColor: "#333333",
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    darkInput: {
        color: "#fff",
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
    darkCreateText: {
        color: "#B2B2B2",
    },
    createText: {
        fontWeight: "bold",
        textDecorationLine: "underline",
        color: "#1A8F3B",
    },
    footerText: {
        textAlign: "center",
        fontSize: 16,
        color: "#000",
    },
    button: {
        flexDirection: "row",
        backgroundColor: "#1A8F3B",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default LoginScreen;
