import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { RootStackParamList } from "../../RootNavigator";

// Make sure to access the project from route.params
type WorkUpdateStatusScreenRouteProp = RouteProp<RootStackParamList, 'WorkUpdateStatus'>;

const WorkUpdateStatusScreen = () => {
    const route = useRoute<WorkUpdateStatusScreenRouteProp>();
    const navigation = useNavigation();

    const { project } = route.params;  // Now accessing the project

    return (
        <View style={styles.container}>
            {/* Main content area */}
            <View style={styles.content}>
                <Text style={styles.title}>Update Status</Text>
                <Text>Project ID: {project.project_Id}</Text>
                <Text>Description: {project.project_description}</Text>
                <Text>Assigned To: {project.assigned_to}</Text>
                <Text>Start Date: {project.project_start_date}</Text>
                <Text>End Date: {project.project_end_date}</Text>
                <Text>Completion: {project.completion_percentage}%</Text>
                <Text>Contractor Phone: {project.contractor_phone}</Text>

                {/* You can add a form here to update the status */}
            </View>

            {/* Back Button placed at the extreme bottom */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                >
                    <Icon name="refresh" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
            </View>
            {/* Back Button placed at the extreme bottom */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: "#fff",
        marginTop: 40
    },
    content: {
        flex: 1,  // This ensures the content takes the remaining space
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    bottomContainer: {
        justifyContent: 'flex-end',  // Aligns the Back Button at the extreme bottom
        paddingBottom: 25,  // Adds some padding from the bottom
    },
    backButton: {
        backgroundColor: '#000', // Amber color for visibility
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: -30,
        marginBottom: 30,
        marginLeft: 20,
        marginRight: 20
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 10,
    },
});

export default WorkUpdateStatusScreen;