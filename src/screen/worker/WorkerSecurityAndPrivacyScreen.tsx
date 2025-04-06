import React from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, SafeAreaView, Platform } from "react-native";
import Header from "../Header";
import { useTheme } from "../../context/ThemeContext";

const WorkerSecurityAndPrivacyScreen = () => {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <Header title="Security & Privacy" />
            <ScrollView>
                <View style={styles.container}>
                    {/* Status bar for proper spacing */}
                    <StatusBar backgroundColor="#fff" barStyle="dark-content" />

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 90,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: StatusBar.currentHeight,
    },
    backButton: {
        position: "absolute",
        left: 20,
        top: "180%",
        transform: [{ translateY: -12 }], // Center vertically
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
    },
    content: {
        marginTop: 110, // Push options further down
        paddingHorizontal: 20,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 15,
        marginVertical: 5,
        borderRadius: 8,
        elevation: 2,
    },
    optionText: {
        fontSize: 16,
        marginLeft: 10,
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
});

export default WorkerSecurityAndPrivacyScreen;
