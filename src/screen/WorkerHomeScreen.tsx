import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import Home from "../tabs/Home";
import HelpContact from "../tabs/HelpContact";
import Settings from "../tabs/Settings";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const WorkerHomeScreen = () => {
    const navigation = useNavigation();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                tabBarStyle: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    height: 60,
                    paddingBottom: 10,
                },
                tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' }, // Bold tab labels
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Help & Contact"
                component={HelpContact}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="phone" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="cog" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default WorkerHomeScreen;
