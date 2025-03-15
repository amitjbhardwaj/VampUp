import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  TextInput,
} from "react-native";
import { NavigationProp, useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { RootStackParamList } from "../../RootNavigator";
import projectsData from "../../assets/projects.json";


interface Project {
  project_Id: string;
  project_description: string;
  assigned_to: string;
  project_start_date: string;
  project_end_date: string;
  contractor_phone: string;
  completion_percentage: number;
}

const WorkerActiveWorkScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchText, setSearchText] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>(projectsData);

  // Filter active projects
  const activeProjects = projects.filter((project) => project.completion_percentage < 100);

  // Search filter
  const filteredProjects = activeProjects.filter((project) =>
    Object.values(project).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  // Callback to update the completion percentage
  const handleUpdateCompletion = (projectId: string, newCompletion: number) => {
    setProjects((prevProjects) =>
      prevProjects
        .map((proj) =>
          proj.project_Id === projectId ? { ...proj, completion_percentage: newCompletion } : proj
        )
        .filter((proj) => proj.completion_percentage < 100) // Remove completed projects
    );
  };
  

  const handleCallContractor = useCallback((phoneNumber: string) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  }, []);

  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const ProjectCard = ({ project }: { project: Project }) => (
    <View style={styles.projectCard}>
      {projectDetails(project).map(({ label, value, icon }) => (
        <View key={label} style={styles.card}>
          <Icon name={icon} size={20} color="#28a745" style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() =>
          navigation.navigate("WorkUpdateStatusScreen", {
            project,
            onUpdateCompletion: handleUpdateCompletion,
          })
        }
      >
        <Text style={styles.updateButtonText}>Update Status</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.callButton}
        onPress={() => handleCallContractor(project.contractor_phone)}
      >
        <Text style={styles.callButtonText}>Call Contractor</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Projects</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Projects..."
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.project_Id}
        renderItem={({ item }) => <ProjectCard project={item} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No active projects found.</Text>}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const projectDetails = (project: Project) => [
  { label: "Project ID", value: project.project_Id, icon: "id-badge" },
  { label: "Description", value: project.project_description, icon: "info-circle" },
  { label: "Assigned To", value: project.assigned_to, icon: "user" },
  { label: "Start Date", value: project.project_start_date, icon: "calendar" },
  { label: "End Date", value: project.project_end_date, icon: "calendar" },
  { label: "Contractor Phone", value: project.contractor_phone, icon: "phone" },
  { label: "Completion", value: `${project.completion_percentage}%`, icon: "check-circle" },
];

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
  backButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  updateButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    marginTop: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  updateButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  callButton: {
    backgroundColor: "#28a745",
    padding: 10,
    marginTop: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  callButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default WorkerActiveWorkScreen;
