import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Card, Divider } from "react-native-paper";
import { RootStackParamList } from "../../RootNavigator";

type WorkerPersonalDetailsRouteProp = RouteProp<RootStackParamList, "WorkerPersonalDetailsScreen">;

const WorkerPersonalDetailsScreen = ({ route }: { route: WorkerPersonalDetailsRouteProp }) => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState<Record<string, string> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (route.params?.userData) {
                    setUserData(route.params.userData);
                    await AsyncStorage.setItem("userData", JSON.stringify(route.params.userData));
                } else {
                    const storedUserData = await AsyncStorage.getItem("userData");
                    if (storedUserData) {
                        setUserData(JSON.parse(storedUserData));
                    }
                }
            } catch (error) {
                console.error("Error retrieving user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [route.params]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200EE" />
            </View>
        );
    }

    if (!userData) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No user data found.</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />

                {/* Header */}
                <View style={styles.header}>
                    {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={30} color="#000" />
                    </TouchableOpacity> */}
                    <Text style={styles.headerText}>Personal Details</Text>
                </View>

                {/* Scrollable Content */}
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Card style={styles.card}>
                        <Card.Title
                            title={`Welcome, ${userData.firstName} ${userData.lastName}!`}
                            titleStyle={styles.title}
                            left={(props) => <Icon {...props} name="person" size={40} color="#6200EE" />}
                        />
                        <Divider style={styles.divider} />

                        {/* Personal Details Section */}
                        <View style={styles.infoContainer}>
                            <View style={styles.infoRow}>
                                <Icon name="work" size={20} color="#6200EE" />
                                <Text style={styles.infoText}>Role: {userData.role}</Text>
                                <TouchableOpacity onPress={() => { /* Handle Edit for Role */ }}>
                                    <Icon name="edit" size={20} color="#6200EE" style={styles.editIcon} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.infoRow}>
                                <Icon name="person" size={20} color="#6200EE" />
                                <Text style={styles.infoText}>First name: {userData.firstName} </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="person" size={20} color="#6200EE" />
                                <Text style={styles.infoText}>Last name: {userData.lastName}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="email" size={20} color="#6200EE" />
                                <Text style={styles.infoText}>Email: {userData.email}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="badge" size={20} color="#6200EE" />
                                <Text style={styles.infoText}>Aadhar: {userData.aadhar}</Text>
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        {/* Bank Details Section */}
                        <View style={styles.infoContainer}>
                            <View style={styles.infoRow}>
                                <Icon name="account-balance" size={20} color="#6200EE" />
                                <Text style={styles.infoText}>Account Holder: {userData.accountHolder} </Text>
                                <TouchableOpacity onPress={() => { /* Handle Edit for Account Holder */ }}>
                                    <Icon name="edit" size={20} color="#6200EE" style={styles.editIcon} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="credit-card" size={20} color="#6200EE" />
                                <Text style={styles.infoText}>Account No: {userData.accountNumber}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="vpn-key" size={20} color="#6200EE" />
                                <Text style={styles.infoText}>IFSC: {userData.ifsc}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="location-city" size={20} color="#6200EE" />
                                <Text style={styles.infoText}>Branch: {userData.branch}</Text>
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        {/* Mobile Number Section */}
                        <View style={styles.infoContainer}>
                            <View style={styles.infoRow}>
                                <Icon name="phone" size={20} color="#6200EE" />
                                <Text style={styles.infoText}>Mobile: {userData.mobile}</Text>
                                <TouchableOpacity onPress={() => { /* Handle Edit for Mobile */ }}>
                                    <Icon name="edit" size={20} color="#6200EE" style={styles.editIcon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Card>
                </ScrollView>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 90,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: StatusBar.currentHeight,
        zIndex: 1,
    },
    backButton: {
        position: "absolute",
        left: 20,
        top: StatusBar.currentHeight ? StatusBar.currentHeight + 6 : 20,
        zIndex: 2,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
    },
    scrollContent: {
        padding: 20,
        marginTop: 110,
    },
    card: {
        padding: 15,
        borderRadius: 10,
        elevation: 2,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    infoContainer: {
        marginTop: 10,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        justifyContent: "space-between", // Align the edit icon to the right
    },
    infoText: {
        fontSize: 16,
        marginLeft: 10,
        color: "#333",
        flex: 1, // Allow text to take up space and push the icon to the right
    },
    divider: {
        marginVertical: 15,
        height: 1,
    },
    editIcon: {
        marginLeft: 10, // Add space between the text and the icon
    },
});


export default WorkerPersonalDetailsScreen;
