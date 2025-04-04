import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screen/LoginScreen";
import SignupScreen from "./screen/SignupScreen";
import ForgotPasswordScreen from "./screen/ForgotPasswordScreen";
import OtpScreen from "./screen/OtpScreen";
import RegistrationDoneScreen from "./screen/RegistrationDoneScreen";
import RegistrationFailedScreen from "./screen/RegistrationFailedScreen";
import PasswordUpdatedScreen from "./screen/PasswordUpdatedScreen";
import WorkerHomeScreen from "./screen/WorkerHomeScreen";
import WorkerWorkHistoryScreen from "./screen/worker/WorkerWorkHistoryScreen";
import WorkerComplaintHistoryScreen from "./screen/worker/WorkerComplaintHistoryScreen";
import WorkerFullPaymentHistoryScreen from "./screen/worker/WorkerFullPaymentHistoryScreen";
import Home from "./tabs_worker/Home";
import WorkerActiveWorkScreen from "./screen/worker/WorkerActiveWorkScreen";
import WorkerNotificationScreen from "./screen/worker/WorkerNotificationScreen";
import WorkerSecurityAndPrivacyScreen from "./screen/worker/WorkerSecurityAndPrivacyScreen";
import AboutAppScreen from "./screen/AboutAppScreen";
import WorkerRequestPaymentScreen from "./screen/worker/WorkerRequestPaymentScreen";
import WorkerPaymentScreen from "./screen/worker/WorkerPaymentScreen";
import WorkerRequestHistoryScreen from "./screen/worker/WorkerRequestHistoryScreen";
import WorkerPaymentDetailsScreen from "./screen/worker/WorkerPaymentDetailsScreen";
import WorkerAttendanceHistoryScreen from "./screen/worker/WorkerAttendanceHistoryScreen";
import WorkerClockInScreen from "./screen/worker/WorkerClockInScreen";
import WorkerClockOutScreen from "./screen/worker/WorkerClockOutScreen";
import WorkUpdateStatusScreen from "./screen/worker/WorkUpdateStatusScreen";
import { ThemeProvider } from "./context/ThemeContext";
import ContractorHomeScreen from "./screen/ContractorHomeScreen";
import AdminHomeScreen from "./screen/AdminHomeScreen";
import ContractorActiveWorkScreen from "./screen/contractor/ContractorActiveWorkScreen";
import ContractorInitiatePaymentScreen from "./screen/contractor/ContractorInitiatePaymentScreen";
import ContractorOnHoldProjectsScreen from "./screen/contractor/ContractorOnHoldProjectsScreen";
import PersonalDetailsScreen from "./screen/PersonalDetailsScreen";
import AdminAddNewProjectScreen from "./screen/admin/AdminAddNewProjectScreen";
import AdminAllocateProjectScreen from "./screen/admin/AdminAllocateProjectScreen";
import AdminFindContractorScreen from "./screen/admin/AdminFindContractorScreen";
import ContractorAllWorkScreen from "./screen/contractor/ContractorAllWorkScreen";
import ContractorOnBoardWorkersScreen from "./screen/contractor/ContractorOnBoardWorkersScreen";
import AdminDocumentsScreen from "./screen/admin/AdminDocumentsScreen";
import AdminInitiatePaymentScreen from "./screen/admin/AdminInitiatePaymentScreen";
import AdminOngoingProjectsScreen from "./screen/admin/AdminOngoingProjectsScreen";
import AdminOnHoldProjectsScreen from "./screen/admin/AdminOnHoldProjectsScreen";
import AdminReviewProjectsScreen from "./screen/admin/AdminReviewProjectsScreen";
import AdminReviewRequestsScreen from "./screen/admin/AdminReviewRequestsScreen";
import ContractorCompletedProjectsScreen from "./screen/contractor/ContractorCompletedProjectsScreen";
import AdminApprovedProjectsScreen from "./screen/admin/AdminApprovedProjectsScreen";
import AdminRejectedProjectsScreen from "./screen/admin/AdminRejectedProjectsScreen";
import UPIPaymentScreen from "./screen/payment/UPIPaymentScreen";
import NetBankingPaymentScreen from "./screen/payment/NetBankingPaymentScreen";
import CreditCardPaymentScreen from "./screen/payment/CreditCardPaymentScreen";
import DebitCardPaymentScreen from "./screen/payment/DebitCardPaymentScreen";
import WalletsPaymentScreen from "./screen/payment/WalletsPaymentScreen";
import NEFTPaymentScreen from "./screen/payment/NEFTPaymentScreen";
import RTGSPaymentScreen from "./screen/payment/RTGSPaymentScreen";
import IMPSPaymentScreen from "./screen/payment/IMPSPaymentScreen";
import PaymentModeScreen from "./screen/payment/PaymentModeScreen";
import AdminAllocateFundsScreen from "./screen/admin/AdminAllocateFundsScreen";

