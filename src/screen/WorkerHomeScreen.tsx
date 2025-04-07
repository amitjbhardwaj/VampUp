import React, { useCallback } from 'react';
import {
  Text,
  StyleSheet,
  Platform,
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
  Start: undefined;
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
      let iconName = "home";
      if (route.name === "My Work") {
        iconName = "briefcase";
      } else if (route.name === "Help") {
        iconName = "call";
      } else if (route.name === "Settings") {
        iconName = "settings";
      }

      // Append "-outline" if not focused
      const finalIconName = focused ? iconName : `${iconName}-outline`;

      return (
        <Ionicons
          name={finalIconName}
          size={focused ? size + 2 : size}
          color={focused ? theme.primary : "gray"}
          accessibilityLabel={route.name}
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
          <Text style={{
            color: focused ? theme.primary : "gray",
            fontSize: 12,
            fontWeight: focused ? "600" : "400",
          }}>
            {route.name}
          </Text>
        ),
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: theme.background,
          height: Platform.OS === "ios" ? 100 : 100, // Increased height
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "#ccc",
          paddingBottom: Platform.OS === "ios" ? 25 : 10, // optional for spacing
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
      })}
    >
      <Tab.Screen name="Start" component={HomeStack} />
      <Tab.Screen name="My Work" component={MyWorkStack} />
      <Tab.Screen name="Help" component={HelpStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};

// 🧭 Stack Navigators
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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

export default WorkerHomeScreen;
