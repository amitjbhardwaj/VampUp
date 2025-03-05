// ReportIssueScreen.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../RootNavigator";

type ReportIssueNavigationProp = NavigationProp<RootStackParamList>;

const ReportIssueScreen = () => {
    const navigation = useNavigation<ReportIssueNavigationProp>();

    function alert(arg0: string): void {
        throw new Error("Function not implemented.");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Report an Issue</Text>
            <TextInput placeholder="Describe the issue..." style={styles.input} multiline />
            <TouchableOpacity style={styles.button} onPress={() => alert("Issue Reported")}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: 'rgb(224, 229, 224)',
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        backgroundColor: "rgb(224, 229, 224)",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        elevation: 5,
    },
    button: {
        backgroundColor: "rgb(37, 124, 37)",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    backText: {
        marginTop: 20,
        textAlign: "center",
        textDecorationLine: "underline",
    },
});

export default ReportIssueScreen;