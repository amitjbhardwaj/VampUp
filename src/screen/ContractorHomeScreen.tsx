import React, { useCallback } from 'react';
import {
  Text,
  StyleSheet,
  Platform,
  View,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RouteProp, useNavigation } from '@react-navigation/native';
import { PanGestureHandler } from 'react-native-gesture-handler';

import Home from "../tabs_contractor/Home";
import Services from "../tabs_contractor/Services";
import HelpContact from "../tabs_contractor/HelpContact";
import Settings from "../tabs_contractor/Settings";
import { useTheme } from '../context/ThemeContext';

type TabParamList = {
  Start: undefined;
  "My Work": undefined;
  Help: undefined;
  Settings: undefined;
};

const TABS = ["Start", "My Work", "Help", "Settings"];
const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator();

// HOC for swipe gesture
const withSwipe = (Component: React.ComponentType<any>, tabName: keyof TabParamList) => {
  return (props: any) => {
    const navigation = useNavigation<any>();

    const handleGesture = ({ nativeEvent }: any) => {
      const currentIndex = TABS.indexOf(tabName);
      if (nativeEvent.translationX < -50 && currentIndex < TABS.length - 1) {
        navigation.navigate(TABS[currentIndex + 1]);
      } else if (nativeEvent.translationX > 50 && currentIndex > 0) {
        navigation.navigate(TABS[currentIndex - 1]);
      }
    };

    return (
      <PanGestureHandler
        onEnded={handleGesture}
        activeOffsetX={[-20, 20]} // Only trigger horizontally
        activeOffsetY={[-9999, 9999]} // Allow vertical movement (doesn't block)
      >
        <View style={{ flex: 1 }}>
          <Component {...props} />
        </View>
      </PanGestureHandler>

    );
  };
};

// Tab icons
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
          height: Platform.OS === "ios" ? 100 : 100,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "#ccc",
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
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

// Stack Navigators with swipe-wrapped screens
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerShown: false,
    }}
  >
    <Stack.Screen name="HomeScreen" component={withSwipe(Home, "Start")} />
  </Stack.Navigator>
);

const MyWorkStack = () => (
  <Stack.Navigator
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerShown: false,
    }}
  >
    <Stack.Screen name="MyWorkScreen" component={withSwipe(Services, "My Work")} />
  </Stack.Navigator>
);

const HelpStack = () => (
  <Stack.Navigator
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerShown: false,
    }}
  >
    <Stack.Screen name="HelpScreen" component={withSwipe(HelpContact, "Help")} />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerShown: false,
    }}
  >
    <Stack.Screen name="SettingsScreen" component={withSwipe(Settings, "Settings")} />
  </Stack.Navigator>
);

export default WorkerHomeScreen;
