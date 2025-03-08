import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // or another icon set
import { useNavigation } from "@react-navigation/native";

const Home = () => {
    const navigation = useNavigation();

    // Set the back button in the header
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={30} color="#000" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <ScrollView>
            <View style={styles.container}>
                {/* Active Work Icon */}
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => navigation.navigate({ name: 'WorkerActiveWorkScreen' } as never)}
                >
                    <Icon name="work" size={60} color="#000" />
                    <Text style={styles.iconText}>Active Projects</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => navigation.navigate({ name: 'WorkerWorkHistoryScreen' } as never)}
                >
                    <Icon name="history" size={60} color="#000" />
                    <Text style={styles.iconText}>Work History</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => navigation.navigate({ name: 'WorkerFullPaymentHistoryScreen' } as never)}
                >
                    <Icon name="payment" size={60} color="#000" />
                    <Text style={styles.iconText}>Payment History</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => navigation.navigate({ name: 'WorkerComplaintHistoryScreen' } as never)}
                >
                    <Icon name="report-problem" size={60} color="#000" />
                    <Text style={styles.iconText}>Request or Complaints</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(255, 255, 255)",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: 20,
        flexDirection: "row",
        flexWrap: "wrap",

    },
    iconContainer: {
        alignItems: "center",
        marginVertical: 20,
        width: "60%", // Ensures 3 icons per row
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    iconText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
    },
});

export default Home;
