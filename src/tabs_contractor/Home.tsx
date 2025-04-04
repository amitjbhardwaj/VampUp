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

type Project = {
    id: string;
    name: string;
    project_status: string;
};

const Home = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<HomeNavigationProp>();

    // States to hold project counts
    const [allProjectsCount, setAllProjectsCount] = useState<number | null>(null);
    const [activeProjectsCount, setActiveProjectsCount] = useState<number | null>(null);
    const [onHoldProjectsCount, setOnHoldProjectsCount] = useState<number | null>(null);
    const [completedProjectsCount, setCompletedProjectsCount] = useState<number | null>(null);
    const [contractorName, setContractorName] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [initiatePaymentProjectCount, setInitiatePaymentProjectCount] = useState<number | null>(null);


    // Fetch contractor name and project counts
    const fetchContractorNameAndProjectCounts = async () => {
        try {
            const storedName = await AsyncStorage.getItem("contractorName");

            if (storedName) {
                setContractorName(storedName);

                // Fetch all projects count
                const allProjectsResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-contractor?contractor_name=${storedName}`);
                const allProjectsData = await allProjectsResponse.json();
                setAllProjectsCount(allProjectsData.status === 'OK' ? allProjectsData.data.length : 0);

                // Fetch active projects count
                const activeProjectsResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-contractor?contractor_name=${storedName}&status=In-Progress`);
                const activeProjectsData = await activeProjectsResponse.json();
                setActiveProjectsCount(activeProjectsData.status === 'OK' ? activeProjectsData.data.length : 0);

                // Fetch on hold projects count
                const onHoldProjectsResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-contractor?contractor_name=${storedName}&status=On-Hold`);
                const onHoldProjectsData = await onHoldProjectsResponse.json();
                setOnHoldProjectsCount(onHoldProjectsData.status === 'OK' ? onHoldProjectsData.data.length : 0);

                // Fetch completed projects count
                const completedProjectsResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-contractor?contractor_name=${storedName}&status=Completed`);
                const completedProjectsData = await completedProjectsResponse.json();
                setCompletedProjectsCount(completedProjectsData.status === 'OK' ? completedProjectsData.data.length : 0);

                // Fetch Initiate Payment count (if needed)
                const initiatePaymentResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-contractor?contractor_name=${storedName}&status=Completed`);
                const initiatePaymentData = await initiatePaymentResponse.json();
                if (initiatePaymentData.status === 'OK') {
                    const initiateProjects = (initiatePaymentData.data as Project[]).filter(
                        (project) => project.project_status === "Approved"
                    );
                    setInitiatePaymentProjectCount(initiateProjects.length);
                } else {
                    setInitiatePaymentProjectCount(0);
                }

            } else {
                setAllProjectsCount(0);
                setActiveProjectsCount(0);
                setOnHoldProjectsCount(0);
                setCompletedProjectsCount(0);
                setInitiatePaymentProjectCount(0);
            }
        } catch (error) {
            console.error("Error fetching project counts:", error);
            setAllProjectsCount(0);
            setActiveProjectsCount(0);
            setOnHoldProjectsCount(0);
            setCompletedProjectsCount(0);
            setInitiatePaymentProjectCount(0);
        }
    };

    useEffect(() => {
        fetchContractorNameAndProjectCounts();
    }, []);

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

                {/* Second Row: "On-board Workers" and "On Hold Projects" */}
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

                {/* Third Row: "Completed Projects" and "Initiate Payment" */}
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('ContractorCompletedProjectsScreen')}>
                            <Ionicons name="checkmark-circle" size={50} color={theme.text} />
                            {completedProjectsCount !== null && completedProjectsCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationText}>{completedProjectsCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>Completed Projects</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('ContractorInitiatePaymentScreen')}>
                            <Ionicons name="card" size={50} color={theme.text} />
                            {initiatePaymentProjectCount !== null && initiatePaymentProjectCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationText}>{initiatePaymentProjectCount}</Text>
                                </View>
                            )}
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
