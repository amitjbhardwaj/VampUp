import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    Alert,
    SafeAreaView,
    Platform,
    StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../context/ThemeContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import Header from "../Header";

type Project = {
    _id: string;
    project_Id: string;
    project_description: string;
    long_project_description: string;
    created_by: string;
    project_start_date: string;
    project_end_date: string;
    contractor_phone: string;
    completion_percentage: number;
    status: string;
    contractor_name: string;
    worker_name: string;
};

const AdminAllocateFundsScreen = () => {
    const { theme } = useTheme();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeAllocation, setActiveAllocation] = useState<string | null>(null);
    const [allocationAmount, setAllocationAmount] = useState<string>("");
    const [allocatedFunds, setAllocatedFunds] = useState<{ [key: string]: string }>({});
    const [updatedFunds, setUpdatedFunds] = useState<{ [key: string]: string }>({});

    const fetchProjects = async () => {
        try {
            const storedName = await AsyncStorage.getItem("adminName");
            if (!storedName) return;

            // 1. Fetch projects
            const resProjects = await fetch(
                `http://192.168.129.119:5001/get-projects-by-admin?created_by=${storedName}`
            );
            const dataProjects = await resProjects.json();

            if (dataProjects.status === "OK") {
                const filteredProjects = dataProjects.data.filter((project: Project) => project.status !== "Completed");
                setProjects(filteredProjects);

                // 2. Fetch allocated funds
                const resFunds = await fetch(
                    `http://192.168.129.119:5001/get-allocated-funds-by-admin?created_by=${storedName}`
                );
                const dataFunds = await resFunds.json();

                if (dataFunds.status === "OK") {
                    const fundMap = dataFunds.data;

                    // Extract allocated and updated amounts
                    const initialAllocated: { [key: string]: string } = {};
                    const initialUpdated: { [key: string]: string } = {};

                    for (const projectId in fundMap) {
                        const fund = fundMap[projectId];
                        if (fund.amount_allocated !== undefined) {
                            initialAllocated[projectId] = fund.amount_allocated.toString();
                        }
                        if (fund.new_amount_allocated !== undefined) {
                            initialUpdated[projectId] = fund.new_amount_allocated.toString();
                        }
                    }

                    setAllocatedFunds(initialAllocated);
                    setUpdatedFunds(initialUpdated);
                }
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProjects();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "in-progress":
                return "#FFA500";
            case "on-hold":
                return "#FF5252";
            case "not-started":
                return "#9E9E9E";
            default:
                return theme.primary;
        }
    };

    const handleAllocateFunds = (projectId: string) => {
        setActiveAllocation((prev) => (prev === projectId ? null : projectId));
        setAllocationAmount("");
    };

    const handleSaveFunds = async (projectId: string) => {
        if (!allocationAmount) {
            Alert.alert("Please enter an amount.");
            return;
        }

        const data = {
            project_Id: projectId,
            amount_allocated: parseFloat(allocationAmount),
        };

        axios
            .post("http://192.168.129.119:5001/allocate-amount", data)
            .then((res) => {
                if (res.data.status === "OK") {
                    setAllocatedFunds((prev) => ({ ...prev, [projectId]: allocationAmount })); // Save the allocated amount
                    setActiveAllocation(null);

                    Alert.alert("Funds allocated successfully!");
                } else {
                    Alert.alert("Failed to allocate funds");
                }
            })
            .catch((e) => {
                console.error("Error allocating funds", e);
                Alert.alert("An error occurred while allocating funds.");
            });
    };

    const handleUpdateFunds = (projectId: string) => {
        setActiveAllocation(projectId); // Ensure you're working with the right project
        setAllocationAmount(updatedFunds[projectId] || ""); // Pre-fill the input with the current updated amount
    };


    const handleSaveUpdatedFunds = async (projectId: string) => {

        //console.log(`Updating ₹${allocationAmount} for project ID: ${projectId}`);
        if (!allocationAmount) {
            Alert.alert("Please enter an amount.");
            return;
        }

        try {
            const res = await axios.put(
                `http://192.168.129.119:5001/update-allocated-amount?project_Id=${projectId}`,
                {
                    new_amount_allocated: parseFloat(allocationAmount),
                }
            );

            if (res.status === 200) {
                Alert.alert("Amount updated successfully!");

                setUpdatedFunds((prev) => ({ ...prev, [projectId]: allocationAmount })); // Update the funds
                setActiveAllocation(null);

            } else {
                Alert.alert("Failed to update amount.");
            }
        } catch (error) {
            //console.error("Error updating funds", error.response || error.message);
            Alert.alert("An error occurred while updating the funds.");
        }
    };

    const handleCancel = () => {
        // Reset active allocation and clear the allocation amount
        setActiveAllocation(null);
        setAllocationAmount("");
    };

    const renderItem = ({ item }: { item: Project }) => (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.projectTitle, { color: theme.text }]}>
                    {item.project_Id} - {item.project_description}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <Text style={[styles.description, { color: theme.text }]}>
                {item.long_project_description}
            </Text>

            <View style={styles.infoRow}>
                <Icon name="calendar-start" size={18} color={theme.text} />
                <Text style={[styles.infoText, { color: theme.text }]}>
                    Start: {item.project_start_date}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Icon name="calendar-end" size={18} color={theme.text} />
                <Text style={[styles.infoText, { color: theme.text }]}>
                    End: {item.project_end_date}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Icon name="account-hard-hat" size={18} color={theme.text} />
                <Text style={[styles.infoText, { color: theme.text }]}>
                    Contractor: {item.contractor_name}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Icon name="account" size={18} color={theme.text} />
                <Text style={[styles.infoText, { color: theme.text }]}>
                    Worker: {item.worker_name}
                </Text>
            </View>

            <View style={styles.progressRow}>
                <Icon name="progress-check" size={18} color={theme.text} />
                <Text style={[styles.infoText, { color: theme.text }]}>
                    Completion: {item.completion_percentage}%
                </Text>
            </View>

            {allocatedFunds[item.project_Id] && (
                <View style={styles.allocatedFundsSection}>
                    <Text style={[styles.allocatedFundsLabel, { color: theme.text }]}>
                        Allocated Funds: ₹{allocatedFunds[item.project_Id]}
                    </Text>
                </View>
            )}

            {updatedFunds[item.project_Id] && (
                <View style={styles.allocatedFundsSection}>
                    <Text style={[styles.allocatedFundsLabel, { color: theme.text }]}>
                        Updated Funds: ₹{updatedFunds[item.project_Id]}
                    </Text>
                </View>
            )}

            {(activeAllocation === item.project_Id) && !allocatedFunds[item.project_Id] && (
                <View style={styles.allocationSection}>
                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.primary }]}
                        placeholder="Enter amount"
                        placeholderTextColor={theme.placeholderTextColor}
                        keyboardType="numeric"
                        value={allocationAmount}
                        onChangeText={setAllocationAmount}
                    />
                    <TouchableOpacity
                        style={[styles.button, styles.saveButton]}
                        onPress={() => handleSaveFunds(item.project_Id)}
                    >
                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={handleCancel} // Cancel the allocation action
                    >
                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}

            {(activeAllocation === item.project_Id) && allocatedFunds[item.project_Id] && (
                <View style={styles.allocationSection}>
                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.primary }]}
                        placeholder="Enter updated amount"
                        placeholderTextColor={theme.placeholderTextColor}
                        keyboardType="numeric"
                        value={allocationAmount}
                        onChangeText={setAllocationAmount}
                    />
                    <TouchableOpacity
                        style={[styles.button, styles.saveButton]}
                        onPress={() => handleSaveUpdatedFunds(item.project_Id)}
                    >
                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Save Updated Funds</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={handleCancel} // Cancel the update action
                    >
                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                style={[styles.button, { backgroundColor: allocatedFunds[item.project_Id] ? "#3498DB" : "#2ECC71" }]}
                onPress={() => allocatedFunds[item.project_Id] ? handleUpdateFunds(item.project_Id) : handleAllocateFunds(item.project_Id)}
            >
                <Text style={[styles.buttonText, { color: theme.buttonText }]}>
                    {allocatedFunds[item.project_Id] ? "Update Funds" : "Allocate Funds"}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <Header title="Allocate Project Funds" />
            <View style={[styles.container]}>
                {loading ? (
                    <ActivityIndicator size="large" color={theme.text} />
                ) : (
                    <FlatList
                        data={projects}
                        keyExtractor={(item) => item.project_Id}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },

    card: {
        padding: 16,
        marginBottom: 14,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    projectTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    description: {
        marginBottom: 8,
        fontSize: 14,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
        gap: 6,
    },
    progressRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        marginBottom: 12,
        gap: 6,
    },
    infoText: {
        fontSize: 13,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 12,
        color: "#fff",
        fontWeight: "600",
        textTransform: "capitalize",
    },
    button: {
        marginTop: 8,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        fontWeight: "600",
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 14,
        marginBottom: 8,
    },
    allocationSection: {
        marginTop: 8,
    },
    saveButton: {
        backgroundColor: "#007AFF",
    },
    cancelButton: {
        backgroundColor: "#FF4B5C", // Red color for the cancel button
        borderWidth: 1, // Optional border for emphasis
        borderColor: "#FF2A3D", // Darker red border
    },
    allocatedFundsSection: {
        marginTop: 8,
    },
    allocatedFundsLabel: {
        fontSize: 16,
        fontWeight: "600",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    backButton: {
        marginRight: 12,
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },

});

export default AdminAllocateFundsScreen;
