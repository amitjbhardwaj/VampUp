import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, SafeAreaView, Platform, StatusBar } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { NavigationProp, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../RootNavigator";
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from "@react-navigation/native";
import Header from "../Header";

type AdminFindContractorScreenNavigationProp = NavigationProp<RootStackParamList, "AdminFindContractorScreen">;
type AdminFindContractorScreenRouteProp = RouteProp<RootStackParamList, "AdminFindContractorScreen">;


const AdminFindContractorScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<AdminFindContractorScreenNavigationProp>();
    const route = useRoute<AdminFindContractorScreenRouteProp>();

    const { projectId } = route.params;

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

    const handleOkay = async () => {
        if (!projectId) {
            Alert.alert("Error", "Project ID is missing.");
            return;
        }

        const selectedContractorDetails = contractors.find(c => c._id === selectedContractor);
        if (!selectedContractorDetails) {
            Alert.alert("Error", "Please select a contractor.");
            return;
        }

        try {
            const response = await axios.put(`http://192.168.129.119:5001/update-project/${projectId}`, {
                contractor_name: `${selectedContractorDetails.firstName} ${selectedContractorDetails.lastName}`.trim(),
                contractor_phone: `${selectedContractorDetails.mobile}`,

            });

            if (response.data.status === "OK") {
                Alert.alert("Success", "Project assigned successfully");
                navigation.goBack();
            } else {
                console.log("Error updating project:", response.data);
            }
        } catch (error) {
            console.error("Error updating project:", error);
        }
    };

    const handleCancel = () => {
        setSelectedContractor("");
        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <Header title="Select Contractor" />
            <View style={[styles.container, { backgroundColor: theme.background }]}>

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


                </View>
            </View>
        </SafeAreaView>
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
        marginTop: 30,
        alignItems: 'center', // centers child horizontally
    },
    button: {
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
        width: '60%', // optional: controls button width
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
});

export default AdminFindContractorScreen;
