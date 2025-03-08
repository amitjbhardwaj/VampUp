import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Modal, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from "../../RootNavigator";

type WorkerActiveWorkScreenNavigationProp = NavigationProp<RootStackParamList>;
type WorkerTabsNavigationProp = any;

const Tab = createBottomTabNavigator();

interface WorkerTabsProps {
  navigation: WorkerTabsNavigationProp;
}

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
  {
    project_Id: '1',
    project_description: 'Project A',
    long_project_description: 'A long description of Project A.',
    assigned_to: 'John Doe',
    project_start_date: '2025-01-01',
    project_end_date: '2025-02-01',
    completion_percentage: 75,
    contractor_phone: '1234567890'
  },
  {
    project_Id: '2',
    project_description: 'Project B',
    long_project_description: 'A long description of Project B.',
    assigned_to: 'Jane Smith',
    project_start_date: '2025-02-01',
    project_end_date: '2025-03-01',
    completion_percentage: 95,
    contractor_phone: '0987654321'
  },
  {
    project_Id: '3',
    project_description: 'Project B',
    long_project_description: 'A long description of Project B.',
    assigned_to: 'Jane Smith',
    project_start_date: '2025-02-01',
    project_end_date: '2025-03-01',
    completion_percentage: 5,
    contractor_phone: '0987654321'
  },
  {
    project_Id: '4',
    project_description: 'Project B',
    long_project_description: 'A long description of Project B.',
    assigned_to: 'Jane Smith',
    project_start_date: '2025-02-01',
    project_end_date: '2025-03-01',
    completion_percentage: 50,
    contractor_phone: '0987654321'
  },
  {
    project_Id: '5',
    project_description: 'Project B',
    long_project_description: 'A long description of Project B.',
    assigned_to: 'Jane Smith',
    project_start_date: '2025-02-01',
    project_end_date: '2025-03-01',
    completion_percentage: 75,
    contractor_phone: '0987654321'
  },
  {
    project_Id: '6',
    project_description: 'Project B',
    long_project_description: 'A long description of Project B.',
    assigned_to: 'Jane Smith',
    project_start_date: '2025-02-01',
    project_end_date: '2025-03-01',
    completion_percentage: 60,
    contractor_phone: '0987654321'
  },
  // Add more data as needed
];

// Function to categorize completion percentages
const getStatusCategory = (percentage: number) => {
  if (percentage < 85) return 'red';     // Red
  if (percentage < 99) return 'amber';   // Amber
  return 'green';                        // Green
};

// Function to get the color based on status category
const getStatusColor = (percentage: number) => {
  const category = getStatusCategory(percentage);
  if (category === 'red') return '#e74c3c';  // Red
  if (category === 'amber') return '#f39c12';  // Amber
  return '#2ecc71';  // Green
};

