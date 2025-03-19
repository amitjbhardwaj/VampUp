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
import axios from 'axios'

type LoginScreenNavigationProp = NavigationProp<RootStackParamList>;

const LoginScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [secureText, setSecureText] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");


    const handleLogin = () => {
        const userData = {
            email: username,
            password: password,
        };

        axios
            .post("http://192.168.129.119:5001/login-user", userData)
            .then(res => {
                if (res.data.status === "OK") {
                    const { token, role } = res.data;

                    // Store token and role in AsyncStorage
                    AsyncStorage.setItem("authToken", token);
                    //AsyncStorage.setItem("userRole", role);

                    // Navigate based on role
                    if (role === "Worker") {
                        navigation.navigate("WorkerHomeScreen" as never);
                    } else if (role === "Contractor") {
                        navigation.navigate("ContractorHomeScreen" as never);
                    } else if (role === "Admin") {
                        navigation.navigate("AdminHomeScreen" as never);
                    } else {
                        ToastAndroid.show("Unknown role detected", ToastAndroid.SHORT);
                    }
                } else {
                    ToastAndroid.show("Login failed: " + res.data.error, ToastAndroid.SHORT);
                }
            })
            .catch(() => {
                ToastAndroid.show("An error occurred while logging in.", ToastAndroid.SHORT);
            });
    };


    const handleBiometricLogin = () => {
        TouchID.authenticate("Login with Biometrics", {
            title: "Authenticate",
            sensorErrorDescription: "Biometric authentication failed",
        })
            .then(() => {
                // Assume we retrieve the role from storage or backend
                const userRole = "worker"; // Change dynamically based on real authentication

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
            <View style={[styles.container, { backgroundColor: theme.background, flex: 1 }]}>
                <View style={styles.headerContainer}>
                    <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
                    <Text style={[styles.helloText, { color: theme.text }]}>Welcome</Text>
                    <Text style={[styles.signInText, { color: theme.text }]}>Sign in to your account</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="user" size={20} color={theme.icon} style={styles.icon} />
                    <TextInput
                        placeholder="Username"
                        style={[styles.input, { color: theme.text, backgroundColor: theme.inputBackground }]}
                        autoCapitalize="none"
                        value={username}
                        onChangeText={setUsername}
                        placeholderTextColor={theme.icon}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color={theme.icon} style={styles.icon} />
                    <TextInput
                        placeholder="Password"
                        style={[styles.input, { color: theme.text, backgroundColor: theme.inputBackground }]}
                        secureTextEntry={secureText}
                        autoCapitalize="none"
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor={theme.icon}
                    />
                    <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
                        <Icon name={secureText ? "eye-slash" : "eye"} size={20} color={theme.icon} />
                    </TouchableOpacity>
                </View>
                {errorMessage ? <Text style={[styles.errorText, { color: theme.errorColor }]}>{errorMessage}</Text> : null}

                <TouchableOpacity onPress={() => navigation.navigate({ name: "ForgotPassword" } as never)}>
                    <Text style={[styles.forgotPassword, { color: theme.primary }]}>Forgot your password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleLogin}>
                    <Icon name="sign-in" size={20} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}> Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.biometricButton, { backgroundColor: theme.primary }]} onPress={handleBiometricLogin}>
                    <MaterialCommunityIcons name="fingerprint" size={24} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}> Login with Biometrics</Text>
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
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 30,
    },
    logo: {
        width: 140,
        height: 140,
        marginBottom: 20,
        marginLeft: 50,
    },
    helloText: {
        fontSize: 36,
        fontWeight: "bold",
    },
    signInText: {
        fontSize: 16,
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 55,
        elevation: 3,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#D1D1D1",
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 10,
    },
    forgotPassword: {
        textAlign: "right",
        fontSize: 14,
        marginBottom: 20,
        fontWeight: "bold",
    },
    button: {
        flexDirection: "row",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 4 },
    },
    biometricButton: {
        flexDirection: "row",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        shadowColor: "#007AFF",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 4 },
    },
    buttonIcon: {
        marginRight: 12,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    footerText: {
        textAlign: "center",
        fontSize: 16,
        marginTop: 20,
    },
    createText: {
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
    errorText: {
        fontSize: 14,
        marginBottom: 10,
        textAlign: "center",
    },
});

export default LoginScreen;
