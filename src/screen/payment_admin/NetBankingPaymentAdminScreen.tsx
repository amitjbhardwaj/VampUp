import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

type NetBankingPaymentRouteParams = {
    NetBankingPaymentAdminScreen: {
        _id: string;
        projectId: string;
        fund: number;
    };
};

type NetBankingPaymentRouteProp = RouteProp<NetBankingPaymentRouteParams, "NetBankingPaymentAdminScreen">;



const NetBankingPaymentAdminScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<NetBankingPaymentRouteProp>();
    const { _id, projectId, fund } = route.params as { _id: string; projectId: string; fund: number; };

    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const [accountNumber, setAccountNumber] = useState<string>("");
    const [ifscCode, setIfscCode] = useState<string>("");
    const [amount, setAmount] = useState<string>(route?.params?.fund?.toString() || "");
    const [admin, setAdmin] = useState<string | null>(null);

    useEffect(() => {
        const fetchAdminName = async () => {
            const storedName = await AsyncStorage.getItem("adminName");
            setAdmin(storedName);
        };

        fetchAdminName();
    }, []);
    
    const handlePayment = async () => {
        if (!selectedBank || !accountNumber || !ifscCode) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        // Simulating a successful transaction
        Alert.alert("Payment Successful", `Payment for Project ID ${projectId} completed through ${selectedBank} of amount ${fund}`, [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);

        try {
            const response = await axios.put(
                `http://192.168.129.119:5001/update-project-status/${_id}`,
                {
                    first_level_payment_approver: admin,
                    first_level_payment_status: "Approved",
                }
            );

            //console.log("Update successful:", response.data);
        } catch (error) {
            console.error("Failed to update project approver:", error);
        }
    };

    const handleCancel = () => {
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

            <Text style={[styles.label, { color: theme.text }]}>Amount</Text>
            <TextInput
                style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
                placeholder="Enter Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
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
    buttonText: { fontWeight: "bold", fontSize: 16 },
});

export default NetBankingPaymentAdminScreen;
