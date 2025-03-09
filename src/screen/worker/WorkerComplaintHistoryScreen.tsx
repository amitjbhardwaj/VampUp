import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { RootStackParamList } from "../../RootNavigator"; // Adjust the path if needed

type WorkerComplaintHistoryScreenNavigationProp = NavigationProp<RootStackParamList, 'WorkerComplaintHistoryScreen'>;


const WorkerComplaintHistoryScreen = () => {
    const navigation = useNavigation<WorkerComplaintHistoryScreenNavigationProp>();
    const [submittedRequests, setSubmittedRequests] = useState<any[]>([]);


    useEffect(() => {
        const loadSubmittedRequests = async () => {
            try {
                const storedRequests = await AsyncStorage.getItem("submittedRequests");
                if (storedRequests) {
                    setSubmittedRequests(JSON.parse(storedRequests));
                }
            } catch (error) {
                console.error("Error loading submitted requests", error);
            }
        };

        loadSubmittedRequests();
    }, []);

    const requestDetails = (request: any) => [
        { label: 'Project ID', value: request.projectId, icon: 'id-badge' },
        { label: 'Subject', value: request.subject, icon: 'info-circle' },
        { label: 'Description', value: request.description, icon: 'file-text' }
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Submitted Complaints</Text>

            <FlatList
                data={submittedRequests}
                keyExtractor={(item, index) => item.projectId + index.toString()}
                renderItem={renderRequestCard}
                ListEmptyComponent={<Text style={styles.emptyText}>No complaints submitted yet.</Text>}
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
});

export default WorkerComplaintHistoryScreen;