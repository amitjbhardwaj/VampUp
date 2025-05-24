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
import AdminAllocateFundsScreen from "./screen/admin/AdminAllocateFundsScreen";
import PassCodeScreen from "./screen/PassCodeScreen";
import ConfirmPassCodeScreen from "./screen/ConfirmPassCodeScreen";
import PassCodeLoginScreen from "./screen/PassCodeLoginScreen";
import VerifyAadharScreen from "./screen/VerifyAadharScreen";
import PaymentModeContractorScreen from "./screen/payment_contractor/PaymentModeContractorScreen";
import UPIPaymentContractorScreen from "./screen/payment_contractor/UPIPaymentContractorScreen";
import NetBankingPaymentContractorScreen from "./screen/payment_contractor/NetBankingPaymentContractorScreen";
import CreditCardPaymentContractorScreen from "./screen/payment_contractor/CreditCardPaymentContractorScreen";
import DebitCardPaymentContractorScreen from "./screen/payment_contractor/DebitCardPaymentContractorScreen";
import WalletsPaymentContractorScreen from "./screen/payment_contractor/WalletsPaymentContractorScreen";
import NEFTPaymentContractorScreen from "./screen/payment_contractor/NEFTPaymentContractorScreen";
import RTGSPaymentContractorScreen from "./screen/payment_contractor/RTGSPaymentContractorScreen";
import IMPSPaymentContractorScreen from "./screen/payment_contractor/IMPSPaymentContractorScreen";
import PaymentModeAdminScreen from "./screen/payment_admin/PaymentModeAdminScreen";
import UPIPaymentAdminScreen from "./screen/payment_admin/UPIPaymentAdminScreen";
import NetBankingPaymentAdminScreen from "./screen/payment_admin/NetBankingPaymentAdminScreen";
import IMPSPaymentAdminScreen from "./screen/payment_admin/IMPSPaymentAdminScreen";
import RTGSPaymentAdminScreen from "./screen/payment_admin/RTGSPaymentAdminScreen";
import NEFTPaymentAdminScreen from "./screen/payment_admin/NEFTPaymentAdminScreen";
import WalletsPaymentAdminScreen from "./screen/payment_admin/WalletsPaymentAdminScreen";
import DebitCardPaymentAdminScreen from "./screen/payment_admin/DebitCardPaymentAdminScreen";
import CreditCardPaymentAdminScreen from "./screen/payment_admin/CreditCardPaymentAdminScreen";
import PaymentSuccessContractorScreen from "./screen/payment_contractor/PaymentSuccessContractorScreen";
import PaymentSuccessAdminScreen from "./screen/payment_admin/PaymentSuccessAdminScreen";


