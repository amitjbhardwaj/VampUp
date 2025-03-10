import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WorkerPersonalDetailsScreen = () => {
        

    return (
        <View style={styles.screen}><Text>Worker Personal Details</Text></View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
});

export default WorkerPersonalDetailsScreen;
