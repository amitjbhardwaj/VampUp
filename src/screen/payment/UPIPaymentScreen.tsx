import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation, useRoute } from "@react-navigation/native";

const UPIPaymentScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const { projectId } = route.params as { projectId: string };

    const [upiId, setUpiId] = useState("");

    const handlePayment = () => {
        if (!upiId.includes("@")) {
            Alert.alert("Invalid UPI ID", "Please enter a valid UPI ID (e.g., example@upi)");
            return;
        }

        Alert.alert("Payment Successful", `Payment for Project ID ${projectId} completed via ${upiId}`, [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
    };

    const handleCancel = () => {
        navigation.goBack();
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.header, { color: theme.primary }]}>UPI Payment</Text>

            <Text style={[styles.label, { color: theme.text }]}>Enter UPI ID</Text>
            <TextInput
                style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
                placeholder="example@upi"
                placeholderTextColor="gray"
                value={upiId}
                onChangeText={setUpiId}
            />
            <View style={styles.buttonContainer}>
                <Pressable
                    style={[styles.payButton, { backgroundColor: theme.primary, marginRight: 10 }]}
                    onPress={handlePayment}
                >
                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Pay Now</Text>
                </Pressable>
                <Pressable
                    style={[styles.payButton, { backgroundColor: theme.primary }]}
                    onPress={handleCancel}
                >
                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Cancel</Text>
                </Pressable>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center" },
    header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
    input: {
        borderWidth: 2,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 20
    },
    buttonText: { fontWeight: "bold", fontSize: 16 },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    payButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
});

export default UPIPaymentScreen;
