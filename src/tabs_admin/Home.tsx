import React, { useEffect, useState } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity,
    ScrollView,
    RefreshControl
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from "../RootNavigator";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type HomeNavigationProp = NavigationProp<RootStackParamList>;

const Home = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<HomeNavigationProp>();

    const [activeProjectsCount, setActiveProjectsCount] = useState<number | null>(null);
    const [onHoldProjectsCount, setOnHoldProjectsCount] = useState<number | null>(null);
    const [completedProjectsCount, setCompletedProjectsCount] = useState<number | null>(null);
    const [approvedProjectsCount, setApprovedProjectsCount] = useState<number | null>(null);
    const [rejectedProjectsCount, setRejectedProjectsCount] = useState<number | null>(null);
    const [adminName, setAdminName] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false); // State for pull-to-refresh

    // Fetch contractor name and project counts based on "assign_to"
    const fetchAdminNameAndProjectCounts = async () => {
        try {
            // Get contractor name from AsyncStorage
            const storedName = await AsyncStorage.getItem("adminName");

            if (storedName) {
                setAdminName(storedName); // Store the contractor name

                // Fetch Active Projects count
                const activeProjectsResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-admin?created_by=${storedName}&status=In-Progress`);
                const activeProjectsData = await activeProjectsResponse.json();
                if (activeProjectsData.status === 'OK') {
                    setActiveProjectsCount(activeProjectsData.data.length);
                } else {
                    setActiveProjectsCount(0);
                }

                // Fetch On Hold Projects count
                const onHoldProjectsResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-admin?created_by=${storedName}&status=On-Hold`);
                const onHoldProjectsData = await onHoldProjectsResponse.json();
                if (onHoldProjectsData.status === 'OK') {
                    setOnHoldProjectsCount(onHoldProjectsData.data.length);
                } else {
                    setOnHoldProjectsCount(0);
                }

                // Fetch Completed Projects count
                const completedProjectsResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-admin?created_by=${storedName}&status=Completed`);
                const completedProjectsData = await completedProjectsResponse.json();
                if (completedProjectsData.status === 'OK') {
                    setCompletedProjectsCount(completedProjectsData.data.length);
                } else {
                    setCompletedProjectsCount(0);
                }

            } else {
                setActiveProjectsCount(0);
                setOnHoldProjectsCount(0);
            }
        } catch (error) {
            console.error("Error fetching contractor name or project counts:", error);
            setActiveProjectsCount(0);
            setOnHoldProjectsCount(0);
        }
    };

    // Fetch project counts and contractor name on mount
    useEffect(() => {
        fetchAdminNameAndProjectCounts();
    }, []); // Empty dependency array ensures this runs only when the component mounts

    // Function to handle pull-to-refresh
    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchAdminNameAndProjectCounts();
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

                {/* First Row */}
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminAddNewProjectScreen')}>
                            <Ionicons name="add-circle" size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>New Project</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminOngoingProjectsScreen')}>
                            <Ionicons name="construct" size={50} color={theme.text} />
                            {activeProjectsCount !== null && activeProjectsCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationText}>{activeProjectsCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>Ongoing Projects</Text>
                    </View>
                </View>

                {/* Second Row */}
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminReviewProjectsScreen')}>
                            <Ionicons name="clipboard" size={50} color={theme.text} />
                            {completedProjectsCount !== null && completedProjectsCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationText}>{completedProjectsCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>Review Project</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('WorkerActiveWorkScreen')}>
                            <Ionicons name="card" size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>Initiate Payment</Text>
                    </View>
                </View>

                {/* Third Row */}
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('WorkerActiveWorkScreen')}>
                            <Ionicons name="chatbox-ellipses" size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>Review Requests</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('WorkerActiveWorkScreen')}>
                            <Ionicons name="document-text" size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>Documents</Text>
                    </View>
                </View>

                {/* Fourth Row - Allocate Project & On-Hold Projects */}
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminAllocateProjectScreen')}>
                            <Ionicons name="people-circle" size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>Allocate Project</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminOnHoldProjectsScreen')}>
                            <Ionicons name="pause-circle" size={50} color={theme.text} />
                            {onHoldProjectsCount !== null && onHoldProjectsCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationText}>{onHoldProjectsCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>On-Hold Projects</Text>
                    </View>
                </View>
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminOnHoldProjectsScreen')}>
                            <Ionicons name="checkmark-circle" size={50} color={theme.text} />
                            {approvedProjectsCount !== null && approvedProjectsCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationText}>{approvedProjectsCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>Approved Projects</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminOnHoldProjectsScreen')}>
                            <Ionicons name="close-circle" size={50} color={theme.text} />
                            {rejectedProjectsCount !== null && rejectedProjectsCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationText}>{rejectedProjectsCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>Rejected Projects</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
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
