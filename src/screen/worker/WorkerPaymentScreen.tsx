import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Easing, ToastAndroid } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../RootNavigator';
import Icon from 'react-native-vector-icons/FontAwesome';

type WorkerPaymentScreenRouteProp = RouteProp<RootStackParamList, 'WorkerPayment'>;

const WorkerPaymentScreen = () => {
  const route = useRoute<WorkerPaymentScreenRouteProp>();
  const navigation = useNavigation();

  const { project } = route.params;
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const projectDetails = [
    { label: 'Project ID', value: project.project_Id, icon: 'id-badge' },
    { label: 'Project Description', value: project.long_project_description, icon: 'info-circle' },
    { label: 'Assigned To', value: project.assigned_to, icon: 'user' },
    { label: 'Start Date', value: project.project_start_date, icon: 'calendar' },
    { label: 'End Date', value: project.project_end_date, icon: 'calendar' },
    { label: 'Completion', value: `${project.completion_percentage}%`, icon: 'check-circle' },
    { label: 'Payment Status', value: 'Payment Done', icon: 'credit-card' }
  ];

  const downloadReceipt = () => {
    ToastAndroid.show('Receipt Downloaded Successfully!', ToastAndroid.SHORT);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}> 
      <FlatList
        data={projectDetails}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Icon name={item.icon} size={20} color="#28a745" style={styles.icon} />
            <View>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.downloadButton} onPress={downloadReceipt}>
        <Icon name="download" size={20} color="#fff" />
        <Text style={styles.downloadButtonText}>Download Receipt</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 10, elevation: 5 },
  icon: { marginRight: 15 },
  label: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  value: { fontSize: 14 },
  downloadButton: {
    backgroundColor: '#28a745',
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 5,
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#000',
    padding: 13,
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WorkerPaymentScreen;
