import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ToastAndroid, Linking, Animated, FlatList, Easing, SafeAreaView, Platform } from "react-native";
import { RootStackParamList } from "../../RootNavigator";
import { useTheme } from "../../context/ThemeContext";
import Header from "../Header";


type WorkerPaymentDetailsScreenRouteProp = RouteProp<RootStackParamList, 'WorkerPaymentDetailsScreen'>;

const WorkerPaymentDetailsScreen = () => {
  const { theme } = useTheme();
  const route = useRoute<WorkerPaymentDetailsScreenRouteProp>();
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

  let paymentStatus = 'Payment Done';

  switch (project.project_Id) {
    case 'P0016':
      paymentStatus = 'Pending Approval';
      break;
    case 'P0015':
      paymentStatus = 'Incomplete Documentation';
      break;
    case 'P0014':
      paymentStatus = 'Incorrect Payment Details';
      break;
    case 'P0013':
      paymentStatus = 'Bank Processing Delays';
      break;
    case 'P0012':
      paymentStatus = 'Payment Processing Delays';
      break;
    default:
      paymentStatus = 'Payment Done';
  }

  const projectDetails = [
    { label: 'Project ID', value: project.project_Id, icon: 'badge' },
    { label: 'Project Description', value: project.long_project_description, icon: 'info' }, // Updated to 'info' for correct icon
    { label: 'Assigned To', value: project.worker_name, icon: 'person' }, // 'user' icon changed to 'person'
    { label: 'Start Date', value: project.project_start_date, icon: 'calendar-today' }, // 'calendar' updated to 'calendar-today'
    { label: 'End Date', value: project.project_end_date, icon: 'calendar-today' }, // Same change for end date
    { label: 'Completion', value: `${project.completion_percentage}%`, icon: 'check-circle' },
    { label: 'Payment Status', value: paymentStatus, icon: 'credit-card' }
  ];

  const downloadReceipt = () => {
    ToastAndroid.show('Receipt Downloaded Successfully!', ToastAndroid.SHORT);
  };

  const callContractor = () => {
    ToastAndroid.show('Calling Contractor...', ToastAndroid.SHORT);
    Linking.openURL('tel:+1234567890');
  };
  const shouldShowCallContractor = ['P0016', 'P0015', 'P0014', 'P0013', 'P0012'].includes(project.project_Id);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header title="Payments Details" />
      <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: theme.mode === 'dark' ? '#333' : '#f9f9f9' }]}>
        <FlatList
          data={projectDetails}
          keyExtractor={(item) => item.label}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: theme.mode === 'dark' ? '#444' : '#fff' }]}>
              <Icon name={item.icon} size={25} color={theme.mode === 'dark' ? '#fff' : '#28a745'} style={styles.icon} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{item.label}</Text>
                <Text style={[styles.value, item.label === 'Payment Status' && styles.boldText, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>
                  {item.label === 'Payment Status' ? <Text style={styles.boldText}>{item.value}</Text> : item.value}
                </Text>
              </View>
            </View>
          )}
        />

        {shouldShowCallContractor ? (
          <TouchableOpacity style={[styles.downloadButton, { backgroundColor: theme.mode === 'dark' ? '#555' : '#28a745' }]} onPress={callContractor}>
            <Icon name="phone" size={20} color="#fff" />
            <Text style={styles.downloadButtonText}>Call Contractor</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.downloadButton, { backgroundColor: theme.mode === 'dark' ? '#555' : '#28a745' }]} onPress={downloadReceipt}>
            <Icon name="download" size={20} color="#fff" />
            <Text style={styles.downloadButtonText}>Download Receipt</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 15, borderRadius: 10, elevation: 5 },
  icon: { marginRight: 15 },
  label: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  value: { fontSize: 14, flexWrap: 'wrap', flex: 1 },
  boldText: { fontWeight: 'bold' },
  downloadButton: {
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
    padding: 13,
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  backButtonText: {
    fontWeight: 'bold',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default WorkerPaymentDetailsScreen;
