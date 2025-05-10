import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation, useRoute } from "@react-navigation/native";

const DebitCardPaymentScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const { projectId } = route.params as { projectId: string };

    const [cardNumber, setCardNumber] = useState<string>("");
    const [expiryDate, setExpiryDate] = useState<string>("");
    const [cvv, setCvv] = useState<string>("");

    const handlePayment = () => {
        if (!cardNumber || !expiryDate || !cvv) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        // Simulating a successful transaction
        Alert.alert("Payment Successful", `Payment for Project ID ${projectId} completed using Debit Card`, [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
    };

    const handleCancel = ()=>{
        navigation.goBack();
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.header, { color: theme.primary }]}>Debit Card Payment</Text>

            <Text style={[styles.label, { color: theme.text }]}>Card Number</Text>
            <TextInput
                style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
                placeholder="XXXX XXXX XXXX XXXX"
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={setCardNumber}
            />

            <Text style={[styles.label, { color: theme.text }]}>Expiry Date</Text>
            <TextInput
                style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={setExpiryDate}
            />

            <Text style={[styles.label, { color: theme.text }]}>CVV</Text>
            <TextInput
                style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
                placeholder="CVV"
                keyboardType="numeric"
                value={cvv}
                onChangeText={setCvv}
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
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    payButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },    buttonText: { fontWeight: "bold", fontSize: 16 },
});

export default DebitCardPaymentScreen;
