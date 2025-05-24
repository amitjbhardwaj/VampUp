import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  TextInput,
  Animated,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { NavigationProp, useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { RootStackParamList } from "../../RootNavigator";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';  // Import Axios
import { useTheme } from "../../context/ThemeContext";
import Header from "../Header";

interface Project {
  project_Id: string;
  project_description: string;
  worker_name: string;
  project_start_date: string;
  project_end_date: string;
  contractor_phone: string;
  completion_percentage: number;
  status: string;
}

const WorkerActiveWorkScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchText, setSearchText] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [animatedValue] = useState(new Animated.Value(0));
  const [workerName, setWorkerName] = useState<string>("");

  // Fade-in animation for the screen
  const fadeIn = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Fetch worker's name from AsyncStorage or context
  useEffect(() => {
    const fetchWorkerName = async () => {
      const name = await AsyncStorage.getItem('workerName'); // Get worker name from AsyncStorage
      if (name) {
        setWorkerName(name);
      }
    };
    fetchWorkerName();
  }, []);

  // Fetch projects for the worker from the API
  const fetchProjects = useCallback(async () => {
    try {
      if (workerName) {
        const response = await axios.get(`http://192.168.129.119:5001/get-projects-by-worker`, {
          params: {
            worker_name: workerName,
            status: "In-Progress",  // You can modify the status based on your requirements
          }
        });

        // Check if the response is valid and contains data
        if (response.data && response.data.data) {
          const fetchedProjects = response.data.data.map((p: Project) => ({
            ...p,
            status: p.status || "In-Progress",
          }));

          // Filter out projects that are already completed
          setProjects(fetchedProjects.filter((p: Project) => p.completion_percentage < 100));
        } else {
          // Handle the case where no projects are returned
          setProjects([]);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // You can handle specific status codes here
        if (error.response?.status === 404) {
          // If 404 occurs, just set an empty list of projects without logging an error
          setProjects([]);
          //console.log("No projects found for this worker.");
        } else {
          console.error("Error fetching projects:", error.message);
        }
      } else {
        console.error("Error fetching projects:", error);
      }
    }
  }, [workerName]);


  useFocusEffect(
    useCallback(() => {
      fadeIn();
      fetchProjects();
    }, [workerName, fetchProjects])
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

      //console.log("Active Projects Saved:", activeProjects);
      //console.log("On-Hold Projects Saved:", onHoldProjects);

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
        style={[styles.updateButton, { backgroundColor: theme.primary }]}
        onPress={() =>
          navigation.navigate("WorkUpdateStatusScreen", {
            project,
            onUpdateCompletion: handleUpdateCompletion,
          })
        }
      >
        <Text style={[styles.updateButtonText, { color: theme.buttonText }]}>Update Status</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.callButton, { backgroundColor: theme.primary }]}
        onPress={() => Linking.openURL(`tel:${project.contractor_phone}`)}
      >
        <Text style={[styles.callButtonText, { color: theme.buttonText }]}>Call Contractor</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header title="All Projects" />

      <View style={[styles.container, { backgroundColor: theme.mode === 'dark' ? "#121212" : "#f9f9f9" }]}>
        <TextInput
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.mode === 'dark' ? "#333" : "#fff",
              color: theme.mode === 'dark' ? "#fff" : "#000",
            },
          ]}
          placeholder="Search Projects..."
          placeholderTextColor={theme.placeholderTextColor}
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
      </View>
    </SafeAreaView>
  );
};

const projectDetails = (project: Project) => [
  { label: "Project ID", value: project.project_Id, icon: "id-badge" },
  { label: "Description", value: project.project_description, icon: "info-circle" },
  { label: "Assigned To", value: project.worker_name, icon: "user" },
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
  updateButtonText: { fontWeight: "bold", fontSize: 16 },
  callButton: { padding: 10, marginTop: 10, alignItems: "center", borderRadius: 10 },
  callButtonText: { fontWeight: "bold", fontSize: 16 },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default WorkerActiveWorkScreen;
