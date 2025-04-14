import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { NavigationProp, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../RootNavigator";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import Header from "./Header";

type OtpScreenNavigationProp = NavigationProp<RootStackParamList>;
type OtpScreenRouteProp = RouteProp<RootStackParamList, "Otp">;

const OtpScreen = ({ route }: { route: OtpScreenRouteProp }) => {
  const { theme } = useTheme();
  const { userData } = route.params;
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const navigation = useNavigation<OtpScreenNavigationProp>();

  const handleOtpChange = (value: string) => {
    const regex = /^[0-9]*$/;
    if (regex.test(value)) {
      setOtp(value);
      setError("");
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
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        navigation.navigate("PassCodeScreen");
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    }
  };

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
     
      <LottieView
        source={require("../assets/phone-animation.json")}
        autoPlay
        loop={false}
        speed={0.8}
        style={styles.animation}
      />

      <Text style={[styles.title, { color: theme.text }]}>OTP Verification</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>
        Please enter the 6-digit code sent to your mobile.
      </Text>

      <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
        <Icon name="key" size={20} color={theme.iconColor} style={styles.icon} />
        <TextInput
          placeholder="Enter OTP"
          style={[
            styles.input,
            { color: theme.text },
            inputFocused && { borderColor: theme.primary, borderWidth: 1.5 },
          ]}
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
        <Animated.View style={styles.errorWrapper}>
          <Text style={[styles.errorText, { color: theme.errorText }]}>{error}</Text>
        </Animated.View>
      ) : null}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleOtpVerify}
      >
        <Icon name="lock" size={18} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  animation: {
    width: 160,
    height: 160,
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 20,
    textAlign: "center",
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    width: "100%",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    textAlign: "center",
  },
  errorWrapper: {
    marginBottom: 10,
    width: "100%",
  },
  errorText: {
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 15,
    marginTop: 10,
    width: "100%",
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default OtpScreen;
