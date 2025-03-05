import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screen/LoginScreen";
import SignupScreen from "./screen/SignupScreen";
import ReportIssueScreen from "./screen/ReportIssueScreen";
import ForgotPasswordScreen from "./screen/ForgotPasswordScreen";
import OtpScreen from "./screen/OtpScreen";
import RegistrationDoneScreen from "./screen/RegistrationDoneScreen";
import RegistrationFailedScreen from "./screen/RegistrationFailedScreen";
import PasswordUpdatedScreen from "./screen/PasswordUpdatedScreen";
import WorkerHomeScreen from "./screen/WorkerHomeScreen";
import WorkerActiveWorkScreen from "./screen/worker/WorkerActiveWorkScreen";
import WorkerWorkHistoryScreen from "./screen/worker/WorkerWorkHistoryScreen";
import WorkerPaymentScreen from "./screen/worker/WorkerPaymentScreen";
import WorkerComplaintHistoryScreen from "./screen/worker/WorkerComplaintHistoryScreen";

export type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    ReportIssue: undefined;
    ForgotPassword: undefined;
    Otp: undefined;
    RegistrationDone: undefined;
    RegistrationFailed: undefined;
    PasswordUpdatedScreen: undefined;
    WorkerHomeScreen: undefined;
    WorkerActiveWorkScreen: undefined;
    WorkerWorkHistoryScreen: undefined;
    WorkerPaymentScreen: undefined;
    WorkerComplaintHistoryScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="Otp" component={OtpScreen} />
                <Stack.Screen name="RegistrationDone" component={RegistrationDoneScreen} />
                <Stack.Screen name="RegistrationFailed" component={RegistrationFailedScreen} />
                <Stack.Screen name="PasswordUpdatedScreen" component={PasswordUpdatedScreen} />
                <Stack.Screen name="WorkerHomeScreen" component={WorkerHomeScreen} />
                <Stack.Screen name="WorkerActiveWorkScreen" component={WorkerActiveWorkScreen} />
                <Stack.Screen name="WorkerWorkHistoryScreen" component={WorkerWorkHistoryScreen} />
                <Stack.Screen name="WorkerPaymentScreen" component={WorkerPaymentScreen} />
                <Stack.Screen name="WorkerComplaintHistoryScreen" component={WorkerComplaintHistoryScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;