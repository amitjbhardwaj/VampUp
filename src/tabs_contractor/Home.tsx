import React, { useState, useEffect } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from "../RootNavigator";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

type HomeNavigationProp = NavigationProp<RootStackParamList>;

const Home = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<HomeNavigationProp>();

    // States to hold project counts, contractor name, and status
    const [allProjectsCount, setAllProjectsCount] = useState<number | null>(null);
    const [activeProjectsCount, setActiveProjectsCount] = useState<number | null>(null);
    const [onHoldProjectsCount, setOnHoldProjectsCount] = useState<number | null>(null);
    const [contractorName, setContractorName] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false); // State for pull-to-refresh

    // Fetch contractor name and project counts based on "assign_to"
    const fetchContractorNameAndProjectCounts = async () => {
        try {
            // Get contractor name from AsyncStorage
            const storedContractorName = await AsyncStorage.getItem("contractorName");

            if (storedContractorName) {
                setContractorName(storedContractorName); // Store the contractor name

                // Fetch All Projects count
                const allProjectsResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-assign-to-contractor?assign_to=${storedContractorName}`);
                const allProjectsData = await allProjectsResponse.json();
                if (allProjectsData.status === 'OK') {
                    setAllProjectsCount(allProjectsData.data.length);
                } else {
                    setAllProjectsCount(0);
                }

                // Fetch Active Projects count
                const activeProjectsResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-assign-to-contractor?assign_to=${storedContractorName}&status=In-Progress`);
                const activeProjectsData = await activeProjectsResponse.json();
                if (activeProjectsData.status === 'OK') {
                    setActiveProjectsCount(activeProjectsData.data.length);
                } else {
                    setActiveProjectsCount(0);
                }

                // Fetch On Hold Projects count
                const onHoldProjectsResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-assign-to-contractor?assign_to=${storedContractorName}&status=On-Hold`);
                const onHoldProjectsData = await onHoldProjectsResponse.json();
                if (onHoldProjectsData.status === 'OK') {
                    setOnHoldProjectsCount(onHoldProjectsData.data.length);
                } else {
                    setOnHoldProjectsCount(0);
                }

            } else {
                setAllProjectsCount(0);
                setActiveProjectsCount(0);
                setOnHoldProjectsCount(0);
            }
        } catch (error) {
            console.error("Error fetching contractor name or project counts:", error);
            setAllProjectsCount(0);
            setActiveProjectsCount(0);
            setOnHoldProjectsCount(0);
        }
    };

    // Fetch project counts and contractor name on mount
    useEffect(() => {
        fetchContractorNameAndProjectCounts();
    }, []); // Empty dependency array ensures this runs only when the component mounts

    // Function to handle pull-to-refresh
    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchContractorNameAndProjectCounts();
        setIsRefreshing(false);
    };

    return (
        <ScrollView
            contentContainerStyle={[styles.screen, { backgroundColor: theme.background }]}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.iconContainer}>
                
                {/* First Row: "All Projects" and "Active Projects" */}
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('ContractorAllWorkScreen')}>
                            <Ionicons name="list-circle" size={50} color={theme.text} />
                            {allProjectsCount !== null && allProjectsCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationText}>{allProjectsCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>All Projects</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('ContractorActiveWorkScreen')}>
                            <Ionicons name="briefcase" size={50} color={theme.text} />
                            {activeProjectsCount !== null && activeProjectsCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationText}>{activeProjectsCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>Active Projects</Text>
                    </View>
                </View>

                {/* Second Row: "Upcoming Projects" and "On Hold Projects" */}
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('ContractorOnBoardWorkersScreen')}>
                            <Ionicons name="people" size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>On-board Workers</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('ContractorOnHoldProjectsScreen')}>
                            <Ionicons name="pause-circle" size={50} color={theme.text} />
                            {onHoldProjectsCount !== null && onHoldProjectsCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationText}>{onHoldProjectsCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>On Hold Projects</Text>
                    </View>
                </View>

                {/* Last Row: "Initiate Payment" */}
                <View style={styles.iconRow}>
                    <View style={[styles.iconItem, styles.lastRowIcon]}>
                        <TouchableOpacity onPress={() => navigation.navigate('ContractorInitiatePaymentScreen')}>
                            <Ionicons name="card" size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>Initiate Payment</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    iconContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    iconRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 20,
    },
    iconItem: {
        alignItems: "center",
        width: "45%",
    },
    lastRowIcon: {
        marginLeft: "-145%",
    },
    notificationBadge: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "red",
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    notificationText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
});

export default Home;
