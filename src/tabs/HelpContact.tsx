import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const HelpContact = () => {

    return (
        <View style={styles.screen}><Text>Help & Contact</Text></View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default HelpContact;
