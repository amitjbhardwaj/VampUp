import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, TextInput } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { RootStackParamList } from "../../RootNavigator"; // Adjust the path if needed
import projectsData from "../../assets/projects.json"; // Adjust the path if needed

// Correctly type the navigation prop using RootStackParamList
type WorkerActiveWorkScreenNavigationProp = NavigationProp<RootStackParamList, "WorkerActiveWorkScreen">;

const WorkerActiveWorkScreen = () => {
  const navigation = useNavigation<WorkerActiveWorkScreenNavigationProp>();
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    const filteredProjects = projectsData.filter((project) => project.completion_percentage < 100);
    setActiveProjects(filteredProjects);
    setFilteredProjects(filteredProjects);
  }, []);
  
  const handleCallContractor = (phoneNumber: string) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const projectDetails = (project: any) => [
    { label: "Project ID", value: project.project_Id, icon: "id-badge" },
    { label: "Description", value: project.project_description, icon: "info-circle" },
    { label: "Assigned To", value: project.assigned_to, icon: "user" },
    { label: "Start Date", value: project.project_start_date, icon: "calendar" },
    { label: "End Date", value: project.project_end_date, icon: "calendar" },
    { label: "Contractor Phone", value: project.contractor_phone, icon: "phone" },
    { label: "Completion", value: `${project.completion_percentage}%`, icon: "check-circle" },
  ];

  const renderProjectCard = ({ item }: { item: any }) => (
    <View style={styles.projectCard}>
      <FlatList
        data={projectDetails(item)}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Icon name={item.icon} size={20} color="#28a745" style={styles.icon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => navigation.navigate("WorkUpdateStatusScreen", { project: item })} // Navigate with 'project' param
      >
        <Text style={styles.updateButtonText}>Update Status</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.callButton}
        onPress={() => handleCallContractor(item.contractor_phone)}
      >
        <Text style={styles.callButtonText}>Call Contractor</Text>
      </TouchableOpacity>
    </View>
  );

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = activeProjects.filter((project) => {
      const lowercasedText = text.toLowerCase();
      return (
        project.project_Id.toLowerCase().includes(lowercasedText) ||
        project.project_description.toLowerCase().includes(lowercasedText) ||
        project.assigned_to.toLowerCase().includes(lowercasedText) ||
        project.project_start_date.toLowerCase().includes(lowercasedText) ||
        project.project_end_date.toLowerCase().includes(lowercasedText)
      );
    });
    setFilteredProjects(filtered);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Projects</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Project ID, Description, Assigned To, Start Date, End Date"
        value={searchText}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredProjects}
        keyExtractor={(item, index) => item.project_Id || index.toString()}
        renderItem={renderProjectCard}
        ListEmptyComponent={<Text style={styles.emptyText}>No active projects found.</Text>}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  emptyText: { fontSize: 16, color: "#777", textAlign: "center", marginTop: 20 },
  projectCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 5,
  },
  card: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  icon: { marginRight: 15 },
  label: { fontWeight: "bold", fontSize: 16 },
  value: { fontSize: 14, flexWrap: "wrap", flex: 1 },
  backButton: {
    backgroundColor: "#000",
    padding: 13,
    marginTop: 20,
    alignItems: "center",
    borderRadius: 10,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    marginTop: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  callButton: {
    backgroundColor: "#28a745",
    padding: 10,
    marginTop: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  callButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default WorkerActiveWorkScreen;
