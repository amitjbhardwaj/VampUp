import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from "../RootNavigator";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type HomeNavigationProp = NavigationProp<RootStackParamList>;

type Project = {
    id: string;
    name: string;
    project_status: string;
};

const Home = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<HomeNavigationProp>();

    const [allProjectsCount, setAllProjectsCount] = useState<number | null>(null);
    const [activeProjectsCount, setActiveProjectsCount] = useState<number | null>(null);
    const [onHoldProjectsCount, setOnHoldProjectsCount] = useState<number | null>(null);
    const [completedProjectsCount, setCompletedProjectsCount] = useState<number | null>(null);
    const [contractorName, setContractorName] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [initiatePaymentProjectCount, setInitiatePaymentProjectCount] = useState<number | null>(null);

    const fetchContractorNameAndProjectCounts = async () => {
        try {
            const contractorName = await AsyncStorage.getItem("contractorName");

            if (contractorName) {
                setContractorName(contractorName);

                const fetchCount = async (status?: string) => {
                    const url = `http://192.168.129.119:5001/get-projects-by-contractor?contractor_name=${contractorName}${status ? `&status=${status}` : ""}`;
                    const response = await fetch(url);
                    const data = await response.json();
                    return data.status === "OK" ? data.data : [];
                };

                const allProjects = await fetchCount();
                setAllProjectsCount(allProjects.length);

                const activeProjects = await fetchCount("In-Progress");
                setActiveProjectsCount(activeProjects.length);

                const onHoldProjects = await fetchCount("On-Hold");
                setOnHoldProjectsCount(onHoldProjects.length);

                const completedProjects = await fetchCount("Completed");
                setCompletedProjectsCount(completedProjects.length);

                const approvedProjects = (completedProjects as Project[]).filter(
                    (p) => p.project_status === "Approved"
                );
                setInitiatePaymentProjectCount(approvedProjects.length);
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
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await fetchContractorNameAndProjectCounts();
        } catch (error) {
            console.error("Refresh failed", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                }
            >
                {contractorName ? (
                    <Text style={[styles.welcomeText, { color: theme.text }]}>
                        Welcome!! {contractorName}
                    </Text>
                ) : null}

                {/* Now put your UI content here */}
                <View style={styles.iconContainer}>
                    {/* Row 1 */}
                    <View style={styles.iconRow}>
                        <View style={styles.iconItem}>
                            <TouchableOpacity onPress={() => navigation.navigate("ContractorAllWorkScreen")}>
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
                            <TouchableOpacity onPress={() => navigation.navigate("ContractorActiveWorkScreen")}>
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

                    {/* Row 2 */}
                    <View style={styles.iconRow}>
                        <View style={styles.iconItem}>
                            <TouchableOpacity onPress={() => navigation.navigate("ContractorOnBoardWorkersScreen")}>
                                <Ionicons name="people" size={50} color={theme.text} />
                            </TouchableOpacity>
                            <Text style={{ color: theme.text }}>On-board Workers</Text>
                        </View>
                        <View style={styles.iconItem}>
                            <TouchableOpacity onPress={() => navigation.navigate("ContractorOnHoldProjectsScreen")}>
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

                    {/* Row 3 */}
                    <View style={styles.iconRow}>
                        <View style={styles.iconItem}>
                            <TouchableOpacity onPress={() => navigation.navigate("ContractorCompletedProjectsScreen")}>
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
                            <TouchableOpacity onPress={() => navigation.navigate("ContractorInitiatePaymentScreen")}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 20,
    },
    iconContainer: {
        alignItems: "center",
        marginBottom: 20,
        width: "100%",
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
    welcomeText: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 40,
        marginBottom: 50,
        textAlign: "center",
    },
});

export default Home;
