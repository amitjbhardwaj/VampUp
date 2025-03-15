import React, { useCallback } from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RouteProp } from '@react-navigation/native';
import Home from "../tabs/Home";
import Services from "../tabs/Services";
import HelpContact from "../tabs/HelpContact";
import Settings from "../tabs/Settings";

type TabParamList = {
  Home: undefined;
  "My Services": undefined;
  Help: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

type TabScreenProps = {
  route: RouteProp<TabParamList, keyof TabParamList>;
  focused: boolean;
  size: number;
};

const WorkerHomeScreen = () => {
  const renderIcon = useCallback(
    ({ route, focused, size }: TabScreenProps) => {
      let iconName = "home-outline"; 
      if (route.name === "My Services") {
        iconName = "briefcase-outline";
      } else if (route.name === "Help") {
        iconName = "call-outline";
      } else if (route.name === "Settings") {
        iconName = "settings-outline";
      }

      return (
        <Ionicons 
          name={iconName} 
          size={focused ? size + 5 : size} 
          color={focused ? "#0047AB" : "gray"}  
        />
      );
    },
    []
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: (props) => renderIcon({ route, ...props }),
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: focused ? "#0047AB" : "gray", fontSize: focused ? 14 : 12 }}>
            {route.name}
          </Text>
        ),
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        headerStyle: styles.header,
        headerTitleAlign: "center",
        animationEnabled: false, // Disable tab switching animation
        lazy: true, // Enable lazy loading of screens
        tabBarButton: (props) => (
          <Pressable {...props} android_ripple={{ color: "transparent" }}>
            {props.children}
          </Pressable>
        ),
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="My Services" component={Services} />
      <Tab.Screen name="Help" component={HelpContact} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.9)",  // Simpler background without blur
    borderRadius: 20,
    marginHorizontal: 10,
    bottom: 10,
    paddingBottom: 8,
    borderTopWidth: 0,
    elevation: 5,
    height: 65,
  },
  header: {
    backgroundColor: "rgba(255,255,255,0.8)",
  },
});

export default WorkerHomeScreen;
