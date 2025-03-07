import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from '../../RootNavigator';

type WorkerPaymentScreenRouteProp = RouteProp<RootStackParamList, 'WorkerPayment'>;

const WorkerPaymentScreen = () => {
  const route = useRoute<WorkerPaymentScreenRouteProp>();
  const navigation = useNavigation();

  const { project } = route.params;

  const projectDetails = [
    { label: 'Project ID', value: project.project_Id, icon: 'id-card' },
    { label: 'Description', value: project.long_project_description, icon: 'info-circle' },
    { label: 'Assigned To', value: project.assigned_to, icon: 'user' },
    { label: 'Start Date', value: project.project_start_date, icon: 'calendar' },
    { label: 'End Date', value: project.project_end_date, icon: 'calendar-check-o' },
    { label: 'Completion', value: `${project.completion_percentage}%`, icon: 'check-circle' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Payment Details</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: project.completion_percentage === 100 ? '#28a745' : '#dc3545' }
        ]}>
          <Text style={styles.statusText}>
            {project.completion_percentage === 100 ? 'Payment Done' : 'Payment Pending'}
          </Text>
        </View>
      </View>

      <FlatList
        data={projectDetails}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Icon name={item.icon} size={22} color="#555" style={styles.icon} />
            <View>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 20 },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#0077b6',
    borderRadius: 15,
    elevation: 8,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  statusBadge: { marginTop: 10, paddingVertical: 5, paddingHorizontal: 15, borderRadius: 20 },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 12,
    borderRadius: 15,
    elevation: 6,
    alignItems: 'center',
  },
  icon: { marginRight: 15 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  value: { fontSize: 14, color: '#555' },
  backButton: {
    backgroundColor: '#000',
    padding: 15,
    marginTop: 30,
    alignItems: 'center',
    borderRadius: 15,
    elevation: 10,
  },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default WorkerPaymentScreen;
