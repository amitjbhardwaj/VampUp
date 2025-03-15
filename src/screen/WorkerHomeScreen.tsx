import {
  Text,
  StyleSheet,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "@react-native-community/blur";
import Ionicons from "react-native-vector-icons/Ionicons";
import Home from "../tabs/Home";
import Services from "../tabs/Services";
import HelpContact from "../tabs/HelpContact";
import Settings from "../tabs/Settings";

const Tab = createBottomTabNavigator();

const WorkerHomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => {
        let iconName = "home-outline"; // Default value
        if (route.name === "My Services") {
          iconName = "briefcase-outline";
        } else if (route.name === "Help") {
          iconName = "call-outline";
        } else if (route.name === "Settings") {
          iconName = "settings-outline";
        }

        return {
          tabBarIcon: ({ focused, size }) => (
            <Ionicons 
              name={iconName} 
              size={size} 
              color={focused ? "black" : "gray"}  // Change color to black when focused, otherwise gray
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? "black" : "gray" }}>
              {route.name}
            </Text>
          ),
          tabBarBackground: () => (
            <BlurView
              style={styles.blurView}
              blurType="light"
              blurAmount={10}
            />
          ),
          tabBarShowLabel: true,
          tabBarStyle: styles.tabBar,
          headerStyle: styles.header,
          headerTitleAlign: "center",
        };
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="My Services" component={Services} />
      <Tab.Screen name="Help" component={HelpContact} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};



const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  iconItem: {
    alignItems: "center",
    width: "45%",
  },
  floatingButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#000",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    height: 100,
    borderRadius: 5,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabBar: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
  },
  header: {
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default WorkerHomeScreen;
