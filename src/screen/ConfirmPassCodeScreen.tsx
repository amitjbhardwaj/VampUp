import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from "react-native";
import { RouteProp, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../RootNavigator";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ConfirmPassCodeRouteProp = RouteProp<RootStackParamList, "ConfirmPassCodeScreen">;
type ConfirmPassCodeNavigationProp = NavigationProp<RootStackParamList, "ConfirmPassCodeScreen">;

const ConfirmPassCodeScreen = ({
  route,
  navigation,
}: {
  route: ConfirmPassCodeRouteProp;
  navigation: ConfirmPassCodeNavigationProp;
}) => {
  const { passcode } = route.params;
  const { theme } = useTheme();
  const [confirmCode, setConfirmCode] = useState("");
  const [error, setError] = useState("");

  const handleKeyPress = (key: string) => {
    if (confirmCode.length < 4) {
      setConfirmCode(prev => prev + key);
      setError("");
    }
  };

  const handleBackspace = () => {
    setConfirmCode(prev => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (confirmCode.length !== 4) {
      setError("Please enter a 4-digit passcode");
      Vibration.vibrate(100);
      return;
    }
  
    if (confirmCode !== passcode) {
      setError("Passcodes do not match");
      Vibration.vibrate(200);
  
      // Optional: clear the input after a short delay
      setTimeout(() => {
        setConfirmCode("");
        setError("");
      }, 1500);
  
      return;
    }
  
    try {
      await AsyncStorage.setItem("passcode", passcode);
      navigation.navigate("RegistrationDone");
    } catch (e) {
      console.error("Failed to save passcode", e);
      setError("Something went wrong. Please try again.");
    }
  };
  

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {[0, 1, 2, 3].map(index => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index < confirmCode.length ? theme.primary : "#ccc",
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const keypadLayout = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["←", "0", "✓"]];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Confirm Your Passcode</Text>
      {renderDots()}
      {error !== "" && <Text style={[styles.errorText, { color: theme.errorText }]}>{error}</Text>}

      <View style={styles.keypad}>
        {keypadLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map(key => (
              <TouchableOpacity
                key={key}
                style={[styles.key, { backgroundColor: theme.card }]}
                onPress={() => {
                  if (key === "←") {
                    handleBackspace();
                  } else if (key === "✓") {
                    handleSubmit();
                  } else {
                    handleKeyPress(key);
                  }
                }}
              >
                <Text style={[styles.keyText, { color: theme.text }]}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 40 },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: 40,
    gap: 20,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  keypad: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    width: "100%",
  },
  key: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  keyText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 14,
    marginBottom: 10,
  },
});

export default ConfirmPassCodeScreen;
