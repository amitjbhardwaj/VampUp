import React, { useEffect, useState } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity,
    ScrollView,
    RefreshControl
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../RootNavigator";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import {
    PlusCircle,
    Hammer, // for "construct"
    Clipboard,
    Wallet,
    MessageSquare,
    FileText,
    Users,
    PauseCircle,
    CheckCircle,
    XCircle,
} from "lucide-react-native";

type HomeNavigationProp = NavigationProp<RootStackParamList>;

type Project = {
    id: string;
    name: string;
    project_status: string;
    first_level_payment_status: string;
};


const Home = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<HomeNavigationProp>();

    const [activeProjectsCount, setActiveProjectsCount] = useState<number | null>(null);
    const [onHoldProjectsCount, setOnHoldProjectsCount] = useState<number | null>(null);
    const [completedProjectsCount, setCompletedProjectsCount] = useState<number | null>(null);
    const [approvedProjectsCount, setApprovedProjectsCount] = useState<number | null>(null); // Count for approved projects
    const [rejectedProjectsCount, setRejectedProjectsCount] = useState<number | null>(null);
    const [initiatePaymentProjectCount, setInitiatePaymentProjectCount] = useState<number | null>(null);
    const [adminName, setAdminName] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false); // State for pull-to-refresh

    // Fetch contractor name and project counts based on "assign_to"
    const fetchAdminNameAndProjectCounts = async () => {
        try {
            // Get contractor name from AsyncStorage
            const adminName = await AsyncStorage.getItem("adminName");

            if (adminName) {
                setAdminName(adminName); // Store the contractor name

                // Fetch Active Projects count
                const activeProjectsResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-admin?created_by=${adminName}&status=In-Progress`);
                const activeProjectsData = await activeProjectsResponse.json();
                if (activeProjectsData.status === 'OK') {
                    setActiveProjectsCount(activeProjectsData.data.length);
                } else {
                    setActiveProjectsCount(0);
                }

                // Fetch On Hold Projects count
                const onHoldProjectsResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-admin?created_by=${adminName}&status=On-Hold`);
                const onHoldProjectsData = await onHoldProjectsResponse.json();
                if (onHoldProjectsData.status === 'OK') {
                    setOnHoldProjectsCount(onHoldProjectsData.data.length);
                } else {
                    setOnHoldProjectsCount(0);
                }

                // Fetch Completed Projects count
                const completedProjectsResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-admin?second_level_approver=${adminName}`);
                const completedProjectsData = await completedProjectsResponse.json();
                if (completedProjectsData.status === "OK") {
                    // Filter out projects that have status 'Approved' or 'Rejected'
                    const filteredProjects = completedProjectsData.data.filter((project: Project) =>
                        project.project_status !== 'Approved' && project.project_status !== 'Rejected'
                    );
                    setCompletedProjectsCount(filteredProjects.length);
                } else {
                    setCompletedProjectsCount(0);
                }

                // Fetch Approved Projects count
                const approvedProjectsResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-admin?created_by=${adminName}&status=Completed`);
                const approvedProjectsData = await approvedProjectsResponse.json();
                if (approvedProjectsData.status === 'OK') {
                    const approvedProjects = (approvedProjectsData.data as Project[]).filter(
                        (project) => project.project_status === "Approved"
                    );
                    setApprovedProjectsCount(approvedProjects.length);
                } else {
                    setApprovedProjectsCount(0);
                }

                // Fetch Rejected Projects count (if needed)
                const rejectedProjectsResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-admin?created_by=${adminName}&status=Completed`);
                const rejectedProjectsData = await rejectedProjectsResponse.json();
                if (rejectedProjectsData.status === 'OK') {
                    const rejectedProjects = (rejectedProjectsData.data as Project[]).filter(
                        (project) => project.project_status === "Rejected"
                    );
                    setRejectedProjectsCount(rejectedProjects.length);
                } else {
                    setRejectedProjectsCount(0);
                }

                // Fetch Initiate Payment count (if needed)
                const initiatePaymentResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-admin?created_by=${adminName}&status=Completed`);
                const initiatePaymentData = await initiatePaymentResponse.json();
                if (initiatePaymentData.status === 'OK') {
                    const initiateProjects = (initiatePaymentData.data as Project[]).filter(
                        (project) =>
                            project.project_status === "Approved" &&
                            project.first_level_payment_status !== "Approved"
                    );
                    setInitiatePaymentProjectCount(initiateProjects.length);
                } else {
                    setInitiatePaymentProjectCount(0);
                }
            } else {
                setActiveProjectsCount(0);
                setOnHoldProjectsCount(0);
                setCompletedProjectsCount(0);
                setApprovedProjectsCount(0);
                setRejectedProjectsCount(0);
                setInitiatePaymentProjectCount(0);
            }
        } catch (error) {
            console.error("Error fetching contractor name or project counts:", error);
            setActiveProjectsCount(0);
            setOnHoldProjectsCount(0);
            setCompletedProjectsCount(0);
            setApprovedProjectsCount(0);
            setRejectedProjectsCount(0);
            setInitiatePaymentProjectCount(0);
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
            style={{ flex: 1 }}
            contentContainerStyle={{
                flexGrow: 1,
                paddingVertical: 20,
                backgroundColor: theme.background,
            }}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
        >
            {adminName ? (
                <LinearGradient
                    colors={['transparent', '#5f2c82', '#49a09d', '#5f2c82', 'transparent']}
                    style={styles.welcomeGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.welcomeText}>
                        Welcome!! {adminName}
                    </Text>
                </LinearGradient>


            ) : null}

            <View style={styles.iconContainer}>
                {/* First Row */}
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminAddNewProjectScreen')}>
                            <PlusCircle size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text, fontSize: 15 }}>New Project</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminOngoingProjectsScreen')}>
                            <Hammer size={50} color={theme.text} />
                            {activeProjectsCount !== null && activeProjectsCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationText}>{activeProjectsCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: theme.text, fontSize: 15 }}>Ongoing Projects</Text>
                    </View>
                </View>

                {/* Second Row */}
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminReviewProjectsScreen')}>
                            <Clipboard size={50} color={theme.text} />
                            {completedProjectsCount !== null && completedProjectsCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationText}>{completedProjectsCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: theme.text, fontSize: 15 }}>Review Project</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminInitiatePaymentScreen')}>
                            <Wallet size={50} color={theme.text} />
                            {initiatePaymentProjectCount !== null && initiatePaymentProjectCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationText}>{initiatePaymentProjectCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: theme.text, fontSize: 15 }}>Initiate Payment</Text>
                    </View>
                </View>

                {/* Third Row */}
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminReviewRequestsScreen')}>
                            <MessageSquare size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text, fontSize: 15 }}>Review Requests</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminDocumentsScreen')}>
                            <FileText size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text, fontSize: 15 }}>Documents</Text>
                    </View>
                </View>

                {/* Fourth Row - Allocate Project & On-Hold Projects */}
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminAllocateProjectScreen')}>
                            <Users size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text, fontSize: 15 }}>Allocate Project</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminOnHoldProjectsScreen')}>
                            <PauseCircle size={50} color={theme.text} />
                            {onHoldProjectsCount !== null && onHoldProjectsCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationText}>{onHoldProjectsCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: theme.text, fontSize: 15 }}>On-Hold Projects</Text>
                    </View>
                </View>
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminApprovedProjectsScreen')}>
                            <CheckCircle size={50} color={theme.text} />
                            {approvedProjectsCount !== null && approvedProjectsCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationText}>{approvedProjectsCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: theme.text, fontSize: 15 }}>Approved Projects</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminRejectedProjectsScreen')}>
                            <XCircle size={50} color={theme.text} />
                            {rejectedProjectsCount !== null && rejectedProjectsCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationText}>{rejectedProjectsCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: theme.text, fontSize: 15 }}>Rejected Projects</Text>
                    </View>
                </View>
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminAllocateFundsScreen')}>
                            <Text style={{ fontSize: 50, color: theme.text, fontWeight: 'bold' }}>₹</Text>
                        </TouchableOpacity>
                        <Text style={{ color: theme.text, fontSize: 15 }}>Allocate Funds</Text>
                    </View>

                    {/* Placeholder to balance the row */}
                    <View style={styles.iconItem} />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,

    },
    iconContainer: {
        alignItems: "center",
        marginBottom: 20,
        paddingBottom: 100, // Give room to scroll
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
    lastRowIcon: {
        marginLeft: "-145%",
    },
    welcomeGradient: {
        marginTop: 50,
        marginBottom: 50,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignSelf: 'center',
        backgroundColor: 'transparent',
        // No hard background shape
    },

    welcomeText: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },

    gradientWelcome: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        marginTop: 40,
        marginBottom: 50,
        alignSelf: 'center',
        elevation: 3,
    },

});

export default Home;
