import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../RootNavigator";
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

type AdminFindContractorScreenNavigationProp = NavigationProp<RootStackParamList, "AdminFindContractorScreen">;

const AdminFindContractorScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<AdminFindContractorScreenNavigationProp>();

    const [contractors, setContractors] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedContractor, setSelectedContractor] = useState<string>("");

    const fetchContractors = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://192.168.129.119:5001/get-all-user');
            if (response.data.status === "OK") {
                const filtered = response.data.data.filter((user: any) => user.role.toLowerCase() === "contractor");
                setContractors(filtered);
            }
        } catch (error) {
            console.error("Error fetching contractors:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContractors();
    }, []);

    const handleOkay = () => {
        navigation.navigate("AdminAllocateProjectScreen");
        navigation.goBack();
    };

    const handleCancel = () => {
        setSelectedContractor("");
        navigation.goBack();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>        
            <Text style={[styles.title, { color: theme.text }]}>Select Contractor</Text>

            {loading ? (
                <ActivityIndicator size="large" color={theme.primary} />
            ) : (
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedContractor}
                        onValueChange={(itemValue) => setSelectedContractor(itemValue)}
                        style={{ color: theme.text }}
                        dropdownIconColor={theme.primary}
                    >
                        <Picker.Item label="Select Contractor" value="" />
                        {contractors.map((user) => (
                            <Picker.Item
                                key={user._id}
                                label={`${user.firstName} ${user.lastName}`.trim() || "Unnamed Contractor"}
                                value={user._id}
                            />
                        ))}
                    </Picker>
                </View>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleOkay}>
                    <Text style={styles.buttonText}>Okay</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, { backgroundColor: theme.cancelButton }]} onPress={handleCancel}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        marginBottom: 30,
        overflow: 'hidden',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 0.48,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default AdminFindContractorScreen;
