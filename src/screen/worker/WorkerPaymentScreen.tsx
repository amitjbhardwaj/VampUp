import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type WorkerPaymentStackParamList = {
  WorkerRequestPaymentScreen: undefined;
  WorkerFullPaymentHistoryScreen: undefined;
};

const paymentOptions = [
  { name: "Request Payment", icon: "attach-money", screen: "WorkerRequestPaymentScreen" },
  { name: "Payment History", icon: "history", screen: "WorkerFullPaymentHistoryScreen" },
];

const WorkerPaymentScreen = () => {
  const { theme } = useTheme(); 
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <ScrollView style={{ backgroundColor: theme.mode === 'dark' ? '#333' : '#f8f8f8' }}>
      <View style={[styles.container, { backgroundColor: theme.mode === 'dark' ? '#333' : '#f8f8f8' }]}>
        {/* Status bar for proper spacing */}
        <StatusBar backgroundColor={theme.mode === 'dark' ? '#333' : '#fff'} barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />

        {/* Full-width Header with Back Button */}
        <View style={[styles.header, { backgroundColor: theme.mode === 'dark' ? '#444' : '#fff' }]}>
          {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={30} color="#000" />
          </TouchableOpacity> */}
          <Text style={[styles.headerText, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Payments</Text>
        </View>

        {/* Payment Options */}
        <View style={styles.content}>
          {paymentOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.option, { backgroundColor: theme.mode === 'dark' ? '#555' : '#fff' }]}
              onPress={() => navigation.navigate(option.screen as keyof WorkerPaymentStackParamList)}
            >
              <Icon name={option.icon} size={24} color={theme.mode === 'dark' ? '#fff' : '#000'} />
              <Text style={[styles.optionText, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: StatusBar.currentHeight,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: "180%",
    transform: [{ translateY: -12 }], // Center vertically
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    marginTop: 110, // Push options further down
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default WorkerPaymentScreen;
