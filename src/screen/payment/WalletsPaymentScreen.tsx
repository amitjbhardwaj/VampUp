import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation, useRoute } from "@react-navigation/native";

const WalletsPaymentScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const { projectId } = route.params as { projectId: string };

    const [walletBalance, setWalletBalance] = useState<string>("");
    const [amount, setAmount] = useState<string>("");

    const handlePayment = () => {
        if (!amount || !walletBalance) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        // Simulating a successful transaction
        Alert.alert("Payment Successful", `Payment for Project ID ${projectId} completed using Wallets`, [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.header, { color: theme.primary }]}>Wallet Payment</Text>

            <Text style={[styles.label, { color: theme.text }]}>Wallet Balance</Text>
            <TextInput
                style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
                placeholder="Enter Wallet Balance"
                keyboardType="numeric"
                value={walletBalance}
                onChangeText={setWalletBalance}
            />

            <Text style={[styles.label, { color: theme.text }]}>Amount</Text>
            <TextInput
                style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
                placeholder="Enter Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />

            <Pressable
                style={[styles.payButton, { backgroundColor: theme.primary }]}
                onPress={handlePayment}
            >
                <Text style={styles.buttonText}>Pay Now</Text>
            </Pressable>
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
    payButton: { padding: 15, borderRadius: 8, alignItems: "center" },
    buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

export default WalletsPaymentScreen;
