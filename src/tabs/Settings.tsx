import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Settings = () => {
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
            <Text style={styles.text}>Settings Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default Settings;
