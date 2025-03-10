import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { RootStackParamList } from "../../RootNavigator"; // Adjust the path if needed

type WorkerComplaintHistoryScreenNavigationProp = NavigationProp<RootStackParamList, 'WorkerComplaintHistoryScreen'>;

const WorkerComplaintHistoryScreen = () => {
    const [submittedRequests, setSubmittedRequests] = useState<any[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const navigation = useNavigation<WorkerComplaintHistoryScreenNavigationProp>();
    const route = useRoute<any>(); // Type route.params as `any` or specifically as `WorkerComplaintHistoryScreenParams`
    
    // Check if `updatedRequests` is passed via route params
    const { updatedRequests } = route.params || { updatedRequests: [] }; // Default to an empty array if not present

    useEffect(() => {
        const loadSubmittedRequests = async () => {
            try {
                const storedRequests = await AsyncStorage.getItem("submittedRequests");
                if (storedRequests) {
                    const requests = JSON.parse(storedRequests);
                    console.log("Stored requests:", requests); // Log data to inspect
                    setSubmittedRequests(requests);
                    setFilteredRequests(requests); // Initialize filteredRequests
                }
            } catch (error) {
                console.error("Error loading submitted requests", error);
            }
        };

        loadSubmittedRequests();
    }, []); // This effect runs only once when the component mounts

    // This effect runs once after `submittedRequests` has been loaded to ensure complaintId is consistent
    useEffect(() => {
        if (submittedRequests.length > 0) {
            const updateComplaintIdForRequests = async () => {
                const updatedRequests = await Promise.all(
                    submittedRequests.map(async (request) => {
                        const complaintId = await generateOrRetrieveComplaintId(request.complaintId);
                        return { ...request, complaintId };
                    })
                );
                // Update only if there's a change
                setSubmittedRequests((prevRequests) => {
                    if (JSON.stringify(prevRequests) !== JSON.stringify(updatedRequests)) {
                        return updatedRequests;
                    }
                    return prevRequests; // Prevent unnecessary re-renders
                });
                setFilteredRequests(updatedRequests);
            };

            updateComplaintIdForRequests();
        }
    }, [submittedRequests]); // This effect runs only when `submittedRequests` changes

    const generateOrRetrieveComplaintId = async (existingComplaintId?: string) => {
        if (existingComplaintId) {
            return existingComplaintId;
        }

        // Check if ComplaintId is already stored
        const storedComplaintId = await AsyncStorage.getItem("complaintId");
        if (storedComplaintId) {
            return storedComplaintId;
        }

        // If ComplaintId doesn't exist in AsyncStorage, generate a new one
        const uniqueComplaintId = `CMP-${Date.now()}`; // Prefix with "CMP-" or any other identifier
        await AsyncStorage.setItem("complaintId", uniqueComplaintId); // Save it to AsyncStorage for future retrieval
        return uniqueComplaintId;
    };

    const requestDetails = (request: any) => [
        { label: 'Complaint ID', value: request.complaintId || 'N/A', icon: 'id-badge' },
        { label: 'Project ID', value: request.projectId || 'N/A', icon: 'info-circle' },
        { label: 'Subject', value: request.subject || 'N/A', icon: 'info-circle' },
        { label: 'Description', value: request.description || 'N/A', icon: 'file-text' },
        { label: 'Project Description', value: request.projectDescription || 'N/A', icon: 'pencil' },
        { label: 'Long Project Description', value: request.longProjectDescription || 'N/A', icon: 'book' },
        { label: 'Start Date', value: request.projectStartDate || 'N/A', icon: 'calendar' },
    ];

    const renderRequestCard = ({ item: request }: { item: any }) => (
        <View style={styles.requestCard}>
            <FlatList
                data={requestDetails(request)}
                keyExtractor={(item) => item.label}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Icon name={item.icon} size={20} color="#d9534f" style={styles.icon} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>{item.label}</Text>
                            <Text style={styles.value}>{item.value}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );

    useEffect(() => {
        // Filter requests based on the search term
        if (searchTerm) {
            const filtered = submittedRequests.filter((request) => {
                return (
                    request.complaintId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    request.projectId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    request.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    request.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    request.projectDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    request.projectStartDate?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
            setFilteredRequests(filtered);
        } else {
            setFilteredRequests(submittedRequests);
        }
    }, [searchTerm, submittedRequests]); // This effect runs only when `searchTerm` or `submittedRequests` changes

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Submitted Complaints</Text>

            {/* Search bar */}
            <TextInput
                style={styles.searchBar}
                placeholder="Search Complaints..."
                value={searchTerm}
                onChangeText={setSearchTerm}
            />

            <FlatList
                data={updatedRequests.length > 0 ? updatedRequests : filteredRequests}  // Use `updatedRequests` if available, else fallback to filteredRequests
                keyExtractor={(item) => item.complaintId ? item.complaintId : item.project_Id + Math.random().toString()}  // Use `complaintId` for unique key
                renderItem={renderRequestCard}
                ListEmptyComponent={<Text style={styles.emptyText}>No complaints found.</Text>}
            />

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    emptyText: { fontSize: 16, color: "#777", textAlign: "center", marginTop: 20 },
    requestCard: {
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        elevation: 5,
    },
    card: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    icon: { marginRight: 15 },
    label: { fontWeight: 'bold', fontSize: 16 },
    value: { fontSize: 14, flexWrap: 'wrap', flex: 1 },
    backButton: {
        backgroundColor: '#000',
        padding: 13,
        marginTop: 20,
        alignItems: 'center',
        borderRadius: 10,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    searchBar: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 20,
    },
});

export default WorkerComplaintHistoryScreen;
