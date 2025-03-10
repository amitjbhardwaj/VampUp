import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AboutAppScreen = () => {
        

    return (
        <View style={styles.screen}><Text>About App Screen</Text></View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
});

export default AboutAppScreen;
