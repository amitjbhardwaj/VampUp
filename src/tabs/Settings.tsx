import { useNavigation } from "@react-navigation/native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const settingsOptions = [
    { name: "Personal details", icon: "person", screen: "PersonalDetails" },
    { name: "Payments", icon: "sync-alt", screen: "Payments" },
    { name: "Privacy", icon: "shield", screen: "Privacy" },
    { name: "Security", icon: "lock", screen: "Security" },
    { name: "Notifications", icon: "notifications", screen: "Notifications" },
    { name: "About this app", icon: "info", screen: "AboutApp" },
];

const Settings = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {settingsOptions.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.option}
                    onPress={() => navigation.navigate({ name: 'WorkerActiveWorkScreen' } as never)}
                >
                    <Icon name={option.icon} size={24} color="#000" />
                    <Text style={styles.optionText}>{option.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
        padding: 20,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 15,
        marginVertical: 5,
        borderRadius: 8,
        elevation: 2,
    },
    optionText: {
        fontSize: 16,
        marginLeft: 10,
    },
});

export default Settings;
