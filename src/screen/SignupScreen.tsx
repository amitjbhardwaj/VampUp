import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../RootNavigator";
import { Picker } from '@react-native-picker/picker';

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
  const [showRolePicker, setShowRolePicker] = useState(false);

  const navigation = useNavigation<SignupScreenNavigationProp>();

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
      navigation.navigate("Otp", { userData: form });
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {/* Role Dropdown */}
      <View style={styles.fieldWrapper}>
        <View style={[styles.inputContainer, errors.role && styles.inputError]}>
          <Icon name="person-outline" size={20} style={styles.icon} />
          <TouchableOpacity onPress={() => setShowRolePicker(true)} style={styles.roleDropdown}>
            <Text style={[styles.input, { color: form.role ? "#333" : "#999" }]}>{form.role || "Select Role *"}</Text>
          </TouchableOpacity>
        </View>
        {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
      </View>


      {/* Role Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showRolePicker}
        onRequestClose={() => setShowRolePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Role</Text>
            {["Worker", "Contractor", "Admin"].map((role) => (
              <TouchableOpacity
                key={role}
                style={styles.modalOption}
                onPress={() => {
                  handleChange("role", role);
                  setShowRolePicker(false);
                }}
              >
                <Text style={styles.modalOptionText}>{role.charAt(0).toUpperCase() + role.slice(1)}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowRolePicker(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Form Fields */}
      {[
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
            placeholder="Mobile number *"
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
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Sign up</Text>
          <Icon name="arrow-forward-outline" size={20} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#1A1A1A",
    textAlign: "center",
  },
  fieldWrapper: {
    marginBottom: 12,  
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    paddingHorizontal: 20,
    height: 55,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  icon: {
    marginRight: 10,
    color: "#888",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
  },
  roleDropdown: {
    flex: 1,
    justifyContent: "center",  // Center the text vertically
    alignItems: "flex-start",  // Align the text to the left
    paddingVertical: 15,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 15,
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  button: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonContent: {
    flexDirection: "row",  
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,  
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    width: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
  },
  modalCloseButton: {
    marginTop: 15,
    paddingVertical: 10,
  },
  modalCloseText: {
    fontSize: 16,
    color: "#3498db",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryCode: {
    backgroundColor: "#E8E8E8",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});


export default SignupScreen;
