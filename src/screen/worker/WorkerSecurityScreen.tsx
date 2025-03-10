import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WorkerSecurityScreen = () => {
        

    return (
        <View style={styles.screen}><Text>Worker Security Screen</Text></View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
});

export default WorkerSecurityScreen;
