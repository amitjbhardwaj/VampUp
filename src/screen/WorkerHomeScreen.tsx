import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../tabs/Home";
import Services from "../tabs/Services";
import Post from "../tabs/Post";
import HelpContact from "../tabs/HelpContact";
import Settings from "../tabs/Settings";
import { Image, StyleSheet, TouchableOpacity, View, GestureResponderEvent } from "react-native";
import React from "react";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon set

const Tab = createBottomTabNavigator();

interface CustomButtonProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
}

const CustomTabBarButton: React.FC<CustomButtonProps> = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.customButtonContainer}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.customButton}>{children}</View>
  </TouchableOpacity>
);

const TabBarIcon = ({
  source,
  focused,
}: {
  source: any;
  focused: boolean;
}) => (
  <View style={styles.iconContainer}>
    <Image
      source={source}
      resizeMode="contain"
      style={{
        width: 30,
        height: 30,
        tintColor: focused ? "#000" : "#bbb",
      }}
    />
  </View>
);

const WorkerHomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon source={require("../assets/home.png")} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Service"
        component={Services}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon source={require("../assets/services.png")} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={Post}
        options={{
          tabBarIcon: () => (
            <Icon
              name="plus"
              size={30}
              color="#fff"
            />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="HelpContact"
        component={HelpContact}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon source={require("../assets/help.png")} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon source={require("../assets/settings.png")} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 15,
    left: 20,
    right: 20,
    backgroundColor: "rgb(250, 249, 252)",
    borderRadius: 25,
    height: 90,
    elevation: 10,
  },
  customButtonContainer: {
    top: -30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  customButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    top: 20,
  },
});

export default WorkerHomeScreen;
