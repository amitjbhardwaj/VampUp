import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../tabs/Home";
import Services from "../tabs/Services";
import Post from "../tabs/Post";
import HelpContact from "../tabs/HelpContact";
import Settings from "../tabs/Settings";
import { Image, StyleSheet, TouchableOpacity, View, GestureResponderEvent, TextInput, Modal, Text } from "react-native";
import React, { useState } from "react";
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
  const [modalVisible, setModalVisible] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  // Function to handle submit
  const handleSubmit = () => {
    console.log('Subject:', subject);
    console.log('Description:', description);
    // You can handle your request submission logic here.
    setModalVisible(false); // Close modal after submit
  };

  return (
    <>
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
            tabBarButton: (props) => <CustomTabBarButton {...props} onPress={() => setModalVisible(true)} />,
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

      {/* Modal for Request/Complaint */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)} // Close modal on back press
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <Text style={styles.modalTitle}>Request/Complaint</Text>

            {/* Subject Input */}
            <TextInput
              style={styles.input}
              placeholder="Subject"
              value={subject}
              onChangeText={setSubject}
            />

            {/* Description TextArea */}
            <TextInput
              style={styles.textArea}
              placeholder="Description"
              multiline
              value={description}
              onChangeText={setDescription}
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            {/* Close Button (Same size as Submit button, color black) */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    elevation: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  textArea: {
    width: "100%",
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#000", // Black background for close button
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    width: "100%", // Same width as submit button
    marginBottom: 20,
  },
});

export default WorkerHomeScreen;
