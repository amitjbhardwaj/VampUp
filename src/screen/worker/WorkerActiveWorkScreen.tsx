import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";

// Define the project interface
interface Project {
    project_Id: string;
    project_description: string;
    assigned_to: string;
    project_start_date: string;
    project_end_date: string;
    completion_percentage: number;
}

// Helper function to determine project status
const getProjectStatus = (completionPercentage: number, endDate: string): string => {
    const currentDate = new Date();
    const end = new Date(endDate);

    // First, check if the project is overdue (i.e., current date > end date)
    if (currentDate > end) {
        return "red"; // If the project is overdue, it's at risk (red status)
    }

    // Then, determine the status based on completion percentage
    if (completionPercentage >= 95) return "green"; // Green if completed 95% or more
    if (completionPercentage >= 85) return "amber"; // Amber if completed between 85% and 94%
    return "red"; // Red if less than 85%
};

// Dummy data for the projects with mixed statuses
const projectData: Project[] = [
    {
        project_Id: "P001",
        project_description: "Mobile App Development",
        assigned_to: "John Doe",
        project_start_date: "2024-01-01",
        project_end_date: "2024-12-31",
        completion_percentage: 96, // Green
    },
    {
        project_Id: "P002",
        project_description: "Website Redesign",
        assigned_to: "Jane Smith",
        project_start_date: "2024-03-01",
        project_end_date: "2024-10-01",
        completion_percentage: 88, // Amber
    },
    {
        project_Id: "P003",
        project_description: "API Integration",
        assigned_to: "Alice Johnson",
        project_start_date: "2024-04-15",
        project_end_date: "2024-08-30",
        completion_percentage: 80, // Red
    },
    {
        project_Id: "P004",
        project_description: "Database Migration",
        assigned_to: "Bob Lee",
        project_start_date: "2024-02-01",
        project_end_date: "2024-09-15",
        completion_percentage: 90, // Amber
    },
    {
        project_Id: "P005",
        project_description: "Cloud Infrastructure Setup",
        assigned_to: "Eve Adams",
        project_start_date: "2024-06-01",
        project_end_date: "2024-12-01",
        completion_percentage: 97, // Green
    },
    {
        project_Id: "P006",
        project_description: "E-commerce Platform",
        assigned_to: "James Brown",
        project_start_date: "2024-01-15",
        project_end_date: "2024-07-15",
        completion_percentage: 75, // Red
    },
];

const WorkerActiveWorkScreen = () => {
    const navigation = useNavigation();
    const [projects, setProjects] = useState<Project[]>(projectData);

    // Set the back button in the header
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={30} color="#000" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    // Render each project row
    const renderItem = ({ item }: { item: Project }) => {
        const status = getProjectStatus(item.completion_percentage, item.project_end_date);
        return (
            <View style={[styles.tableRow, { backgroundColor: status === "green" ? "#d4edda" : status === "amber" ? "#fff3cd" : "#f8d7da" }]}>
                <Text style={styles.tableCell}>{item.project_Id}</Text>
                <Text style={styles.tableCell}>{item.project_description}</Text>
                <Text style={styles.tableCell}>{item.assigned_to}</Text>
                <Text style={styles.tableCell}>{item.project_start_date}</Text>
                <Text style={styles.tableCell}>{item.project_end_date}</Text>
                <Text style={[styles.tableCell, { color: status === "green" ? "green" : status === "amber" ? "orange" : "red" }]}>
                    {status === "green" ? "Completed" : status === "amber" ? "Almost Done" : "At Risk"}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Active Projects</Text>
            <FlatList
                data={projects}
                renderItem={renderItem}
                keyExtractor={(item) => item.project_Id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E0E5E0",
        padding: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    tableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    tableCell: {
        flex: 1,
        textAlign: "center",
        fontSize: 14,
        fontWeight: "600",
    },
});

export default WorkerActiveWorkScreen;
