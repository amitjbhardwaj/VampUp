import React, { useCallback } from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RouteProp } from '@react-navigation/native';
import Home from "../tabs_worker/Home";
import Services from "../tabs_worker/Services";
import HelpContact from "../tabs_worker/HelpContact";
import Settings from "../tabs_worker/Settings";
import { useTheme } from '../context/ThemeContext';

type TabParamList = {
  Home: undefined;
  "My Work": undefined;
  Help: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator();

type TabScreenProps = {
  route: RouteProp<TabParamList, keyof TabParamList>;
  focused: boolean;
  size: number;
};

const WorkerHomeScreen = () => {
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
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="My Work" component={MyWorkStack} />
      <Tab.Screen name="Help" component={HelpStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};

// ✅ Each tab is now inside a Stack.Navigator to apply animations
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // ⬅️ Adds shifting effect
      headerShown: false, 
    }}
  >
    <Stack.Screen name="HomeScreen" component={Home} />
  </Stack.Navigator>
);

const MyWorkStack = () => (
  <Stack.Navigator
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerShown: false,
    }}
  >
    <Stack.Screen name="MyWorkScreen" component={Services} />
  </Stack.Navigator>
);

const HelpStack = () => (
  <Stack.Navigator
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerShown: false,
    }}
  >
    <Stack.Screen name="HelpScreen" component={HelpContact} />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerShown: false,
    }}
  >
    <Stack.Screen name="SettingsScreen" component={Settings} />
  </Stack.Navigator>
);

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

export default WorkerHomeScreen;
