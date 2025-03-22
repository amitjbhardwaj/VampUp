import React, { useState, useEffect } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from "../RootNavigator";
import { useTheme } from "../context/ThemeContext";

type HomeNavigationProp = NavigationProp<RootStackParamList>;

const Home = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<HomeNavigationProp>();
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = () => {
        try {
            const data = require('../assets/projects.json');
            if (Array.isArray(data)) {
                const filteredProjects = data.filter(project => project.completion_percentage !== 100);
                setProjects(filteredProjects);
            } else {
                console.error("Projects data is not an array");
            }
        } catch (error) {
            console.error("Error loading project:", error);
        }
    };

    return (
        <View style={[styles.screen, { backgroundColor: theme.background }]}> 
            <View style={styles.iconContainer}>
                
                {/* First Row: "All Projects" and "Active Projects" */}
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('ContractorAllWorkScreen')}>
                            <Ionicons name="list-circle" size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>All Projects</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('ContractorActiveWorkScreen')}>
                            <Ionicons name="briefcase" size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>Active Projects</Text>
                    </View>
                </View>

                {/* Second Row: "Upcoming Projects" and "On Hold Projects" */}
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('ContractorUpcomingProjectsScreen')}>
                            <Ionicons name="calendar" size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>Upcoming Projects</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('ContractorOnHoldProjectsScreen')}>
                            <Ionicons name="pause-circle" size={50} color={theme.text} />
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
        </View>
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
    lastRowIcon: {
        marginLeft: "-145%",
    },
});

export default Home;
