import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationProp, useNavigation } from '@react-navigation/native'; // Import useNavigation
import { RootStackParamList } from "../RootNavigator";


type SignupScreenNavigationProp = NavigationProp<RootStackParamList>;

const SignupScreen = () => {
  const [form, setForm] = useState({
    role: "",
    mobile: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    aadhar: "",
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
    branch: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigation = useNavigation<SignupScreenNavigationProp>(); // Initialize navigation

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });

    // Remove error when user starts typing
    if (errors[field]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[field];
      setErrors(updatedErrors);
    }
  };

  const validateForm = () => {
    let newErrors: Record<string, string> = {};
    Object.keys(form).forEach((key) => {
      if (!form[key as keyof typeof form]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      navigation.navigate("Otp");
    }
  };

  // Handle Back button press
  const handleBackPress = () => {
    navigation.goBack(); // This navigates back to the previous screen (LoginScreen)
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        {[
          { key: "role", icon: "person-outline", placeholder: "Role *" },
          { key: "firstName", icon: "person-outline", placeholder: "First name *" },
          { key: "lastName", icon: "person-outline", placeholder: "Last name *" },
          { key: "email", icon: "mail-outline", placeholder: "Email *" },
          { key: "password", icon: "lock-closed-outline", placeholder: "Password *", secureTextEntry: true },
          { key: "aadhar", icon: "id-card-outline", placeholder: "Aadhar number *" },
          { key: "accountHolder", icon: "card-outline", placeholder: "Account holder name *" },
          { key: "accountNumber", icon: "wallet-outline", placeholder: "Account number *" },
          { key: "ifsc", icon: "pricetag-outline", placeholder: "IFSC code *" },
          { key: "branch", icon: "business-outline", placeholder: "Branch name *" },
        ].map(({ key, icon, placeholder, secureTextEntry }, index) => (
          <View key={index} style={styles.fieldWrapper}>
            <View style={[styles.inputContainer, errors[key] && styles.inputError]}>
              <Icon name={icon} size={20} style={styles.icon} />
              <TextInput
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                style={styles.input}
                onChangeText={(value) => handleChange(key, value)}
                value={form[key as keyof typeof form]}
              />
            </View>
            {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
          </View>
        ))}

        {/* Mobile Number Field */}
        <View style={styles.fieldWrapper}>
          <View style={[styles.inputContainer, styles.row, errors.mobile && styles.inputError]}>
            <TouchableOpacity style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91 ▼</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Mobile number"
              keyboardType="phone-pad"
              style={[styles.input, { flex: 1 }]}
              onChangeText={(value) => handleChange("mobile", value)}
              value={form.mobile}
            />
          </View>
          {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
        </View>

        {/* Signup Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign up</Text>
          <Icon name="arrow-forward-outline" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4F6F6",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1A1A1A",
    textAlign: "center",
  },
  fieldWrapper: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: "row",
  },
  icon: {
    marginRight: 10,
    color: "#555",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  countryCode: {
    backgroundColor: "#E8E8E8",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#1A8F3B",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 10,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "red",
  },
  backButton: {
    marginTop: 15,
    padding: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#1A8F3B",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignupScreen;