export type RootStackParamList = {
    LoginScreen: undefined;
    Signup: undefined;
    ReportIssue: undefined;
    ForgotPassword: undefined;
    Otp: { userData: Record<string, string> };
    RegistrationDone: undefined;
    RegistrationFailed: undefined;
    PasswordUpdatedScreen: undefined;
    WorkerHomeScreen: undefined;
    WorkerActiveWorkScreen: undefined;
    WorkerPayment: { project: any };
    WorkerFullPaymentHistoryScreen: { project: any };
    WorkerWorkHistoryScreen: undefined;
    Home: { projectIds: string[] };
    WorkUpdateStatusScreen: {
        project: any;
        onUpdateCompletion: (projectId: string, newCompletion: number) => void;
    };
    WorkerNotificationScreen: undefined;
    PersonalDetailsScreen: { userData: Record<string, string> };
    WorkerSecurityAndPrivacyScreen: undefined;
    AboutAppScreen: undefined;
    WorkerRequestPaymentScreen: undefined;
    WorkerPaymentScreen: undefined;
    WorkerComplaintHistoryScreen: { updatedRequests: any[] };
    WorkerRequestHistoryScreen: undefined;
    WorkerPaymentDetailsScreen: { project: any };
    WorkerClockInScreen: undefined;
    WorkerClockOutScreen: undefined;
    WorkerAttendanceHistoryScreen: {
        project_Id: string;
        project_description: string;
        long_project_description: string;
        assigned_to: string;
        project_start_date: string;
        completion_percentage: number;
        date: string;
        login_time: string;
        logout_time: string;
        attendance_type: string;
    };

    ContractorHomeScreen: undefined;
    ContractorActiveWorkScreen: undefined;
    ContractorInitiatePaymentScreen: undefined;
    ContractorOnHoldProjectsScreen: undefined;
    ContractorOnBoardWorkersScreen: undefined;
    ContractorAllWorkScreen: undefined;
    ContractorCompletedProjectsScreen: undefined;


    AdminHomeScreen: undefined;
    AdminAddNewProjectScreen: undefined;
    AdminAllocateProjectScreen: undefined;
    AdminFindContractorScreen: { projectId: string };
    AdminDocumentsScreen: undefined;
    AdminInitiatePaymentScreen: undefined;
    AdminOngoingProjectsScreen: undefined;
    AdminOnHoldProjectsScreen: undefined;
    AdminReviewProjectsScreen: undefined;
    AdminReviewRequestsScreen: undefined;
    AdminApprovedProjectsScreen: undefined;
    AdminRejectedProjectsScreen: undefined;
    AdminAllocateFundsScreen: undefined;

    PaymentModeScreen: { projectId: string };
    UPIPaymentScreen: { projectId: string };
    NetBankingPaymentScreen: { projectId: string };
    DebitCardPaymentScreen: { projectId: string };
    CreditCardPaymentScreen: { projectId: string };
    WalletsPaymentScreen: { projectId: string };
    NEFTPaymentScreen: { projectId: string };
    RTGSPaymentScreen: { projectId: string };
    IMPSPaymentScreen: { projectId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
    return (
        <ThemeProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    <Stack.Screen name="Otp" component={OtpScreen} />
                    <Stack.Screen name="RegistrationDone" component={RegistrationDoneScreen} />
                    <Stack.Screen name="RegistrationFailed" component={RegistrationFailedScreen} />
                    <Stack.Screen name="PasswordUpdatedScreen" component={PasswordUpdatedScreen} />
                    <Stack.Screen name="PersonalDetailsScreen" component={PersonalDetailsScreen} />

                    <Stack.Screen name="WorkerHomeScreen" component={WorkerHomeScreen} />
                    <Stack.Screen name="WorkerWorkHistoryScreen" component={WorkerWorkHistoryScreen} />
                    <Stack.Screen name="WorkerComplaintHistoryScreen" component={WorkerComplaintHistoryScreen} />
                    <Stack.Screen name="WorkUpdateStatusScreen" component={WorkUpdateStatusScreen} />
                    <Stack.Screen name="WorkerFullPaymentHistoryScreen" component={WorkerFullPaymentHistoryScreen} />
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="WorkerActiveWorkScreen" component={WorkerActiveWorkScreen} />
                    <Stack.Screen name="WorkerNotificationScreen" component={WorkerNotificationScreen} />
                    <Stack.Screen name="WorkerSecurityAndPrivacyScreen" component={WorkerSecurityAndPrivacyScreen} />
                    <Stack.Screen name="AboutAppScreen" component={AboutAppScreen} />
                    <Stack.Screen name="WorkerRequestPaymentScreen" component={WorkerRequestPaymentScreen} />
                    <Stack.Screen name="WorkerPaymentScreen" component={WorkerPaymentScreen} />
                    <Stack.Screen name="WorkerRequestHistoryScreen" component={WorkerRequestHistoryScreen} />
                    <Stack.Screen name="WorkerPaymentDetailsScreen" component={WorkerPaymentDetailsScreen} />
                    <Stack.Screen name="WorkerClockInScreen" component={WorkerClockInScreen} />
                    <Stack.Screen name="WorkerClockOutScreen" component={WorkerClockOutScreen} />
                    <Stack.Screen name="WorkerAttendanceHistoryScreen" component={WorkerAttendanceHistoryScreen} />


                    <Stack.Screen name="ContractorHomeScreen" component={ContractorHomeScreen} />
                    <Stack.Screen name="ContractorActiveWorkScreen" component={ContractorActiveWorkScreen} />
                    <Stack.Screen name="ContractorInitiatePaymentScreen" component={ContractorInitiatePaymentScreen} />
                    <Stack.Screen name="ContractorOnHoldProjectsScreen" component={ContractorOnHoldProjectsScreen} />
                    <Stack.Screen name="ContractorOnBoardWorkersScreen" component={ContractorOnBoardWorkersScreen} />
                    <Stack.Screen name="ContractorAllWorkScreen" component={ContractorAllWorkScreen} />
                    <Stack.Screen name="ContractorCompletedProjectsScreen" component={ContractorCompletedProjectsScreen} />



                    <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} />
                    <Stack.Screen name="AdminAddNewProjectScreen" component={AdminAddNewProjectScreen} />
                    <Stack.Screen name="AdminAllocateProjectScreen" component={AdminAllocateProjectScreen} />
                    <Stack.Screen name="AdminFindContractorScreen" component={AdminFindContractorScreen} />
                    <Stack.Screen name="AdminDocumentsScreen" component={AdminDocumentsScreen} />
                    <Stack.Screen name="AdminInitiatePaymentScreen" component={AdminInitiatePaymentScreen} />
                    <Stack.Screen name="AdminOngoingProjectsScreen" component={AdminOngoingProjectsScreen} />
                    <Stack.Screen name="AdminOnHoldProjectsScreen" component={AdminOnHoldProjectsScreen} />
                    <Stack.Screen name="AdminReviewProjectsScreen" component={AdminReviewProjectsScreen} />
                    <Stack.Screen name="AdminReviewRequestsScreen" component={AdminReviewRequestsScreen} />
                    <Stack.Screen name="AdminApprovedProjectsScreen" component={AdminApprovedProjectsScreen} />
                    <Stack.Screen name="AdminRejectedProjectsScreen" component={AdminRejectedProjectsScreen} />
                    <Stack.Screen name="PaymentModeScreen" component={PaymentModeScreen} />
                    <Stack.Screen name="AdminAllocateFundsScreen" component={AdminAllocateFundsScreen} />


                    <Stack.Screen name="UPIPaymentScreen" component={UPIPaymentScreen} />
                    <Stack.Screen name="NetBankingPaymentScreen" component={NetBankingPaymentScreen} />
                    <Stack.Screen name="CreditCardPaymentScreen" component={CreditCardPaymentScreen} />
                    <Stack.Screen name="DebitCardPaymentScreen" component={DebitCardPaymentScreen} />
                    <Stack.Screen name="WalletsPaymentScreen" component={WalletsPaymentScreen} />
                    <Stack.Screen name="NEFTPaymentScreen" component={NEFTPaymentScreen} />
                    <Stack.Screen name="RTGSPaymentScreen" component={RTGSPaymentScreen} />
                    <Stack.Screen name="IMPSPaymentScreen" component={IMPSPaymentScreen} />


                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    );
};

export default RootNavigator;