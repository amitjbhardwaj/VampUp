import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Services = () => {
    

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Help & Contact Screen</Text>
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

export default Services;