const WorkerActiveWorkScreen = () => {
  const navigation = useNavigation<WorkerActiveWorkScreenNavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Sort the projectData based on completion percentage
  const sortedProjectData = [...projectData]
    .filter(project => project.completion_percentage < 100)
    .sort((a, b) => {
      const categoryA = getStatusCategory(a.completion_percentage);
      const categoryB = getStatusCategory(b.completion_percentage);

      // Sort first by status category (red -> amber)
      if (categoryA === categoryB) {
        return b.completion_percentage - a.completion_percentage;  // If same category, sort by completion percentage
      }
      return categoryA === 'red' ? -1 : categoryA === 'amber' ? -1 : 1;
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
      <Text style={styles.projectDetail}>Project ID: {item.project_Id}</Text>
      <Text style={styles.projectDetail}>Assigned To: {item.assigned_to}</Text>
      <Text style={styles.projectDetail}>Start Date: {item.project_start_date}</Text>
      <Text style={styles.projectDetail}>End Date: {item.project_end_date}</Text>

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
    <View style={styles.container}>
      {sortedProjectData.length > 0 ? (
        <FlatList
          data={sortedProjectData}
          renderItem={renderItem}
          keyExtractor={(item) => item.project_Id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text>No projects available.</Text>}
        />
      ) : (
        <Text style={styles.noDataText}>No active projects available.</Text>
      )}

      {/* Modal for detailed view */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="times" size={24} color="#fff" />
              </TouchableOpacity>

              {selectedProject && (
                <>
                  <ScrollView
                    style={styles.modalScrollView}
                    nestedScrollEnabled={true}
                    contentContainerStyle={{ paddingBottom: 20 }}
                  >
                    <Text style={styles.modalTitle}>{selectedProject.project_description}</Text>
                    <Text style={styles.modalText}><Text style={styles.label}>Project ID:</Text> {selectedProject.project_Id}</Text>
                    <Text style={styles.modalText}><Text style={styles.label}>Long Description:</Text> {selectedProject.long_project_description}</Text>
                    <Text style={styles.modalText}><Text style={styles.label}>Assigned To:</Text> {selectedProject.assigned_to}</Text>
                    <Text style={styles.modalText}><Text style={styles.label}>Start Date:</Text> {selectedProject.project_start_date}</Text>
                    <Text style={styles.modalText}><Text style={styles.label}>End Date:</Text> {selectedProject.project_end_date}</Text>
                    <Text style={styles.modalText}><Text style={styles.label}>Completion:</Text> {selectedProject.completion_percentage}%</Text>
                  </ScrollView>

                  {selectedProject.completion_percentage === 100 && (
                    <TouchableOpacity
                      style={styles.paymentButton}
                      onPress={() => navigation.navigate('WorkerPayment', { project: selectedProject })}
                    >
                      <Icon name="credit-card" size={20} color="#fff" />
                      <Text style={styles.buttonText}>View Payment</Text>
                    </TouchableOpacity>
                  )}

                  {selectedProject.completion_percentage < 100 && (
                    <TouchableOpacity
                      style={styles.callButton}
                      onPress={() => Linking.openURL(`tel:${selectedProject.contractor_phone}`)}
                    >
                      <Icon name="phone" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Call Contractor</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const WorkerTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen
        name="Work Details"
        component={WorkerActiveWorkScreen}
        options={{
          tabBarLabel: 'Go Back',
          tabBarButton: (props) => <CustomTabButton {...props} />
        }}
      />
    </Tab.Navigator>
  );
};

const CustomTabButton = (props: any) => {
  const navigation = useNavigation<WorkerTabsNavigationProp>();
  return (
    <TouchableOpacity
      style={styles.goBackButton}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.goBackText}>Go Back</Text>
    </TouchableOpacity>
  );
};

const App = () => <WorkerTabs />;

// 🎨 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f3f3' },
  listContainer: { paddingBottom: 50, paddingHorizontal: 15 },
  card: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 18, 
    elevation: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, 
    shadowRadius: 8 
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  projectDetail: { fontSize: 14, color: '#7f8c8d', marginBottom: 4 },
  status: { padding: 10, borderRadius: 5, marginVertical: 10, alignItems: 'center' },
  statusText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20, width: '80%', elevation: 10 },
  closeButton: { position: 'absolute', top: 10, right: 10, zIndex: 1 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 8 },
  label: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  callButton: {
    backgroundColor: '#28a745', padding: 12, borderRadius: 5, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 20
  },
  paymentButton: {
    backgroundColor: '#007bff', padding: 12, borderRadius: 5, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 20
  },
  backButton: { marginTop: 15, alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 25, backgroundColor: '#ccc', borderRadius: 10 },
  backButtonText: { fontSize: 18, fontWeight: 'bold' },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 10 },
  goBackButton: {
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    backgroundColor: '#000', 
    borderRadius: 25, 
    marginBottom: 1, 
    marginTop: 1,
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 5, // Slight shadow for better emphasis
  },
  goBackText: {
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16, 
    textAlign: 'center', 
  },
  updateStatusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 10,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  modalScrollView: { maxHeight: 400 },
  noDataText: { textAlign: 'center', fontSize: 18, marginTop: 20 },
});

export default App;
