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
    completion_percentage: 96,
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
    project_description: 'Park Cleaning - Central Park',
    assigned_to: 'Jane Smith',
    project_start_date: '2025-03-02',
    project_end_date: '2025-03-14',
    completion_percentage: 80,
    contractor_phone: '+919876543213'
  },
  {
    project_Id: 'P005',
    project_description: 'Street Light Installation - Avenue 5',
    assigned_to: 'David Green',
    project_start_date: '2025-03-06',
    project_end_date: '2025-03-20',
    completion_percentage: 85,
    contractor_phone: '+919876543214'
  },
  {
    project_Id: 'P006',
    project_description: 'Storm Drain Cleaning - Sector 2',
    assigned_to: 'Sarah Brown',
    project_start_date: '2025-03-07',
    project_end_date: '2025-03-18',
    completion_percentage: 50,
    contractor_phone: '+919876543215'
  }
];

const getStatusColor = (percentage: number) => {
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
      <TouchableOpacity style={styles.callButton} onPress={() => makeCall(item.contractor_phone)}>
        <Icon name="phone" size={20} color="#fff" />
        <Text style={styles.callButtonText}>Call Contractor</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={projectData}
      renderItem={renderItem}
      keyExtractor={(item) => item.project_Id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 5,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 5,
    marginTop: 10,
  },
  callButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default WorkerActiveWorkScreen;
