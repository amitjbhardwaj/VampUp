import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, ToastAndroid } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../RootNavigator";
import { useTheme } from "../../context/ThemeContext";
import axios from 'axios'
import AsyncStorage from "@react-native-async-storage/async-storage";

type SignupScreenNavigationProp = NavigationProp<RootStackParamList>;

const ContractorOnBoardWorkersScreen = () => {
    const { theme } = useTheme();
    const [form, setForm] = useState({
        role: "",
        report_to: "",
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
            report_to: form.report_to,
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

        axios
            .post("http://192.168.129.119:5001/register", userData)
            .then(res => {
                if (res.data.status === "OK") {
                    navigation.navigate("Otp", { userData: form }); // Navigate on success
                } else {
                    ToastAndroid.show("Registration failed: " + res.data.data, ToastAndroid.SHORT);
                }
            })
            .catch(e => {
                ToastAndroid.show(e, ToastAndroid.SHORT);
            });
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await axios.post('http://192.168.129.119:5001/userdata', { token });
                    if (response.data.status === "OK") {
                        const user = response.data.data;
                        const fullName = `${user.firstName} ${user.lastName}`;
                        setForm(prev => ({ ...prev, report_to: fullName }));
                    } else {
                        ToastAndroid.show('Failed to fetch user data', ToastAndroid.SHORT);
                    }
                } catch (error) {
                    ToastAndroid.show('Error fetching user data', ToastAndroid.SHORT);
                }
            }
        };
        fetchUserData();
    }, []);

    const handleBackPress = () => {
        navigation.goBack();
    };




    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>On-board Workers</Text>

            {/* Role Dropdown */}
            <View style={styles.fieldWrapper}>
                <View style={[styles.inputContainer, errors.role && styles.inputError, { backgroundColor: theme.inputBackground }]}>
                    <Icon name="person" size={20} style={[styles.icon, { color: theme.icon }]} />
                    <TouchableOpacity onPress={() => setShowRolePicker(true)} style={styles.roleDropdown}>
                        <Text style={[styles.input, { color: form.role ? theme.text : (theme.mode === "dark" ? "#fff" : "#999") }]}>
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
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Select Role</Text>
                        {["Worker"].map((role) => (
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
                { key: "report_to", icon: "person", placeholder: "Report to *" },
                { key: "firstName", icon: "person", placeholder: "First name *" },
                { key: "lastName", icon: "person", placeholder: "Last name *" },
                { key: "email", icon: "mail", placeholder: "Email *" },
                { key: "password", icon: "lock-closed", placeholder: "Password *", secureTextEntry: true },
                { key: "aadhar", icon: "id-card", placeholder: "Aadhar number *" },
                { key: "accountHolder", icon: "card", placeholder: "Account holder name *" },
                { key: "accountNumber", icon: "wallet", placeholder: "Account number *" },
                { key: "ifsc", icon: "pricetag", placeholder: "IFSC code *" },
                { key: "branch", icon: "business", placeholder: "Branch name *" },
            ].map(({ key, icon, placeholder, secureTextEntry }, index) => (
                <View key={index} style={styles.fieldWrapper}>
                    <View style={[styles.inputContainer, errors[key] && styles.inputError, { backgroundColor: theme.inputBackground }]}>
                        <Icon name={icon} size={20} style={[styles.icon, { color: theme.icon }]} />
                        <TextInput
                            placeholder={placeholder}
                            placeholderTextColor={theme.mode === "dark" ? "#fff" : "#999"} // Set placeholder color based on theme
                            secureTextEntry={secureTextEntry}
                            style={[styles.input, { color: theme.text }]}
                            onChangeText={(value) => handleChange(key, value)}
                            value={form[key as keyof typeof form]}
                        />

                    </View>
                    {errors[key] && <Text style={[styles.errorText, { color: theme.errorColor }]}>{errors[key]}</Text>}
                </View>
            ))}
            
            {/* Mobile Number Field */}
            <View style={styles.fieldWrapper}>
                <View style={[styles.inputContainer, styles.row, errors.mobile && styles.inputError, { backgroundColor: theme.inputBackground }]}>
                    <TouchableOpacity style={styles.countryCode}>
                        <Text style={[styles.countryCodeText, { color: theme.text }]}>+91 ▼</Text>
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Mobile number *"
                        placeholderTextColor={theme.mode === "dark" ? "#fff" : "#999"}
                        keyboardType="phone-pad"
                        style={[styles.input, { flex: 1, color: theme.text }]}
                        onChangeText={(value) => handleChange("mobile", value)}
                        value={form.mobile}
                    />
                </View>
                {errors.mobile && <Text style={[styles.errorText, { color: theme.errorColor }]}>{errors.mobile}</Text>}
            </View>

            {/* Signup Button */}
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleSubmit}>
                <View style={styles.buttonContent}>
                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Create</Text>
                    <Icon name="arrow-forward-outline" size={20} color={theme.buttonText} />
                </View>
            </TouchableOpacity>

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Text style={[styles.backButtonText, { color: theme.text }]}>Back to Home</Text>
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
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ContractorOnBoardWorkersScreen;
