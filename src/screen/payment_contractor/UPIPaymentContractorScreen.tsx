import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { RootStackParamList } from "../../RootNavigator";
import { StackNavigationProp } from "@react-navigation/stack";

type UPIPaymentRouteParams = {
    UPIPaymentContractorScreen: {
        _id: string;
        projectId: string;
        fund: number;
    };
};

type UPIPaymentRouteProp = RouteProp<UPIPaymentRouteParams, "UPIPaymentContractorScreen">;
type NavigationProp = StackNavigationProp<RootStackParamList, 'UPIPaymentContractorScreen'>;


const UPIPaymentContractorScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<UPIPaymentRouteProp>();
    const { _id, projectId, fund } = route.params as { _id: string; projectId: string; fund: number; };
    const [upiId, setUpiId] = useState("");
    const [amount, setAmount] = useState<string>(route?.params?.fund?.toString() || "");
    const [contractor, setContractor] = useState<string | null>(null);

    useEffect(() => {
        const fetchContractorName = async () => {
            const storedName = await AsyncStorage.getItem("contractorName");
            setContractor(storedName);
        };

        fetchContractorName();
    }, []);


    const handlePayment = async () => {
        if (!upiId.includes("@")) {
            Alert.alert("Invalid UPI ID", "Please enter a valid UPI ID (e.g., example@upi)");
            return;
        }

        try {
            // Update project status
            await axios.put(
                `http://192.168.129.119:5001/update-project-status/${_id}`,
                {
                    second_level_payment_approver: contractor,
                    second_level_payment_status: "Approved",
                }
            );

            // Navigate to success screen with fund and contractor name
            navigation.navigate("PaymentSuccessContractorScreen", {
                fund,
                name: contractor,
            });
        } catch (error) {
            console.error("Failed to update project approver:", error);
            Alert.alert("Payment Error", "There was a problem updating the payment status.");
        }
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

export default UPIPaymentContractorScreen;
