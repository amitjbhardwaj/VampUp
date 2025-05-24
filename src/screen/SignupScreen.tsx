import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, ToastAndroid } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../RootNavigator";
import { useTheme } from "../context/ThemeContext";

type SignupScreenNavigationProp = NavigationProp<RootStackParamList>;

const SignupScreen = () => {
  const { theme } = useTheme();
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
  const [focusedFields, setFocusedFields] = useState<Record<string, boolean>>({});

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

  const handleFocus = (field: string) => {
    setFocusedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setFocusedFields((prev) => ({ ...prev, [field]: false }));
  };


  const validateForm = () => {
    let newErrors: Record<string, string> = {};

    Object.keys(form).forEach((key) => {
      if (!form[key as keyof typeof form]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    // Aadhar validation: Must be exactly 12 digits
    if (form.aadhar && !/^\d{12}$/.test(form.aadhar)) {
      newErrors.aadhar = "Aadhar number must be exactly 12 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return; // Run validation, stop if there are errors

    const userData = {
      role: form.role,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      aadhar: form.aadhar,
      accountHolder: form.accountHolder,
      accountNumber: form.accountNumber,
      ifsc: form.ifsc,
      branch: form.branch,
      mobile: form.mobile,
    };

    navigation.navigate("Otp", { userData: form });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>

      {/* Role Dropdown */}
      <View style={styles.fieldWrapper}>
        <View style={[styles.inputContainer, errors.role && styles.inputError, { backgroundColor: theme.inputBackground }]}>
          <Icon name="person-outline" size={20} style={[styles.icon, { color: theme.icon }]} />
          <TouchableOpacity onPress={() => setShowRolePicker(true)} style={styles.roleDropdown}>
            <Text style={[styles.input, { color: form.role ? theme.text : (theme.placeholderTextColor) }]}>
              {form.role || "Select Role *"}
            </Text>

          </TouchableOpacity>
        </View>
        {errors.role && <Text style={[styles.errorText, { color: theme.errorColor }]}>{errors.role}</Text>}
      </View>

      {/* Role Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showRolePicker}
        onRequestClose={() => setShowRolePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.placeholderTextColor }]}>Select Role</Text>
            {["Worker", "Contractor", "Admin"].map((role) => (
              <TouchableOpacity
                key={role}
                style={styles.modalOption}
                onPress={() => {
                  handleChange("role", role);
                  setShowRolePicker(false);
                }}
              >
                <Text style={[styles.modalOptionText, { color: theme.text }]}>{role.charAt(0).toUpperCase() + role.slice(1)}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowRolePicker(false)} style={styles.modalCloseButton}>
              <Text style={[styles.modalCloseText, { color: theme.primary }]}>Cancel</Text>
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
          <View style={[styles.inputContainer, errors[key] && styles.inputError, { backgroundColor: theme.inputBackground }]}>
            <Icon name={icon} size={20} style={[styles.icon, { color: theme.icon }]} />
            <TextInput
              placeholder={focusedFields[key] ? "" : placeholder}
              placeholderTextColor={theme.placeholderTextColor}
              secureTextEntry={secureTextEntry}
              style={[styles.input, { color: theme.text }]}
              onChangeText={(value) => handleChange(key, value)}
              value={form[key as keyof typeof form]}
              onFocus={() => handleFocus(key)}
              onBlur={() => handleBlur(key)}
            />
          </View>
          {errors[key] && <Text style={[styles.errorText, { color: theme.errorColor }]}>{errors[key]}</Text>}
        </View>
      ))}

      {/* Mobile Number Field */}
      <View style={styles.fieldWrapper}>
        <View style={[styles.inputContainer, styles.row, errors.mobile && styles.inputError, { backgroundColor: theme.inputBackground }]}>
          <TouchableOpacity >
            <Text style={[styles.countryCodeText, { color: theme.text }]}>+91</Text>
          </TouchableOpacity>
          <TextInput
            placeholder={focusedFields["mobile"] ? "" : "Mobile number *"}
            placeholderTextColor={theme.placeholderTextColor}
            keyboardType="phone-pad"
            style={[styles.input, { flex: 1, color: theme.text }]}
            onChangeText={(value) => handleChange("mobile", value)}
            value={form.mobile}
            onFocus={() => handleFocus("mobile")}
            onBlur={() => handleBlur("mobile")}
          />
        </View>
        {errors.mobile && <Text style={[styles.errorText, { color: theme.errorColor }]}>{errors.mobile}</Text>}
      </View>

      {/* Signup Button */}
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleSubmit}>
        <View style={styles.buttonContent}>
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>Sign up</Text>
          <Icon name="arrow-forward-outline" size={20} color={theme.buttonText} />
        </View>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={[styles.backButtonText, { color: theme.text }]}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  fieldWrapper: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 20,
    height: 55,
    borderWidth: 1,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  roleDropdown: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingVertical: 15,
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 15,
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  button: {
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
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    borderRadius: 15,
    padding: 25,
    width: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 15,
    paddingVertical: 10,
  },
  modalCloseText: {
    fontSize: 16,
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
    fontSize: 20, // Increase this value as needed, e.g., 20 or 22
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default SignupScreen;
