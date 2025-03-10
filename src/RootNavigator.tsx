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
import WorkerWorkHistoryScreen from "./screen/worker/WorkerWorkHistoryScreen";
import WorkerComplaintHistoryScreen from "./screen/worker/WorkerComplaintHistoryScreen";
import WorkUpdateStatusScreen from "./screen/worker/WorkUpdateStatusScreen";
import WorkerFullPaymentHistoryScreen from "./screen/worker/WorkerFullPaymentHistoryScreen";
import Home from "./tabs/Home";
import WorkerActiveWorkScreen from "./screen/worker/WorkerActiveWorkScreen";
import WorkerNotificationScreen from "./screen/worker/WorkerNotificationScreen";
import WorkerPersonalDetailsScreen from "./screen/worker/WorkerPersonalDetailsScreen";
import WorkerSecurityAndPrivacyScreen from "./screen/worker/WorkerSecurityAndPrivacyScreen";
import AboutAppScreen from "./screen/AboutAppScreen";
import WorkerRequestPaymentScreen from "./screen/worker/WorkerRequestPaymentScreen";
import WorkerPaymentScreen from "./screen/worker/WorkerPaymentScreen";
import WorkerRequestHistoryScreen from "./screen/worker/WorkerRequestHistoryScreen";
import WorkerPaymentDetailsScreen from "./screen/worker/WorkerPaymentDetailsScreen";

export type RootStackParamList = {
    LoginScreen: undefined;
    Signup: undefined;
    ReportIssue: undefined;
    ForgotPassword: undefined;
    Otp: undefined;
    RegistrationDone: undefined;
    RegistrationFailed: undefined;
    PasswordUpdatedScreen: undefined;
    WorkerHomeScreen: undefined;
    WorkerActiveWorkScreen:  undefined;
    WorkerPayment: { project: any };
    WorkerFullPaymentHistoryScreen : { project: any };
    WorkerWorkHistoryScreen: undefined;
    Home: { projectIds: string[] };
    WorkUpdateStatusScreen : { project: any };
    WorkerNotificationScreen : undefined;
    WorkerPersonalDetailsScreen : undefined;
    WorkerSecurityAndPrivacyScreen : undefined;
    AboutAppScreen : undefined;
    WorkerRequestPaymentScreen : undefined;
    WorkerPaymentScreen : undefined;
    WorkerComplaintHistoryScreen: { updatedRequests: any[] };
    WorkerRequestHistoryScreen : { updatedRequests: any[] };
    WorkerPaymentDetailsScreen : { project: any };
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="Otp" component={OtpScreen} />
                <Stack.Screen name="RegistrationDone" component={RegistrationDoneScreen} />
                <Stack.Screen name="RegistrationFailed" component={RegistrationFailedScreen} />
                <Stack.Screen name="PasswordUpdatedScreen" component={PasswordUpdatedScreen} />
                <Stack.Screen name="WorkerHomeScreen" component={WorkerHomeScreen} />
                <Stack.Screen name="WorkerWorkHistoryScreen" component={WorkerWorkHistoryScreen} />
                <Stack.Screen name="WorkerComplaintHistoryScreen" component={WorkerComplaintHistoryScreen} />
                <Stack.Screen name="WorkUpdateStatusScreen" component={WorkUpdateStatusScreen} /> 
                <Stack.Screen name="WorkerFullPaymentHistoryScreen" component={WorkerFullPaymentHistoryScreen} />
                <Stack.Screen name="Home" component={Home} /> 
                <Stack.Screen name="WorkerActiveWorkScreen" component={WorkerActiveWorkScreen}/>

                <Stack.Screen name="WorkerNotificationScreen" component={WorkerNotificationScreen} /> 
                <Stack.Screen name="WorkerPersonalDetailsScreen" component={WorkerPersonalDetailsScreen} /> 
                <Stack.Screen name="WorkerSecurityAndPrivacyScreen" component={WorkerSecurityAndPrivacyScreen} /> 
                <Stack.Screen name="AboutAppScreen" component={AboutAppScreen} />
                <Stack.Screen name="WorkerRequestPaymentScreen" component={WorkerRequestPaymentScreen} /> 
                <Stack.Screen name="WorkerPaymentScreen" component={WorkerPaymentScreen} />
                <Stack.Screen name="WorkerRequestHistoryScreen" component={WorkerRequestHistoryScreen} /> 
                <Stack.Screen name="WorkerPaymentDetailsScreen" component={WorkerPaymentDetailsScreen} /> 
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;