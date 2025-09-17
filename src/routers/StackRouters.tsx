import React from "react";
import {
  createStackNavigator,
} from "@react-navigation/stack";
import SplashScreen from "../screens/AuthenticationScreens/SplashScreen";
import { S_AddNotesScreen, S_BottomTabsDashboard, S_CollectionListScreen, S_ForgotPasswordScreen, S_HistoryDetailScreen, S_LoginScreen, S_QRCodeScreen, S_SplashScreen, S_WorkSpaceScreen } from "../constant/screenNameConstants";
import LoginScreen from "../screens/AuthenticationScreens/LoginScreen";
import ForgotPasswordScreen from "../screens/AuthenticationScreens/ForgotPasswordScreen";
import { BottomTabDashboard } from "./BottomTabDashboard";
import AddNotesScreen from "../screens/DashboardScreens/AddNotesScreen";
import WorkSpaceScreen from "../screens/DashboardScreens/WorkSpaceScreen";
import CollectionListScreen from "../screens/DashboardScreens/CollectionListScreen";
import QRCodeScreen from "../screens/DashboardScreens/QRCodeScreen";
import HistoryDetailScreen from "../screens/DashboardScreens/HistoryScreen/HistoryDetailScreen";

const Stack = createStackNavigator();

export const StackRouters = () => {
    return (
      <Stack.Navigator
        screenOptions={{ gestureEnabled: false }}
        initialRouteName={S_SplashScreen}
      >
        <Stack.Screen name={S_SplashScreen} component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name={S_LoginScreen} component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name={S_ForgotPasswordScreen} component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name={S_BottomTabsDashboard} component={BottomTabDashboard} options={{ headerShown: false }} />
        <Stack.Screen name={S_HistoryDetailScreen} component={HistoryDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name={S_QRCodeScreen} component={QRCodeScreen} options={{ headerShown: false }} />
        <Stack.Screen name={S_AddNotesScreen} component={AddNotesScreen} options={{ headerShown: false }} />
        <Stack.Screen name={S_WorkSpaceScreen} component={WorkSpaceScreen} options={{ headerShown: false }} />
        <Stack.Screen name={S_CollectionListScreen} component={CollectionListScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  };