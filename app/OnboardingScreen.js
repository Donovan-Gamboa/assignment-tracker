import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const OnboardingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Assignment Tracker</Text>
      <Text style={styles.subtitle}>
        Let's set up your class schedule and notification preferences.
      </Text>
      <Button title="Get Started" onPress={() => navigation.replace("Home")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
});

export default OnboardingScreen;
