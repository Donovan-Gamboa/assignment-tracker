import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Checkbox from "expo-checkbox";
import { addAssignment } from "./src/database";
import { scheduleNotification } from "./src/notificationUtils";

const presetReminderOptions = [1, 2, 3];

const AddAssignmentScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedReminders, setSelectedReminders] = useState([]);
  const [customReminder, setCustomReminder] = useState("");

  const toggleReminder = (days) => {
    setSelectedReminders((prev) =>
      prev.includes(days) ? prev.filter((d) => d !== days) : [...prev, days]
    );
  };

  const addCustomReminder = () => {
    const num = parseInt(customReminder.trim(), 10);
    if (isNaN(num) || num <= 0) {
      Alert.alert("Invalid Input", "Enter a positive number of days.");
      return;
    }

    if (selectedReminders.includes(num)) {
      Alert.alert("Duplicate", `${num} days before is already selected.`);
      return;
    }

    setSelectedReminders((prev) => [...prev, num]);
    setCustomReminder("");
  };

  const handleAddAssignment = async () => {
    if (!name || !dueDate) {
      Alert.alert("Missing Fields", "Please enter both name and due date.");
      return;
    }

    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(dueDate);
    if (!isValidDate) {
      Alert.alert("Invalid Date Format", "Please use YYYY-MM-DD format.");
      return;
    }

    const trimmedDate = dueDate.trim();
    const due = new Date(trimmedDate);
    const now = new Date();

    const invalidReminders = selectedReminders.filter((daysBefore) => {
      const reminderDate = new Date(due);
      reminderDate.setDate(due.getDate() - daysBefore);
      reminderDate.setHours(9, 0, 0, 0);
      return reminderDate <= now;
    });

    if (invalidReminders.length > 0) {
      Alert.alert(
        "Invalid Reminder(s)",
        `These reminder(s) would trigger in the past: ${invalidReminders.join(
          ", "
        )} day(s) before. Please remove or adjust them.`
      );
      return;
    }

    try {
      await addAssignment(name, dueDate);

      for (const daysBefore of selectedReminders) {
        const reminderDate = new Date(due);
        reminderDate.setDate(due.getDate() - daysBefore);
        reminderDate.setHours(9, 0, 0, 0);

        await scheduleNotification(
          `Reminder: ${name}`,
          `Due in ${daysBefore} day(s) on ${dueDate}`,
          reminderDate
        );
      }

      // Clear form after submission
      setName("");
      setDueDate("");
      setSelectedReminders([]);

      navigation.goBack();
    } catch (error) {
      console.error("Failed to add assignment:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Add Assignment</Text>
          <TextInput
            placeholder="Assignment Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Due Date (YYYY-MM-DD)"
            value={dueDate}
            onChangeText={setDueDate}
            style={styles.input}
          />

          <Text style={styles.subtitle}>Remind me before:</Text>
          {presetReminderOptions.map((days) => (
            <View key={days} style={styles.checkboxContainer}>
              <Checkbox
                value={selectedReminders.includes(days)}
                onValueChange={() => toggleReminder(days)}
              />
              <Text style={styles.checkboxLabel}>{days} day(s) before</Text>
            </View>
          ))}

          <View style={styles.customReminderContainer}>
            <TextInput
              placeholder="Custom days before"
              keyboardType="numeric"
              value={customReminder}
              onChangeText={setCustomReminder}
              style={styles.inputSmall}
            />
            <Button title="Add" onPress={addCustomReminder} />
          </View>

          <Text style={styles.subtitle}>Selected Reminders:</Text>
          <View style={styles.reminderList}>
            {selectedReminders.length === 0 ? (
              <Text style={styles.emptyText}>None</Text>
            ) : (
              selectedReminders
                .sort((a, b) => a - b)
                .map((days) => (
                  <View key={days} style={styles.reminderChip}>
                    <Text style={styles.reminderText}>{days}d</Text>
                    <Text
                      style={styles.removeText}
                      onPress={() =>
                        setSelectedReminders((prev) =>
                          prev.filter((d) => d !== days)
                        )
                      }
                    >
                      ✕
                    </Text>
                  </View>
                ))
            )}
          </View>

          <Button title="Add Assignment" onPress={handleAddAssignment} />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 18, marginVertical: 10 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    borderRadius: 5,
  },
  inputSmall: {
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    flex: 1,
    borderRadius: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkboxLabel: { marginLeft: 8 },
  customReminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  selectedText: {
    marginBottom: 20,
    fontStyle: "italic",
    color: "#333",
  },
  reminderList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    gap: 10,
  },
  reminderChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEE",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  reminderText: {
    fontWeight: "500",
    color: "#333",
    marginRight: 6,
  },
  removeText: {
    color: "#888",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyText: {
    fontStyle: "italic",
    color: "#777",
  },
});

export default AddAssignmentScreen;
