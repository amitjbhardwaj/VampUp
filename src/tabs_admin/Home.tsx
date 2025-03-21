import React from "react";
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

    return (
        <View style={[styles.screen, { backgroundColor: theme.background }]}>
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
                        <TouchableOpacity onPress={() => navigation.navigate('WorkerActiveWorkScreen')}>
                            <Ionicons name="construct" size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>Ongoing Projects</Text>
                    </View>
                </View>

                {/* Second Row */}
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('WorkerActiveWorkScreen')}>
                            <Ionicons name="clipboard" size={50} color={theme.text} />
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
                        <TouchableOpacity onPress={() => navigation.navigate('WorkerActiveWorkScreen')}>
                            <Ionicons name="pause-circle" size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>On-Hold Projects</Text>
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
});

export default Home;
