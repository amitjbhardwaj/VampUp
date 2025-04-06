import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const NetBankingPaymentScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const { projectId } = route.params as { projectId: string };

    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const [accountNumber, setAccountNumber] = useState<string>("");
    const [ifscCode, setIfscCode] = useState<string>("");

    const handlePayment = () => {
        if (!selectedBank || !accountNumber || !ifscCode) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        // Simulating a successful transaction
        Alert.alert("Payment Successful", `Payment for Project ID ${projectId} completed through ${selectedBank}`, [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
    };

    const handleCancel = ()=>{
        navigation.goBack();
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.header, { color: theme.primary }]}>Net Banking Payment</Text>

            <Text style={[styles.label, { color: theme.text }]}>Select Bank</Text>
            <Picker
                selectedValue={selectedBank}
                onValueChange={(itemValue) => setSelectedBank(itemValue)}
                style={[styles.picker, { backgroundColor: theme.card, color: theme.text }]}
            >
                <Picker.Item label="Select Bank" value={null} />
                <Picker.Item label="ICICI Bank" value="ICICI" />
                <Picker.Item label="HDFC Bank" value="HDFC" />
                <Picker.Item label="SBI" value="SBI" />
                <Picker.Item label="Axis Bank" value="Axis" />
            </Picker>

            <Text style={[styles.label, { color: theme.text }]}>Enter Account Number</Text>
            <TextInput
                style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
                placeholder="Account Number"
                keyboardType="numeric"
                value={accountNumber}
                onChangeText={setAccountNumber}
            />

            <Text style={[styles.label, { color: theme.text }]}>Enter IFSC Code</Text>
            <TextInput
                style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
                placeholder="IFSC Code"
                value={ifscCode}
                onChangeText={setIfscCode}
            />

            <View style={styles.buttonContainer}>
                <Pressable
                    style={[styles.payButton, { backgroundColor: theme.primary, marginRight: 10 }]}
                    onPress={handlePayment}
                >
                    <Text style={styles.buttonText}>Pay Now</Text>
                </Pressable>
                <Pressable
                    style={[styles.payButton, { backgroundColor: theme.primary }]}
                    onPress={handleCancel}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
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
    picker: { borderWidth: 2, borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 20 },
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
    buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

export default NetBankingPaymentScreen;
