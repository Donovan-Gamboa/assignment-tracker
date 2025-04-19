import React, { useEffect } from "react";
import 'expo-router/entry';
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "./OnboardingScreen";
import HomeScreen from "./HomeScreen";
import AddAssignmentScreen from "./AddAssignmentScreen";
import { setupDatabase } from "./src/database";
import { registerForPushNotificationsAsync } from "./src/notificationUtils";


const Stack = createStackNavigator();

export default function index() {
  useEffect(() => {
    setupDatabase(); // Initialize DB when app starts
    registerForPushNotificationsAsync();
  }, []);

  return (
    <Stack.Navigator initialRouteName="Onboarding">
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddAssignment" component={AddAssignmentScreen} options={{ title: "Add Assignment" }} />
    </Stack.Navigator>
  );
}
