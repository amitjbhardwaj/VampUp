import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const projectData = [
  {
    project_Id: 'P001',
    project_description: 'Road Cleaning - Street 12',
    assigned_to: 'John Doe',
    project_start_date: '2025-03-01',
    project_end_date: '2025-03-10',
    completion_percentage: 100,
    contractor_phone: '+919876543210'
  },
  {
    project_Id: 'P002',
    project_description: 'Drainage Maintenance',
    assigned_to: 'John Doe',
    project_start_date: '2025-03-05',
    project_end_date: '2025-03-15',
    completion_percentage: 90,
    contractor_phone: '+919876543211'
  },
  {
    project_Id: 'P003',
    project_description: 'Garbage Collection - Sector 4',
    assigned_to: 'John Doe',
    project_start_date: '2025-03-03',
    project_end_date: '2025-03-12',
    completion_percentage: 70,
    contractor_phone: '+919876543212'
  },
  {
    project_Id: 'P004',
    project_description: 'Drainage Maintenance',
    assigned_to: 'John Doe',
    project_start_date: '2025-03-05',
    project_end_date: '2025-03-15',
    completion_percentage: 90,
    contractor_phone: '+919876543211'
  },
  {
    project_Id: 'P005',
    project_description: 'Garbage Collection - Sector 4',
    assigned_to: 'John Doe',
    project_start_date: '2025-03-03',
    project_end_date: '2025-03-12',
    completion_percentage: 100,
    contractor_phone: '+919876543212'
  }
];

const getStatusColor = (percentage: number): string => {
  if (percentage >= 95) return 'green';
  if (percentage >= 85 && percentage < 95) return 'amber';
  return 'red';
};

const WorkerActiveWorkScreen = () => {
  const makeCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderItem = ({ item }: { item: typeof projectData[0] }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.project_description}</Text>
      <Text>Project ID: {item.project_Id}</Text>
      <Text>Assigned To: {item.assigned_to}</Text>
      <Text>Start Date: {item.project_start_date}</Text>
      <Text>End Date: {item.project_end_date}</Text>
      <View style={[styles.status, { backgroundColor: getStatusColor(item.completion_percentage) }]}>
        <Text style={styles.statusText}>{item.completion_percentage}% Completed</Text>
      </View>
      {item.completion_percentage === 100 && (
        <TouchableOpacity style={styles.viewPaymentButton}>
          <Text style={styles.viewPaymentButtonText}>View Payment</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={projectData}
        renderItem={renderItem}
        keyExtractor={(item) => item.project_Id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.callButton}
        onPress={() => makeCall(projectData[0].contractor_phone)}
      >
        <Icon name="phone" size={20} color="#fff" />
        <Text style={styles.callButtonText}>Call Contractor</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 50,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 20,
    marginBottom: 18,
    elevation: 9,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  callButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  callButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  viewPaymentButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  viewPaymentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default WorkerActiveWorkScreen;
