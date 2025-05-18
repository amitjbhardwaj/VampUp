import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Animated,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../RootNavigator";
import { useTheme } from "../context/ThemeContext";
import Header from "./Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PassCodeScreenNavigationProp = NavigationProp<RootStackParamList, "PassCodeScreen">;
type PassCodeScreenProp = RouteProp<RootStackParamList, "PassCodeScreen">;

const PassCodeScreen = ({ navigation }: { navigation: PassCodeScreenNavigationProp }) => {
  const { theme } = useTheme();
  const route = useRoute<PassCodeScreenProp>();
  const { userData } = route.params;
  const [passcode, setPasscode] = useState<string>("");
  const [errorShake] = useState(new Animated.Value(0));
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(errorShake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    if (passcode.length === 4) {
      setTimeout(async () => {
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        navigation.navigate("ConfirmPassCodeScreen", { userData: userData, passcode });
      }, 150);
    }
  }, [passcode]);

  const handleKeyPress = (key: string) => {
    if (passcode.length < 4) {
      setPasscode(prev => prev + key);
    }

    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 200);
  };

  const handleBackspace = () => {
    setPasscode(prev => prev.slice(0, -1));
    setPressedKey("←");
    setTimeout(() => setPressedKey(null), 200);
  };

  const handleReset = () => {
    setPasscode("");
    triggerShake();
    Vibration.vibrate(100);
  };

  const renderDots = () => (
    <Animated.View style={[styles.dotsContainer, { transform: [{ translateX: errorShake }] }]}>
      {[0, 1, 2, 3].map(index => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index < passcode.length ? theme.primary : "#ccc",
            },
          ]}
        />
      ))}
    </Animated.View>
  );

  const keypadLayout = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["", "0", "←"]];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header title="Otp" />

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.topContainer}>
          <Text style={[styles.promptText, { color: theme.text }]}>Set Your Passcode</Text>
          {renderDots()}
          <TouchableOpacity onPress={handleReset}>
            <Text style={[styles.resetText, { color: theme.primary }]}>Reset</Text>
          </TouchableOpacity>
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
                      isHighlighted && {
                        backgroundColor: theme.primary,
                        transform: [{ scale: 1.25 }],
                      },
                    ]}
                    onPress={() => {
                      if (key === "←") handleBackspace();
                      else if (key !== "") handleKeyPress(key);
                    }}
                    disabled={key === ""}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.keyText,
                      { color: isHighlighted ? "#fff" : theme.text }
                    ]}>
                      {key}
                    </Text>
                  </TouchableOpacity>

                );
              })}
            </View>
          ))}
        </View>
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
    marginBottom: 12,
    gap: 18,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  resetText: {
    fontSize: 18,
    marginTop: 10,
  },
  resendText: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: "600",
  },
  countdownText: {
    fontSize: 14,
    marginTop: 10,
  },
  keypadContainer: {
    paddingBottom: 30,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  keypadKey: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: {
    fontSize: 26,
    fontWeight: "400",
  },
});

export default PassCodeScreen;
