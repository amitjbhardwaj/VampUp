import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Services = () => {
        

    return (
        <View style={styles.screen}><Text>My Services Screen</Text></View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
});

export default Services;
