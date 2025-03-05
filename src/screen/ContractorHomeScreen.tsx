import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import Home from "../tabs/Home";
import HelpContact from "../tabs/HelpContact";
import Settings from "../tabs/Settings";

const Tab = createBottomTabNavigator();

const ContractorHomeScreen = ({ route }: any) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>Welcome Worker {route.params.username}</Text>
            <Tab.Navigator>
                <Tab.Screen name="Home" component={Home} options={{ tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} /> }} />
                <Tab.Screen name="Help & Contact" component={HelpContact} options={{ tabBarIcon: ({ color, size }) => <Icon name="info-circle" color={color} size={size} /> }} />
                <Tab.Screen name="Settings" component={Settings} options={{ tabBarIcon: ({ color, size }) => <Icon name="cog" color={color} size={size} /> }} />
            </Tab.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    header: { flex: 1 },
    headerText: { textAlign: "center", fontSize: 20, padding: 10, backgroundColor: "#fff" },
});

export default ContractorHomeScreen;