export type RootStackParamList = {
    LoginScreen: undefined;
    Signup: undefined;
    ReportIssue: undefined;
    ForgotPasswordScreen: undefined;
    Otp: { userData: Record<string, string> };
    PassCodeLoginScreen: { aadhar: string };
    VerifyAadharScreen: undefined;

    PassCodeScreen: { userData: Record<string, string> };
    ConfirmPassCodeScreen: { userData: Record<string, string>, passcode: string };
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

    PaymentModeAdminScreen: { _id: string; projectId: string; fund: number; };
    UPIPaymentAdminScreen: { _id: string; projectId: string; fund: number; };
    NetBankingPaymentAdminScreen: { _id: string; projectId: string; fund: number; };
    DebitCardPaymentAdminScreen: { _id: string; projectId: string; fund: number; };
    CreditCardPaymentAdminScreen: { _id: string; projectId: string; fund: number; };
    WalletsPaymentAdminScreen:{ _id: string; projectId: string; fund: number; };
    NEFTPaymentAdminScreen: { _id: string; projectId: string; fund: number; };
    RTGSPaymentAdminScreen: { _id: string; projectId: string; fund: number; };
    IMPSPaymentAdminScreen: { _id: string; projectId: string; fund: number; };

    PaymentModeContractorScreen: { _id: string; projectId: string; fund: number; };
    UPIPaymentContractorScreen: { _id: string; projectId: string; fund: number; };
    NetBankingPaymentContractorScreen: { _id: string; projectId: string; fund: number; };
    DebitCardPaymentContractorScreen: { _id: string; projectId: string; fund: number; };
    CreditCardPaymentContractorScreen: { _id: string; projectId: string; fund: number; };
    WalletsPaymentContractorScreen:{ _id: string; projectId: string; fund: number; };
    NEFTPaymentContractorScreen: { _id: string; projectId: string; fund: number; };
    RTGSPaymentContractorScreen: { _id: string; projectId: string; fund: number; };
    IMPSPaymentContractorScreen: { _id: string; projectId: string; fund: number; };

    PaymentSuccessContractorScreen: { fund: number; name: string | null; };
    PaymentSuccessAdminScreen: { fund: number; name: string | null; };
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
    return (
        <ThemeProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
                    <Stack.Screen name="PassCodeLoginScreen" component={PassCodeLoginScreen} />
                    <Stack.Screen name="VerifyAadharScreen" component={VerifyAadharScreen} />
                    <Stack.Screen name="Otp" component={OtpScreen} />
                    <Stack.Screen name="RegistrationDone" component={RegistrationDoneScreen} />
                    <Stack.Screen name="RegistrationFailed" component={RegistrationFailedScreen} />
                    <Stack.Screen name="PasswordUpdatedScreen" component={PasswordUpdatedScreen} />
                    <Stack.Screen name="PersonalDetailsScreen" component={PersonalDetailsScreen} />

                    <Stack.Screen name="PassCodeScreen" component={PassCodeScreen} />
                    <Stack.Screen name="ConfirmPassCodeScreen" component={ConfirmPassCodeScreen} />


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


                    <Stack.Screen name="UPIPaymentContractorScreen" component={UPIPaymentContractorScreen} />
                    <Stack.Screen name="NetBankingPaymentContractorScreen" component={NetBankingPaymentContractorScreen} />
                    <Stack.Screen name="CreditCardPaymentContractorScreen" component={CreditCardPaymentContractorScreen} />
                    <Stack.Screen name="DebitCardPaymentContractorScreen" component={DebitCardPaymentContractorScreen} />
                    <Stack.Screen name="WalletsPaymentContractorScreen" component={WalletsPaymentContractorScreen} />
                    <Stack.Screen name="NEFTPaymentContractorScreen" component={NEFTPaymentContractorScreen} />
                    <Stack.Screen name="RTGSPaymentContractorScreen" component={RTGSPaymentContractorScreen} />
                    <Stack.Screen name="IMPSPaymentContractorScreen" component={IMPSPaymentContractorScreen} />


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
                    <Stack.Screen name="PaymentModeAdminScreen" component={PaymentModeAdminScreen} />
                    <Stack.Screen name="PaymentModeContractorScreen" component={PaymentModeContractorScreen} />
                    <Stack.Screen name="AdminAllocateFundsScreen" component={AdminAllocateFundsScreen} />


                    <Stack.Screen name="UPIPaymentAdminScreen" component={UPIPaymentAdminScreen} />
                    <Stack.Screen name="NetBankingPaymentAdminScreen" component={NetBankingPaymentAdminScreen} />
                    <Stack.Screen name="CreditCardPaymentAdminScreen" component={CreditCardPaymentAdminScreen} />
                    <Stack.Screen name="DebitCardPaymentAdminScreen" component={DebitCardPaymentAdminScreen} />
                    <Stack.Screen name="WalletsPaymentAdminScreen" component={WalletsPaymentAdminScreen} />
                    <Stack.Screen name="NEFTPaymentAdminScreen" component={NEFTPaymentAdminScreen} />
                    <Stack.Screen name="RTGSPaymentAdminScreen" component={RTGSPaymentAdminScreen} />
                    <Stack.Screen name="IMPSPaymentAdminScreen" component={IMPSPaymentAdminScreen} />


                    <Stack.Screen name="PaymentSuccessContractorScreen" component={PaymentSuccessContractorScreen} />
                    <Stack.Screen name="PaymentSuccessAdminScreen" component={PaymentSuccessAdminScreen} />

                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    );
};

export default RootNavigator;