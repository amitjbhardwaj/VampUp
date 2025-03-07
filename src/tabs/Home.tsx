import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // or another icon set
import { useNavigation } from "@react-navigation/native";

const Home = () => {
    const navigation = useNavigation();

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

    return (
        <View style={styles.container}>
            {/* Active Work Icon */}
            <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => navigation.navigate({ name: "WorkerActiveWorkScreen" } as never)}
            >
                <Icon name="work" size={60} color="#000" />
                <Text style={styles.iconText}>Home Screen</Text>
            </TouchableOpacity>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(255, 255, 255)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 30,
    },
    iconContainer: {
        alignItems: "center",
        marginVertical: 20,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    iconText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
    },
});

export default Home;
