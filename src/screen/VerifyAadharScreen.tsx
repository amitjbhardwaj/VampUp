import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { RootStackParamList } from "../RootNavigator";
import Header from "./Header";

type VerifyAadharScreenNavigationProp = NavigationProp<RootStackParamList, "VerifyAadharScreen">;

const VerifyAadharScreen = () => {
  const navigation = useNavigation<VerifyAadharScreenNavigationProp>();
  const { theme } = useTheme();
  const [aadhar, setAadhar] = useState("");

  const handleVerify = async () => {
    const aadharTrimmed = aadhar.replace(/\s/g, "");

    if (!/^\d{12}$/.test(aadharTrimmed)) {
      Alert.alert("Invalid Aadhaar", "Please enter a valid 12-digit Aadhaar number.");
      return;
    }

    try {
      const response = await axios.post("http://192.168.129.119:5001/check-aadhar", {
        aadhar: aadharTrimmed,
      });

      if (response.status === 200) {
        navigation.navigate("PassCodeLoginScreen", { aadhar: aadharTrimmed });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          Alert.alert("Aadhaar not found", "No user found with this Aadhaar number.");
        } else {
          Alert.alert("Error", error.response?.data?.message || "Something went wrong.");
        }
      } else {
        Alert.alert("Error", "Unexpected error occurred.");
      }
    }
  };


  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header title="Log in" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>Verify Aadhaar</Text>

          <Text style={[styles.label, { color: theme.text }]}>Enter your 12-digit Aadhaar number</Text>

          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.primary }]}
            keyboardType="numeric"
            maxLength={12}
            placeholder="XXXX XXXX XXXX"
            value={aadhar}
            onChangeText={setAadhar}
            placeholderTextColor={theme.icon}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleVerify}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default VerifyAadharScreen;
