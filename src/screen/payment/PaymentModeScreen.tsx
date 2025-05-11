import React, { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Platform, StatusBar, SafeAreaView } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Icons for a modern look
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../RootNavigator";
import Header from "../Header";

const paymentModes = [
    { name: "UPI", icon: "payments" },
    { name: "Net Banking", icon: "account-balance" },
    { name: "Credit Card", icon: "credit-card" },
    { name: "Debit Card", icon: "credit-card" },
    { name: "Wallets", icon: "account-balance-wallet" },
    { name: "NEFT", icon: "sync-alt" },
    { name: "RTGS", icon: "sync" },
    { name: "IMPS", icon: "flash-on" }
];

type NavigationProps = StackNavigationProp<RootStackParamList, "PaymentModeScreen">;

const PaymentModeScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute();

    const { projectId, fund } = route.params as { projectId: string; fund: number; };
    const [selectedMode, setSelectedMode] = useState<string | null>(null);

    const handlePaymentSelection = (mode: string) => {
        setSelectedMode(mode);
    };

    const handleCancel = () => {
        navigation.goBack();
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <Header title="Select Payment Mode" />
            <View style={[styles.container, { backgroundColor: theme.background }]}>

                <FlatList
                    data={paymentModes}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[
                                styles.paymentOption,
                                { backgroundColor: theme.card, borderColor: selectedMode === item.name ? theme.primary : "gray" }
                            ]}
                            onPress={() => handlePaymentSelection(item.name)}
                        >
                            <Icon name={item.icon} size={24} color={theme.primary} />
                            <Text style={[styles.optionText, { color: theme.text }]}>{item.name}</Text>
                            {selectedMode === item.name && <Icon name="check-circle" size={24} color={theme.primary} />}
                        </Pressable>
                    )}
                />

                {/* Proceed Button */}
                {selectedMode && (
                    <Pressable
                        style={[styles.proceedButton, { backgroundColor: theme.primary }]}
                        onPress={() => {
                            if (selectedMode === "UPI") {
                                navigation.navigate("UPIPaymentScreen", { projectId, fund });
                            } else if (selectedMode === "Net Banking") {
                                navigation.navigate("NetBankingPaymentScreen", { projectId, fund });
                            } else if (selectedMode === "Debit Card") {
                                navigation.navigate("DebitCardPaymentScreen", { projectId, fund });
                            } else if (selectedMode === "Credit Card") {
                                navigation.navigate("CreditCardPaymentScreen", { projectId, fund });
                            } else if (selectedMode === "Wallets") {
                                navigation.navigate("WalletsPaymentScreen", { projectId, fund });
                            } else if (selectedMode === "NEFT") {
                                navigation.navigate("NEFTPaymentScreen", { projectId, fund });
                            } else if (selectedMode === "RTGS") {
                                navigation.navigate("RTGSPaymentScreen", { projectId, fund });
                            } else if (selectedMode === "IMPS") {
                                navigation.navigate("IMPSPaymentScreen", { projectId, fund });
                            } else {
                                console.log(`Proceeding with ${selectedMode} for project ${projectId}`);
                            }
                        }}
                    >
                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Proceed with {selectedMode}</Text>
                    </Pressable>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
    paymentOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderRadius: 8,
        borderWidth: 2,
        marginVertical: 5,
        justifyContent: "space-between"
    },
    optionText: { fontSize: 16, fontWeight: "bold", flex: 1, marginLeft: 10 },
    proceedButton: { padding: 15, borderRadius: 8, alignItems: "center", marginTop: 15 },
    buttonText: { fontWeight: "bold", fontSize: 16 },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
});

export default PaymentModeScreen;
