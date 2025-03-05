import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import SignupScreen from "./src/screen/SignupScreen";
import LoginScreen from "./src/screen/LoginScreen";
import RootNavigator from "./src/RootNavigator";

export type RootStackParamList = {
  Login : undefined;
  Signup : undefined;
}

function App(): React.JSX.Element {
const Stack = createStackNavigator<RootStackParamList>();
  return (
    <RootNavigator/>
  );
}

const styles = StyleSheet.create({});

export default App;
