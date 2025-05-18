import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Animated,
  SafeAreaView,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../RootNavigator";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "./Header";

type NavigationProps = NavigationProp<RootStackParamList, "PassCodeLoginScreen">;
type RouteProps = RouteProp<RootStackParamList, "PassCodeLoginScreen">;

const PassCodeLoginScreen = ({ navigation }: { navigation: NavigationProps }) => {
  const { theme } = useTheme();
  const route = useRoute<RouteProps>();
  const { aadhar } = route.params;

  const [passcode, setPasscode] = useState<string>("");
  const [errorShake] = useState(new Animated.Value(0));
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const triggerShake = () => {
    Vibration.vibrate(100);
    Animated.sequence([
      Animated.timing(errorShake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const showAlert = (message: string) => {
    if (Platform.OS === "android") {
      Alert.alert(message, "", [
        { text: "OK", style: "default" }
      ]);
    } else {
      Alert.alert(message);
    }
  };

  const validatePasscode = async () => {
    try {
      const response = await axios.post("http://192.168.129.119:5001/verify-passcode", {
        aadhar,
        passcode,
      });

      if (response.data.status === "OK") {
        const { token, role, firstName, lastName } = response.data;
        await AsyncStorage.setItem("authToken", token);

        const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();

        if (role === "Worker") {
          await AsyncStorage.setItem("workerName", fullName);
          navigation.navigate("WorkerHomeScreen" as never);
        } else if (role === "Contractor") {
          await AsyncStorage.setItem("contractorName", fullName);
          navigation.navigate("ContractorHomeScreen" as never);
        } else if (role === "Admin") {
          await AsyncStorage.setItem("adminName", fullName);
          navigation.navigate("AdminHomeScreen" as never);
        } else {
          showAlert("Unknown role detected");
        }
      } else {
        console.warn("Unexpected response:", response.data);
      }
    } catch (error: any) {
      triggerShake();
      handleReset();
      const errorMessage = error.response?.data?.error ?? "Something went wrong. Please try again.";
      showAlert(errorMessage);
    }
  };

  useEffect(() => {
    if (passcode.length === 4) {
      validatePasscode();
    }
  }, [passcode]);

  const handleKeyPress = (key: string) => {
    if (passcode.length < 4) {
      setPasscode((prev) => prev + key);
      setPressedKey(key);
      setTimeout(() => setPressedKey(null), 150);
    }
  };

  const handleBackspace = () => {
    setPasscode((prev) => prev.slice(0, -1));
    setPressedKey("←");
    setTimeout(() => setPressedKey(null), 150);
  };

  const handleReset = () => setPasscode("");

  const keypadLayout = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["", "0", "←"]];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header title="Verify Aadhar" />
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={[styles.promptText, { color: theme.text }]}>
            Enter Passcode
          </Text>
          <Animated.View style={[styles.dotsContainer, { transform: [{ translateX: errorShake }] }]}>
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index < passcode.length ? theme.primary : theme.inactiveDot || "#999",
                  },
                ]}
              />
            ))}
          </Animated.View>
        </View>

        <View style={styles.keypadContainer}>
          {keypadLayout.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((key, index) => {
                const isHighlighted = pressedKey === key;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.keypadKey,
                      isHighlighted && { backgroundColor: theme.primary },
                    ]}
                    onPress={() => {
                      if (key === "←") handleBackspace();
                      else if (key !== "") handleKeyPress(key);
                    }}
                    disabled={key === ""}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.keyText, { color: isHighlighted ? "#fff" : theme.text }]}>
                      {key}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={() => showAlert("Redirect to passcode recovery")}>
          <Text style={[styles.forgotText, { color: theme.primary }]}>Code forgotten?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  topContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  promptText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 30,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 50,
    gap: 25,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  keypadContainer: {
    marginBottom: 20,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  keypadKey: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: {
    fontSize: 30,
    fontWeight: "500",
  },
  forgotText: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 40,
  },
});

export default PassCodeLoginScreen;
