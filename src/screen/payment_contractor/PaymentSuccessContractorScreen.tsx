import React from "react";
import { View, Text, StyleSheet, Platform, StatusBar, Pressable } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { useTheme } from "../../context/ThemeContext";

type PaymentSuccessRouteParams = {
    PaymentSuccessContractorScreen: {
        fund: number;
        name: string | null;
    };
};

type PaymentSuccessRouteProp = RouteProp<
    PaymentSuccessRouteParams,
    "PaymentSuccessContractorScreen"
>;

const PaymentSuccessContractorScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<PaymentSuccessRouteProp>();
    const { fund, name } = route.params;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.screenTitle, { color: theme.text }]}>Confirmation</Text>

            <View style={styles.contentContainer}>
                <LottieView
                    source={require("../../assets/registration_successfully.json")}
                    autoPlay
                    loop={false}
                    style={styles.animation}
                />
                <Text style={[styles.title, { color: theme.primary }]}>Payment Successful!</Text>
                <Text style={[styles.text, { color: theme.text }]}>
                    Amount Paid: ₹{fund}
                </Text>
                <Text style={[styles.text, { color: theme.text }]}>
                    Approved by: {name || "Unknown"}
                </Text>
            </View>

            <Pressable
                style={[styles.doneButton, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate("ContractorHomeScreen" as never)}
            >
                <Text style={[styles.doneButtonText, { color: theme.buttonText }]}>Done</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
        paddingHorizontal: 20,
    },
    screenTitle: {
        fontSize: 20,
        fontWeight: "bold",
        position: "absolute",
        top: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 10,
        left: 20,
    },
    contentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    animation: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
        marginBottom: 6,
    },
    doneButton: {
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 20,
    },
    doneButtonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default PaymentSuccessContractorScreen;
