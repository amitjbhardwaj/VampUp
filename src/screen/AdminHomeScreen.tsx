import React, { useCallback } from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RouteProp } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Home from '../tabs_admin/Home';
import Services from '../tabs_admin/Services';
import HelpContact from '../tabs_admin/HelpContact';
import Settings from '../tabs_admin/Settings';

type TabParamList = {
  Home: undefined;
  "My Work": undefined;
  Help: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

type TabScreenProps = {
  route: RouteProp<TabParamList, keyof TabParamList>;
  focused: boolean;
  size: number;
};

const AdminHomeScreen = () => {
  const { theme } = useTheme();

  const renderIcon = useCallback(
    ({ route, focused, size }: TabScreenProps) => {
      let iconName = "home-outline"; 
      if (route.name === "My Work") {
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
          color={focused ? theme.primary : "gray"}  
        />
      );
    },
    [theme]
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: (props) => renderIcon({ route, ...props }),
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: focused ? theme.primary : "gray", fontSize: focused ? 14 : 12 }}>
            {route.name}
          </Text>
        ),
        tabBarShowLabel: true,
        tabBarStyle: {
          ...styles.tabBar,
          backgroundColor: theme.background,
        },
        headerStyle: {
          backgroundColor: theme.background,
          shadowColor: 'transparent',
        },
        headerTitleStyle: {
          color: theme.text,
        },
        headerTitleAlign: "center",
        animationEnabled: false, 
        lazy: true,
        tabBarButton: (props) => (
          <Pressable {...props} android_ripple={{ color: "transparent" }}>
            {props.children}
          </Pressable>
        ),
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="My Work" component={Services} />
      <Tab.Screen name="Help" component={HelpContact} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderRadius: 20,
    marginHorizontal: 10,
    bottom: 10,
    paddingBottom: 8,
    borderTopWidth: 0,
    elevation: 5,
    height: 65,
  },
});

export default AdminHomeScreen;
