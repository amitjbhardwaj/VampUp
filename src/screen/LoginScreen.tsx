import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    Alert,
    ToastAndroid
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TouchID from "react-native-touch-id";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';

type LoginScreenNavigationProp = NavigationProp<RootStackParamList>;

const LoginScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [secureText, setSecureText] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = () => {
        const userData = { email: username, password };

        axios.post("http://192.168.129.119:5001/login-user", userData)
            .then(res => {
                if (res.data.status === "OK") {
                    const { token, role, firstName, lastName } = res.data;
                    AsyncStorage.setItem("authToken", token);

                    if (role === "Worker") {
                        AsyncStorage.setItem("workerName", `${firstName ?? ""} ${lastName ?? ""}`.trim());
                        navigation.navigate("WorkerHomeScreen" as never);
                    } else if (role === "Contractor") {
                        AsyncStorage.setItem("contractorName", `${firstName ?? ""} ${lastName ?? ""}`.trim());
                        navigation.navigate("ContractorHomeScreen" as never);
                    } else if (role === "Admin") {
                        AsyncStorage.setItem("adminName", `${firstName ?? ""} ${lastName ?? ""}`.trim());
                        navigation.navigate("AdminHomeScreen" as never);
                    } else {
                        Alert.alert("Unknown role detected");
                    }
                } else {
                    Alert.alert("Login failed: " + res.data.error);
                }
            })
            .catch(() => Alert.alert("An error occurred while logging in."));
    };

    const handleBiometricLogin = () => {
        TouchID.authenticate("Login with Biometrics", {
            title: "Authenticate",
            sensorErrorDescription: "Biometric authentication failed",
        })
            .then(() => {
                const userRole = "worker"; // Dynamically change based on authentication

                if (userRole === "worker") {
                    navigation.navigate("WorkerHomeScreen" as never);
                } else if (userRole === "contractor") {
                    navigation.navigate("ContractorHomeScreen" as never);
                } else if (userRole === "admin") {
                    navigation.navigate("AdminHomeScreen" as never);
                }
            })
            .catch(() => {
                Alert.alert("Authentication Failed", "Unable to authenticate using biometrics.");
            });
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={"always"}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
                <Text style={[styles.helloText, { color: theme.text }]}>Welcome</Text>
                <Text style={[styles.signInText, { color: theme.text }]}>Sign in to your account</Text>

                {/* Username Field */}
                <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
                    <Icon name="user" size={18} color={theme.icon} style={styles.icon} />
                    <TextInput
                        placeholder="Username"
                        placeholderTextColor={theme.mode === "dark" ? "#fff" : "#999"}
                        style={[styles.input, { color: theme.text }]}
                        autoCapitalize="none"
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>

                {/* Password Field */}
                <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
                    <Icon name="lock" size={18} color={theme.icon} style={styles.icon} />
                    <TextInput
                        placeholder="Password"
                        style={[styles.input, { color: theme.text }]}
                        secureTextEntry={secureText}
                        autoCapitalize="none"
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor={theme.mode === "dark" ? "#fff" : "#999"}
                    />
                    <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
                        <Icon name={secureText ? "eye-slash" : "eye"} size={18} color={theme.icon} />
                    </TouchableOpacity>
                </View>

                {errorMessage ? <Text style={[styles.errorText, { color: theme.errorColor }]}>{errorMessage}</Text> : null}

                <TouchableOpacity onPress={() => navigation.navigate({ name: "ForgotPassword" } as never)}>
                    <Text style={[styles.forgotPassword, { color: theme.primary }]}>Forgot your password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity style={[styles.biometricButton, { backgroundColor: theme.primary }]} onPress={handleLogin}>
                    <MaterialCommunityIcons name="login" size={22} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                {/* Biometric Login Button */}
                <TouchableOpacity style={[styles.biometricButton, { backgroundColor: theme.primary }]} onPress={handleBiometricLogin}>
                    <MaterialCommunityIcons name="fingerprint" size={22} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Login with Biometrics</Text>
                </TouchableOpacity>

                {/* Login with Passcode Button */}
                <TouchableOpacity
                    style={[styles.biometricButton, { backgroundColor: theme.primary }]}
                    onPress={() => navigation.navigate("VerifyAadharScreen" as never)}
                >
                    <MaterialCommunityIcons name="lock" size={22} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Login with Passcode</Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                    <Text style={[styles.footerText, { color: theme.text }]}>
                        Don't have an account? <Text style={styles.createText}>Create</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
        marginLeft: 40,
    },
    helloText: {
        fontSize: 28,
        fontWeight: "bold",
    },
    signInText: {
        fontSize: 16,
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 15,
        width: "100%",
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 10,
    },
    forgotPassword: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 20,
    },
    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        marginTop: 20,
    },
    biometricButton: {
        flexDirection: "row",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginTop: 10,
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    footerText: {
        fontSize: 16,
        marginTop: 20,
    },
    createText: {
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
    errorText: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 10,
    },
});

export default LoginScreen;
