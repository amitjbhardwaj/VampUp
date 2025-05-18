import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Vibration, Animated, Platform, StatusBar, ToastAndroid, SafeAreaView } from "react-native";
import { RouteProp, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../RootNavigator";
import { useTheme } from "../context/ThemeContext";
import Header from "./Header";
import axios from "axios";

type ConfirmPassCodeRouteProp = RouteProp<RootStackParamList, "ConfirmPassCodeScreen">;
type ConfirmPassCodeNavigationProp = NavigationProp<RootStackParamList, "ConfirmPassCodeScreen">;

const ConfirmPassCodeScreen = ({
    route,
    navigation,
}: {
    route: ConfirmPassCodeRouteProp;
    navigation: ConfirmPassCodeNavigationProp;
}) => {
    const { passcode } = route.params;
    const { theme } = useTheme();
    const { userData } = route.params;
    const [confirmCode, setConfirmCode] = useState("");
    const [error, setError] = useState("");
    const [errorShake] = useState(new Animated.Value(0));
    const [pressedKey, setPressedKey] = useState<string | null>(null);

    const triggerShake = () => {
        Animated.sequence([
            Animated.timing(errorShake, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(errorShake, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(errorShake, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(errorShake, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const handleKeyPress = (key: string) => {
        if (confirmCode.length < 4) {
            setConfirmCode(prev => prev + key);
            setError("");
        }

        // Set key highlight
        setPressedKey(key);
        setTimeout(() => setPressedKey(null), 200);
    };

    const handleBackspace = () => {
        setConfirmCode(prev => prev.slice(0, -1));
        setPressedKey("←");
        setTimeout(() => setPressedKey(null), 200);
    };

    const handleSubmit = async () => {
        if (confirmCode.length !== 4) {
            setError("Please enter a 4-digit passcode");
            Vibration.vibrate(100);
            triggerShake();
            return;
        }

        if (confirmCode !== passcode) {
            setError("Passcodes do not match");
            Vibration.vibrate(200);
            triggerShake();
            setConfirmCode("");
            return;
        }

        try {
            const updatedUserData = { ...userData, passcode };

            axios
                .post("http://192.168.129.119:5001/register", updatedUserData)
                .then(res => {
                    if (res.data.status === "OK") {
                        navigation.navigate("RegistrationDone");
                    } else {
                        ToastAndroid.show("Registration failed: " + (res.data.data?.message || JSON.stringify(res.data.data)), ToastAndroid.SHORT);
                    }
                })
                .catch(e => {
                    ToastAndroid.show("Network error: " + (e.message || JSON.stringify(e)), ToastAndroid.SHORT);
                });
        } catch (e) {
            console.error("Failed to update passcode:", e);
            setError("Something went wrong. Please try again.");
        }
    };





    const renderDots = () => {
        return (
            <Animated.View style={[styles.dotsContainer, { transform: [{ translateX: errorShake }] }]}>
                {[0, 1, 2, 3].map(index => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: index < confirmCode.length ? theme.primary : "#ccc",
                            },
                        ]}
                    />
                ))}
            </Animated.View>
        );
    };

    const keypadLayout = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["←", "0", "✓"]];

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <Header title="Passcode" />
            <View style={[styles.container, { backgroundColor: theme.background }]}>

                <View style={styles.topContainer}>
                    <Text style={[styles.promptText, { color: theme.text }]}>Confirm Your Passcode</Text>
                    {renderDots()}
                    {error !== "" && <Text style={[styles.errorText, { color: theme.errorText }]}>{error}</Text>}
                </View>

                <View style={styles.keypadContainer}>
                    {keypadLayout.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.keypadRow}>
                            {row.map((key, index) => {
                                const isHighlighted = pressedKey === key;
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.keypadKey,
                                            isHighlighted && {
                                                backgroundColor: theme.primary,
                                                transform: [{ scale: 1.25 }],
                                            },
                                        ]}
                                        onPress={() => {
                                            if (key === "←") handleBackspace();
                                            else if (key === "✓") handleSubmit();
                                            else if (key !== "") handleKeyPress(key);
                                        }}
                                        disabled={key === ""}
                                        activeOpacity={0.7}
                                    >
                                        <Text
                                            style={[
                                                styles.keyText,
                                                { color: isHighlighted ? "#fff" : theme.text },
                                            ]}
                                        >
                                            {key}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))}
                </View>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    topContainer: {
        alignItems: "center",
        marginTop: 80,
    },
    promptText: {
        fontSize: 18,
        fontWeight: "500",
        marginBottom: 30,
    },
    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 12,
        gap: 18,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    resetText: {
        fontSize: 14,
        marginTop: 10,
        marginBottom: 20,
    },
    keypadContainer: {
        paddingBottom: 30,
    },
    keypadRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginVertical: 10,
    },
    keypadKey: {
        width: 70,
        height: 70,
        alignItems: "center",
        justifyContent: "center",
    },
    keyText: {
        fontSize: 26,
        fontWeight: "400",
    },
    errorText: {
        fontSize: 14,
        marginTop: 10,
        marginBottom: 20,
    },
});

export default ConfirmPassCodeScreen;
