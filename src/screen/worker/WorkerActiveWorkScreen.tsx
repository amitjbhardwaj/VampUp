import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import WorkUpdateStatusScreen from "./WorkUpdateStatusScreen";
import { RootStackParamList } from "../../RootNavigator";


type WorkerActiveWorkScreenNavigationProp = NavigationProp<RootStackParamList>;

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export interface Project {
  project_Id: string;
  project_description: string;
  long_project_description: string;
  assigned_to: string;
  project_start_date: string;
  project_end_date: string;
  completion_percentage: number;
  contractor_phone: string;
}

const projectData: Project[] = [
  { project_Id: 'P001', project_description: 'Road Cleaning - Street 12', long_project_description: 'Road Cleaning - Street 12,Road Cleaning - Street 12,Road Cleaning - Street 12,Road Cleaning - Street 12', assigned_to: 'John Doe', project_start_date: '2025-03-01', project_end_date: '2025-03-10', completion_percentage: 100, contractor_phone: '+919876543210' },
  { project_Id: 'P002', project_description: 'Drainage Maintenance', long_project_description: 'Road Cleaning - Street 12,Road Cleaning - Street 12,Road Cleaning - Street 12', assigned_to: 'John Doe', project_start_date: '2025-03-05', project_end_date: '2025-03-15', completion_percentage: 90, contractor_phone: '+919876543211' },
  { project_Id: 'P003', project_description: 'Road Paving - Street 15', long_project_description: 'Road Cleaning - Street 12,Road Cleaning - Street 12,Road Cleaning - Street 12', assigned_to: 'Jane Smith', project_start_date: '2025-03-03', project_end_date: '2025-03-14', completion_percentage: 80, contractor_phone: '+919876543212' },
  { project_Id: 'P004', project_description: 'Bridge Repair', long_project_description: 'Road Cleaning - Street 12,Road Cleaning - Street 12', assigned_to: 'Jane Smith', project_start_date: '2025-03-10', project_end_date: '2025-03-20', completion_percentage: 70, contractor_phone: '+919876543213' },
];

// Function to categorize completion percentages
const getStatusCategory = (percentage: number) => {
  if (percentage < 85) return 'red';     // Red
  if (percentage < 95) return 'amber';   // Amber
  return 'green';                        // Green
};

// Function to get the color based on status category
const getStatusColor = (percentage: number) => {
  const category = getStatusCategory(percentage);
  if (category === 'red') return 'red';
  if (category === 'amber') return 'orange';
  return 'green';
};

const WorkerActiveWorkScreen = () => {
  const navigation = useNavigation<WorkerActiveWorkScreenNavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // Type for selectedProject

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="#000" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Sort the projectData based on completion percentage
  const sortedProjectData = [...projectData].sort((a, b) => {
    const categoryA = getStatusCategory(a.completion_percentage);
    const categoryB = getStatusCategory(b.completion_percentage);

    // Sort first by status category (red -> amber -> green)
    if (categoryA === categoryB) {
      return b.completion_percentage - a.completion_percentage;  // If same category, sort by completion percentage
    }
    return categoryA === 'red' ? -1 : categoryA === 'amber' ? -1 : 1;  // Red -> Amber -> Green
  });

  const renderItem = ({ item }: { item: Project }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedProject(item);
        setModalVisible(true);
      }}
    >


      <Text style={styles.title}>{item.project_description}</Text>
      <Text>Project ID: {item.project_Id}</Text>
      <Text>Assigned To: {item.assigned_to}</Text>
      <Text>Start Date: {item.project_start_date}</Text>
      <Text>End Date: {item.project_end_date}</Text>
      {/* Update Status Button - Visible only for Red and Amber projects */}
      {getStatusCategory(item.completion_percentage) !== 'green' && (
        <TouchableOpacity
          style={styles.updateStatusButton}
          onPress={() => navigation.navigate("WorkUpdateStatus", { project: item })}
        >
          <Icon name="refresh" size={20} color="#fff" />
          <Text style={styles.buttonText}>Update Status</Text>
        </TouchableOpacity>
      )}
      <View style={[styles.status, { backgroundColor: getStatusColor(item.completion_percentage) }]}>
        <Text style={styles.statusText}>{item.completion_percentage}% Completed</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={sortedProjectData} // Use sorted project data
        renderItem={renderItem}
        keyExtractor={(item) => item.project_Id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal for detailed view */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)} // Close modal on back press
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Close Modal Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)} // Close modal
              >
                <Icon name="times" size={24} color="#fff" />
              </TouchableOpacity>

              {selectedProject && (
                <View style={styles.modalDetails}>
                  {/* Project Description */}
                  <Text style={styles.modalTitle}>{selectedProject.project_description}</Text>
                  <Text style={styles.modalText}>Project ID: {selectedProject.project_Id}</Text>
                  <Text style={styles.modalText}>Project Long Description: {selectedProject.long_project_description}</Text>
                  <Text style={styles.modalText}>Assigned To: {selectedProject.assigned_to}</Text>
                  <Text style={styles.modalText}>Start Date: {selectedProject.project_start_date}</Text>
                  <Text style={styles.modalText}>End Date: {selectedProject.project_end_date}</Text>
                  <Text style={styles.modalText}>Completion: {selectedProject.completion_percentage}%</Text>

                  {/* Show "View Payment" button for 100% completed projects */}
                  {selectedProject.completion_percentage === 100 && (
                    <TouchableOpacity
                      style={styles.paymentButton}
                      onPress={() => console.log("Navigating to Payment Screen")}
                    >
                      <Icon name="credit-card" size={20} color="#fff" />
                      <Text style={styles.buttonText}>View Payment</Text>
                    </TouchableOpacity>
                  )}



                  {/* Show "Call Contractor" button for projects less than 100% completed */}
                  {selectedProject.completion_percentage < 100 && (
                    <TouchableOpacity
                      style={styles.callButton}
                      onPress={() => Linking.openURL(`tel:${selectedProject.contractor_phone}`)}
                    >
                      <Icon name="phone" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Call Contractor</Text>
                    </TouchableOpacity>
                  )}

                  {/* Back Button */}
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Icon name="arrow-left" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Back</Text>
                  </TouchableOpacity>
                </View>
              )}


            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

// Bottom Tab Navigation
const WorkerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { display: 'none' }, // Hide bottom tabs
        headerShown: true, // Show the header
      }}
    >
      <Tab.Screen name="WorkDetails" component={WorkerActiveWorkScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <WorkerTabs />
  );
};

// 🎨 Styles
const styles = StyleSheet.create({
  listContainer: { paddingBottom: 50, paddingHorizontal: 15 },
  card: { backgroundColor: '#f9f9f9', padding: 20, borderRadius: 20, marginBottom: 18, elevation: 9 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  status: { padding: 10, borderRadius: 5, marginVertical: 10, alignItems: 'center' },
  statusText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalDetails: {
    marginTop: 40,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 8 },
  callButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  paymentButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  updateStatusButton: {
    backgroundColor: '#ffc107', // Amber color for visibility
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default App;
