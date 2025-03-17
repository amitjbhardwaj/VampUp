import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Card, Divider } from "react-native-paper";
import { RootStackParamList } from "../../RootNavigator";
import { useTheme } from "../../context/ThemeContext";

type WorkerPersonalDetailsRouteProp = RouteProp<RootStackParamList, "WorkerPersonalDetailsScreen">;

const WorkerPersonalDetailsScreen = ({ route }: { route: WorkerPersonalDetailsRouteProp }) => {
    const { theme } = useTheme(); // Get the current theme (light or dark)
    const navigation = useNavigation();
    const [userData, setUserData] = useState<Record<string, string> | null>(null);
    const [loading, setLoading] = useState(true);

    const isDarkMode = theme.mode === 'dark';

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
            <View style={[styles.loadingContainer, { backgroundColor: theme.mode === 'dark' ? '#121212' : '#F5F5F5' }]}>
                <ActivityIndicator size="large" color={theme.mode === 'dark' ? '#fff' : '#000'} />
            </View>
        );
    }

    if (!userData) {
        return (
            <View style={[styles.container, { backgroundColor: theme.mode === 'dark' ? '#121212' : '#F5F5F5' }]}>
                <Text style={[styles.errorText, { color: theme.mode === 'dark' ? '#fff' : 'red' }]}>No user data found.</Text>
            </View>
        );
    }



    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#F5F5F5' }]}>
                <StatusBar
                    backgroundColor={isDarkMode ? '#121212' : '#fff'}
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                />

                {/* Header */}
                <View style={[styles.header, { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }]}>
                    <Text style={[styles.headerText, { color: isDarkMode ? '#fff' : '#000' }]}>Personal Details</Text>
                </View>

                {/* Scrollable Content */}
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Card style={[styles.card, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
                        <Card.Title
                            title={`Welcome, ${userData.firstName} ${userData.lastName}!`}
                            titleStyle={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]} // Adjust the color based on the theme
                            left={(props) => <Icon {...props} name="person" size={40} color={isDarkMode ? '#fff' : '#000'} />}
                        />

                        <Divider style={[styles.divider, { backgroundColor: isDarkMode ? '#444' : '#e0e0e0' }]} />

                        {/* Personal Details Section */}
                        <View style={styles.infoContainer}>
                            <View style={styles.infoRow}>
                                <Icon name="work" size={20} color={isDarkMode ? '#fff' : '#000'} />
                                <Text style={[styles.infoText, { color: isDarkMode ? '#fff' : '#333' }]}>Role: {userData.role}</Text>
                                <TouchableOpacity onPress={() => { /* Handle Edit for Role */ }}>
                                    <Icon name="edit" size={20} color={isDarkMode ? '#fff' : '#000'} style={styles.editIcon} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.infoRow}>
                                <Icon name="person" size={20} color={isDarkMode ? '#fff' : '#000'} />
                                <Text style={[styles.infoText, { color: isDarkMode ? '#fff' : '#333' }]}>First name: {userData.firstName} </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="person" size={20} color={isDarkMode ? '#fff' : '#000'} />
                                <Text style={[styles.infoText, { color: isDarkMode ? '#fff' : '#333' }]}>Last name: {userData.lastName}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="email" size={20} color={isDarkMode ? '#fff' : '#000'} />
                                <Text style={[styles.infoText, { color: isDarkMode ? '#fff' : '#333' }]}>Email: {userData.email}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="badge" size={20} color={isDarkMode ? '#fff' : '#000'} />
                                <Text style={[styles.infoText, { color: isDarkMode ? '#fff' : '#333' }]}>Aadhar: {userData.aadhar}</Text>
                            </View>
                        </View>

                        <Divider style={[styles.divider, { backgroundColor: isDarkMode ? '#444' : '#e0e0e0' }]} />

                        {/* Bank Details Section */}
                        <View style={styles.infoContainer}>
                            <View style={styles.infoRow}>
                                <Icon name="account-balance" size={20} color={isDarkMode ? '#fff' : '#000'} />
                                <Text style={[styles.infoText, { color: isDarkMode ? '#fff' : '#333' }]}>Account Holder: {userData.accountHolder} </Text>
                                <TouchableOpacity onPress={() => { /* Handle Edit for Account Holder */ }}>
                                    <Icon name="edit" size={20} color={isDarkMode ? '#fff' : '#000'} style={styles.editIcon} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="credit-card" size={20} color={isDarkMode ? '#fff' : '#000'} />
                                <Text style={[styles.infoText, { color: isDarkMode ? '#fff' : '#333' }]}>Account No: {userData.accountNumber}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="vpn-key" size={20} color={isDarkMode ? '#fff' : '#000'} />
                                <Text style={[styles.infoText, { color: isDarkMode ? '#fff' : '#333' }]}>IFSC: {userData.ifsc}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="location-city" size={20} color={isDarkMode ? '#fff' : '#000'} />
                                <Text style={[styles.infoText, { color: isDarkMode ? '#fff' : '#333' }]}>Branch: {userData.branch}</Text>
                            </View>
                        </View>

                        <Divider style={[styles.divider, { backgroundColor: isDarkMode ? '#444' : '#e0e0e0' }]} />

                        {/* Mobile Number Section */}
                        <View style={styles.infoContainer}>
                            <View style={styles.infoRow}>
                                <Icon name="phone" size={20} color={isDarkMode ? '#fff' : '#000'} />
                                <Text style={[styles.infoText, { color: isDarkMode ? '#fff' : '#333' }]}>Mobile: {userData.mobile}</Text>
                                <TouchableOpacity onPress={() => { /* Handle Edit for Mobile */ }}>
                                    <Icon name="edit" size={20} color={isDarkMode ? '#fff' : '#000'} style={styles.editIcon} />
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
