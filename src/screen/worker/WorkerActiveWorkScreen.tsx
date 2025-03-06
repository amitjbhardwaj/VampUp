import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // For back icon
import Icon from 'react-native-vector-icons/FontAwesome';

const projectData = [
  { project_Id: 'P001', project_description: 'Road Cleaning - Street 12', assigned_to: 'John Doe', project_start_date: '2025-03-01', project_end_date: '2025-03-10', completion_percentage: 100, contractor_phone: '+919876543210' },
  { project_Id: 'P002', project_description: 'Drainage Maintenance', assigned_to: 'John Doe', project_start_date: '2025-03-05', project_end_date: '2025-03-15', completion_percentage: 90, contractor_phone: '+919876543211' },
  { project_Id: 'P003', project_description: 'Road Paving - Street 15', assigned_to: 'Jane Smith', project_start_date: '2025-03-03', project_end_date: '2025-03-14', completion_percentage: 80, contractor_phone: '+919876543212' },
  { project_Id: 'P004', project_description: 'Bridge Repair', assigned_to: 'Jane Smith', project_start_date: '2025-03-10', project_end_date: '2025-03-20', completion_percentage: 70, contractor_phone: '+919876543213' },
];

const getStatusColor = (percentage: number) => {
  if (percentage >= 95) return 'green';
  if (percentage >= 85) return 'orange';
  return 'red';
};

// 🛠 Work Details Screen
const WorkDetailsScreen = () => {
  const navigation = useNavigation(); // Access navigation here

  // Sort the projects based on completion percentage (Red -> Amber -> Green)
  const sortedData = projectData.sort((a, b) => {
    if (a.completion_percentage < 85 && b.completion_percentage >= 85) return -1; // Red before Amber
    if (a.completion_percentage >= 85 && a.completion_percentage < 95 && b.completion_percentage >= 95) return -1; // Amber before Green
    return 1; // Green at the end (for 100% completed projects)
  });

  const renderItem = ({ item }: { item: (typeof projectData)[0] }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.project_description}</Text>
      <Text>Project ID: {item.project_Id}</Text>
      <Text>Assigned To: {item.assigned_to}</Text>
      <Text>Start Date: {item.project_start_date}</Text>
      <Text>End Date: {item.project_end_date}</Text>
      <View style={[styles.status, { backgroundColor: getStatusColor(item.completion_percentage) }]}>
        <Text style={styles.statusText}>{item.completion_percentage}% Completed</Text>
      </View>
      
      {/* View Payment Button (if 100% completed) */}
      {item.completion_percentage === 100 && (
        <TouchableOpacity style={styles.viewPaymentButton}>
          <Text style={styles.viewPaymentButtonText}>View Payment</Text>
        </TouchableOpacity>
      )}
      
      {/* Show Call Contractor and Back Buttons for Red and Amber projects */}
      {item.completion_percentage < 95 ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.callButton, styles.button]} 
            onPress={() => Linking.openURL(`tel:${item.contractor_phone}`)}
          >
            <Icon name="phone" size={20} color="#fff" />
            <Text style={styles.buttonText}>Call Contractor</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.backButton, styles.button]} 
            onPress={() => navigation.goBack()}  // Now using navigation from the hook
          >
            <Icon name="arrow-left" size={20} color="#fff" />
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Show only Back button for Green projects (100% completed), styled the same
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.viewPaymentButton, styles.button]} 
            onPress={() => navigation.goBack()}  // Now using navigation from the hook
          >
            <Icon name="arrow-left" size={20} color="#fff" />
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      data={sortedData} // Use sorted data
      renderItem={renderItem}
      keyExtractor={(item) => item.project_Id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

// 🎯 Main Component
const WorkerActiveWorkScreen = () => {

  return (
    <View style={{ flex: 1 }}>
      <WorkDetailsScreen />
    </View>
  );
};

// 🎨 Styles
const styles = StyleSheet.create({
  listContainer: { paddingBottom: 50, paddingHorizontal: 15 },
  card: { backgroundColor: '#f9f9f9', padding: 20, borderRadius: 20, marginBottom: 18, elevation: 9 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  status: { padding: 10, borderRadius: 5, marginVertical: 10, alignItems: 'center' },
  statusText: { color: '#fff', fontWeight: 'bold' },
  viewPaymentButton: { 
    marginTop: 10, 
    backgroundColor: '#28a745', 
    padding: 12, 
    borderRadius: 5, 
    alignItems: 'center', 
    flexDirection: 'row', 
    justifyContent: 'center',
  },
  viewPaymentButtonText: { 
    color: '#fff', 
    fontWeight: 'bold',
    marginLeft: 10 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '48%', // Ensure buttons fit side by side
  },
  callButton: {
    backgroundColor: '#28a745',
  },
  backButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default WorkerActiveWorkScreen;
