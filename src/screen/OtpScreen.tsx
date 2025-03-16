import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { NavigationProp, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../RootNavigator";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

type OtpScreenNavigationProp = NavigationProp<RootStackParamList>;
type OtpScreenRouteProp = RouteProp<RootStackParamList, "Otp">;

const OtpScreen = ({ route }: { route: OtpScreenRouteProp }) => {
  const { theme } = useTheme(); 
  const { userData } = route.params; // Get user data from params
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [inputFocused, setInputFocused] = useState(false);
  const navigation = useNavigation<OtpScreenNavigationProp>();

  const handleOtpChange = (value: string) => {
    const regex = /^[0-9]*$/;
    if (regex.test(value)) {
      setOtp(value);
      setError(""); // Clear error when input is valid
    }
  };

  const handleOtpVerify = async () => {
    if (!otp) {
      setError("OTP can't be empty");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    if (otp === "123456") {
      navigation.navigate("RegistrationFailed");
    } else {
      try {
        // Store user data in AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify(userData));

        // Navigate to RegistrationDoneScreen
        navigation.navigate("RegistrationDone");
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LottieView
        source={require("../assets/phone-animation.json")}
        autoPlay
        loop
        speed={0.5}
        style={styles.animation}
      />

      <Text style={[styles.title, { color: theme.text }]}>Enter OTP</Text>

      <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
        <Icon name="key" size={20} color={theme.iconColor} style={styles.icon} />
        <TextInput
          placeholder="Enter OTP"
          style={[styles.input, inputFocused && styles.inputFocused, { color: theme.text }]}
          keyboardType="numeric"
          maxLength={6}
          onChangeText={handleOtpChange}
          value={otp}
          placeholderTextColor={theme.placeholderTextColor}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
        />
      </View>

      {error ? (
        <Animated.View style={[styles.errorContainer, { opacity: inputFocused ? 0 : 1 }]}>
          <Text style={[styles.errorText, { color: theme.errorText }]}>{error}</Text>
        </Animated.View>
      ) : null}

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonBackground }]} onPress={handleOtpVerify}>
        <Icon name="lock" size={20} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}> Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,  // Ensure space for animation and title
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    elevation: 5,
    marginBottom: 15,
    width: "85%",
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    textAlign: "center",
  },
  inputFocused: {
    borderColor: "#4C9F70", // Green color when focused
    borderWidth: 2,
  },
  button: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 25,
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorContainer: {
    width: "85%",
    marginTop: 10,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  animation: {
    width: 180,
    height: 180,
    marginBottom: 40, // Adjust for a balanced layout
  },
});

export default OtpScreen;
