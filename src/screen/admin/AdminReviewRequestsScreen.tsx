import { useTheme } from "../../context/ThemeContext";
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header from "../Header";

const AdminReviewRequestsScreen = () => {
    const { theme } = useTheme();

    return (

        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <Header title="Review Requests" />

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    backButton: {
        marginRight: 10,
        padding: 8,
    },
    screenTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default AdminReviewRequestsScreen;
