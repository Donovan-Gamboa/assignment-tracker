import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import { useIsFocused } from "@react-navigation/native"; 
import { getAssignments, deleteOldAssignments } from "./src/database";

const HomeScreen = ({ navigation }) => {
  const [assignments, setAssignments] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const refreshData = async () => {
      if (isFocused) {
        await deleteOldAssignments(); // Optional: clean up old entries
        await fetchAssignments();
      }
    };
    refreshData();
  }, [isFocused]);

  const fetchAssignments = async () => {
    try {
      console.log("Fetching assignments...");
      const fetchedAssignments = await getAssignments();
      console.log("Assignments fetched:", fetchedAssignments);
      setAssignments(fetchedAssignments || []);
    } catch (error) {
      console.error("Error fetching assignments", error);
      setAssignments([]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assignments</Text>
      <Button title="Add Assignment" onPress={() => navigation.navigate("AddAssignment")} />
      {assignments.length === 0 ? (
        <Text>No assignments yet. Start adding them!</Text>
      ) : (
        <FlatList
          data={assignments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.assignment}>
              <Text style={styles.assignmentText}>
                {item.name} - Due: {item.due_date}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  assignment: { padding: 10, borderBottomWidth: 1, width: "100%" },
  assignmentText: { fontSize: 16 },
});

export default HomeScreen;
