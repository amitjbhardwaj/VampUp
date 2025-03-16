import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    Alert
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TouchID from "react-native-touch-id";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";

type LoginScreenNavigationProp = NavigationProp<RootStackParamList>;

const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [secureText, setSecureText] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = () => {
        if (!username || !password) {
            setErrorMessage("Username and password are required");
            return;
        }
        
        if (username === "worker" && password === "worker") {
            navigation.navigate({ name: "WorkerHomeScreen" } as never);
        } else {
            setErrorMessage("Invalid username or password");
        }
    };

    const handleBiometricLogin = () => {
        TouchID.authenticate("Login with Biometrics", {
            title: "Authenticate",
            sensorErrorDescription: "Biometric authentication failed",
        })
            .then(() => {
                navigation.navigate({ name: "WorkerHomeScreen" } as never);
            })
            .catch(() => {
                Alert.alert("Authentication Failed", "Unable to authenticate using biometrics.");
            });
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

            <View style={[styles.container, { flex: 1 }]}>

                <View style={styles.headerContainer}>
                    <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
                    <Text style={styles.helloText}>Welcome</Text>
                    <Text style={styles.signInText}>Sign in to your account</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="user" size={20} color="#9A9A9A" style={styles.icon} />
                    <TextInput
                        placeholder="Username"
                        style={styles.input}
                        autoCapitalize="none"
                        value={username}
                        onChangeText={setUsername}
                        placeholderTextColor="#9A9A9A"
                    />
                </View>

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
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <TouchableOpacity onPress={() => navigation.navigate({ name: "ForgotPassword" } as never)}>
                    <Text style={styles.forgotPassword}>Forgot your password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Icon name="sign-in" size={20} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}> Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
                <MaterialCommunityIcons name="fingerprint" size={24} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}> Login with Biometrics</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                    <Text style={styles.footerText}>
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
        backgroundColor: "#F8F9FA",
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
    },
    helloText: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#1D1D1D",
    },
    signInText: {
        fontSize: 16,
        color: "#666",
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 55,
        elevation: 3,
        marginBottom: 15,
        borderColor: "#D1D1D1",
        borderWidth: 1,
    },
    icon: {
        marginRight: 12,
        color: "#555",
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
        color: "#007AFF",
        marginBottom: 20,
        fontWeight: "bold",
    },
    button: {
        flexDirection: "row",
        backgroundColor: "#000",
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
        backgroundColor: "#007AFF",
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
        color: "#666",
        marginTop: 20,
    },
    createText: {
        fontWeight: "bold",
        textDecorationLine: "underline",
        color: "#000",
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginBottom: 10,
        textAlign: "center",
    },
});


export default LoginScreen;
