import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  TextInput,
  Animated,
} from "react-native";
import { NavigationProp, useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { RootStackParamList } from "../../RootNavigator";
import projectsData from "../../assets/projects.json";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from "../../context/ThemeContext";

interface Project {
  project_Id: string;
  project_description: string;
  assigned_to: string;
  project_start_date: string;
  project_end_date: string;
  contractor_phone: string;
  completion_percentage: number;
  status: string;
}

const WorkerActiveWorkScreen = () => {
  const { theme } = useTheme(); // theme is likely an object
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchText, setSearchText] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>(projectsData.map(p => ({ ...p, status: "In-Progress" })));
  const [animatedValue] = useState(new Animated.Value(0));

  // Fade-in animation for the screen
  const fadeIn = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  useFocusEffect(
    useCallback(() => {
      fadeIn();
      const loadProjects = async () => {
        try {
          const storedProjects = await AsyncStorage.getItem("activeProjects");
          if (storedProjects) {
            const parsedProjects = JSON.parse(storedProjects).map((p: Project) => ({
              ...p,
              status: p.status || "In-Progress",
            }));
            setProjects(parsedProjects.filter((p: Project) => p.completion_percentage < 100));
          }
        } catch (error) {
          console.error("Error loading projects", error);
        }
      };
      loadProjects();
    }, [])
  );

  const handleUpdateCompletion = async (projectId: string, newCompletion: number, newStatus?: string) => {
    try {
      let updatedProjects = projects.map((proj) =>
        proj.project_Id === projectId
          ? {
              ...proj,
              completion_percentage: newCompletion,
              status: newStatus || (newCompletion === 100 ? "Completed" : "In-Progress"),
            }
          : proj
      );
  
      // Separate projects into correct categories
      const onHoldProjects = updatedProjects.filter((proj) => proj.status === "On-Hold");
      const activeProjects = updatedProjects.filter((proj) => proj.status === "In-Progress" && proj.completion_percentage < 100);
  
      // Save to AsyncStorage
      await AsyncStorage.setItem("activeProjects", JSON.stringify(activeProjects));
      await AsyncStorage.setItem("onHoldProjects", JSON.stringify(onHoldProjects));
  
      console.log("Active Projects Saved:", activeProjects);
      console.log("On-Hold Projects Saved:", onHoldProjects);
  
      // Update state with only active projects
      setProjects(activeProjects);
    } catch (error) {
      console.error("Error updating project completion", error);
    }
  };
  
  
  

  const filteredProjects = projects.filter((project) =>
    Object.values(project).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const ProjectCard = ({ project }: { project: Project }) => (
    <Animated.View style={[styles.projectCard, { opacity: animatedValue, backgroundColor: theme.mode === 'dark' ? "#333" : "#fff" }]}>
      {projectDetails(project).map(({ label, value, icon }) => (
        <View key={label} style={styles.card}>
          <Icon name={icon} size={20} color={theme.mode === 'dark' ? "#fff" : "#000"} style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: theme.mode === 'dark' ? "#fff" : "#000" }]}>{label}</Text>
            <Text style={[styles.value, { color: theme.mode === 'dark' ? "#ddd" : "#333" }]}>{value}</Text>
          </View>
        </View>
      ))}
      <View style={styles.statusContainer}>
        <Text style={[styles.statusLabel, { color: theme.mode === 'dark' ? "#fff" : "#000" }]}>Status:</Text>
        <Text style={[styles.statusValue, { color: theme.mode === 'dark' ? "#007BFF" : "#007BFF" }]}>{project.status}</Text>
      </View>
      <TouchableOpacity
        style={[styles.updateButton, { backgroundColor: theme.mode === 'dark' ? "#555" : "#000" }]}
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
        style={[styles.callButton, { backgroundColor: theme.mode === 'dark' ? "#555" : "#000" }]}
        onPress={() => Linking.openURL(`tel:${project.contractor_phone}`)}
      >
        <Text style={styles.callButtonText}>Call Contractor</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.mode === 'dark' ? "#121212" : "#f9f9f9" }]}>
      <Text style={[styles.title, { color: theme.mode === 'dark' ? "#fff" : "#000" }]}>Active Projects</Text>
      <TextInput
        style={[
          styles.searchBar,
          {
            backgroundColor: theme.mode === 'dark' ? "#333" : "#fff",
            color: theme.mode === 'dark' ? "#fff" : "#000",
          },
        ]}
        placeholder="Search Projects..."
        placeholderTextColor={theme.mode === 'dark' ? "#fff" : "#aaa"}  // Set the placeholder color
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.project_Id}
        renderItem={({ item }) => <ProjectCard project={item} />}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.mode === 'dark' ? "#fff" : "#777" }]}>No active projects found.</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.mode === 'dark' ? "#333" : "#000" }]} onPress={() => navigation.goBack()}>
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
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
  },
  emptyText: { fontSize: 16, textAlign: "center", marginTop: 20 },
  separator: { height: 1, backgroundColor: "#ddd", marginVertical: 10 },
  projectCard: { padding: 15, marginBottom: 15, borderRadius: 10, elevation: 5 },
  card: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  icon: { marginRight: 15 },
  label: { fontWeight: "bold", fontSize: 16 },
  value: { fontSize: 14, flexWrap: "wrap", flex: 1 },
  statusContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  statusLabel: { fontWeight: "bold", fontSize: 16, marginRight: 5 },
  statusValue: { fontSize: 16 },
  backButton: { padding: 13, marginTop: 20, alignItems: "center", borderRadius: 10 },
  backButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  updateButton: { padding: 10, marginTop: 15, alignItems: "center", borderRadius: 10 },
  updateButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  callButton: { padding: 10, marginTop: 10, alignItems: "center", borderRadius: 10 },
  callButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});

export default WorkerActiveWorkScreen;
