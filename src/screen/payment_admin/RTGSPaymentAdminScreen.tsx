import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { RootStackParamList } from "../../RootNavigator";
import { StackNavigationProp } from "@react-navigation/stack";

type RTGSPaymentRouteParams = {
    RTGSPaymentAdminScreen: {
        _id: string;
        projectId: string;
        fund: number;
    };
};

type RTGSPaymentRouteProp = RouteProp<RTGSPaymentRouteParams, "RTGSPaymentAdminScreen">;
type NavigationProp = StackNavigationProp<RootStackParamList, 'RTGSPaymentAdminScreen'>;


const RTGSPaymentAdminScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RTGSPaymentRouteProp>();
    const { _id, projectId, fund } = route.params as { _id: string; projectId: string; fund: number; };

    const [bankName, setBankName] = useState<string>("");
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
        if (!bankName || !accountNumber || !ifscCode || !amount) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        try {
            const response = await axios.put(
                `http://192.168.129.119:5001/update-project-status/${_id}`,
                {
                    first_level_payment_approver: admin,
                    first_level_payment_status: "Approved",
                }
            );

            // Navigate to success screen with fund and contractor name
            navigation.navigate("PaymentSuccessAdminScreen", {
                fund,
                name: admin,
            });
            
        } catch (error) {
            console.error("Failed to update project approver:", error);
        }
    };

    const handleCancel = ()=>{
        navigation.goBack();
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.header, { color: theme.primary }]}>RTGS Payment</Text>

            <Text style={[styles.label, { color: theme.text }]}>Bank Name</Text>
            <TextInput
                style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
                placeholder="Enter Bank Name"
                value={bankName}
                onChangeText={setBankName}
            />

            <Text style={[styles.label, { color: theme.text }]}>Account Number</Text>
            <TextInput
                style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
                placeholder="Enter Account Number"
                keyboardType="numeric"
                value={accountNumber}
                onChangeText={setAccountNumber}
            />

            <Text style={[styles.label, { color: theme.text }]}>IFSC Code</Text>
            <TextInput
                style={[styles.input, { borderColor: theme.primary, color: theme.text }]}
                placeholder="Enter IFSC Code"
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

export default RTGSPaymentAdminScreen;
