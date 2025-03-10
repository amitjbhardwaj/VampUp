import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WorkerPrivacyScreen = () => {
        

    return (
        <View style={styles.screen}><Text>Worker Privacy Screen</Text></View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
});

export default WorkerPrivacyScreen;
