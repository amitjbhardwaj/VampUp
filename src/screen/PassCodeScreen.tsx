import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Animated,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../RootNavigator";
import { useTheme } from "../context/ThemeContext";

type PassCodeScreenNavigationProp = NavigationProp<RootStackParamList, "PassCodeScreen">;

const PassCodeScreen = ({ navigation }: { navigation: PassCodeScreenNavigationProp }) => {
  const { theme } = useTheme();
  const [passcode, setPasscode] = useState<string>("");
  const [errorShake] = useState(new Animated.Value(0));

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(errorShake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleKeyPress = (key: string) => {
    if (passcode.length < 4) {
      setPasscode(prev => prev + key);
    }
  };

  const handleBackspace = () => {
    setPasscode(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (passcode.length === 4) {
      navigation.navigate("ConfirmPassCodeScreen", { passcode });
    } else {
      Vibration.vibrate(100);
      triggerShake();
    }
  };

  const renderDots = () => (
    <Animated.View style={[styles.dotsContainer, { transform: [{ translateX: errorShake }] }]}>
      {[0, 1, 2, 3].map(index => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index < passcode.length ? theme.primary : theme.inactiveDot || "#ccc",
              shadowColor: theme.primary,
            },
          ]}
        />
      ))}
    </Animated.View>
  );

  const keypadLayout = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["←", "0", "✓"]];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Set Your Passcode</Text>
      {renderDots()}
      <View style={styles.keypad}>
        {keypadLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map(key => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.key,
                  {
                    backgroundColor: theme.card,
                    shadowColor: theme.shadow || "#000",
                  },
                ]}
                onPress={() => {
                  if (key === "←") handleBackspace();
                  else if (key === "✓") handleSubmit();
                  else handleKeyPress(key);
                }}
                activeOpacity={0.6}
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
  title: { fontSize: 26, fontWeight: "600", marginBottom: 40 },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: 50,
    gap: 25,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    elevation: 4,
    shadowOpacity: 0.4,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 4,
  },
  keypad: {
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    width: "100%",
  },
  key: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 3,
  },
  keyText: {
    fontSize: 26,
    fontWeight: "bold",
  },
});

export default PassCodeScreen;
