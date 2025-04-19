import { openDatabaseAsync } from "expo-sqlite";

let dbPromise = null;

const getDb = async () => {
  if (!dbPromise) {
    dbPromise = openDatabaseAsync("assignments.db");
  }
  return dbPromise;
};

export const setupDatabase = async () => {
  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      due_date TEXT NOT NULL
    );
  `);
  console.log("Database setup completed!");
};

export const addAssignment = async (name, due_date) => {
  const db = await getDb();
  console.log("Adding Assignment:", name, due_date);
  await db.runAsync("INSERT INTO assignments (name, due_date) VALUES (?, ?)", [name, due_date]);
  console.log("Assignment added successfully!");
};

export const getAssignments = async () => {
  const db = await getDb();
  const rows = await db.getAllAsync("SELECT * FROM assignments");
  console.log("Fetched assignments:", rows);
  return rows || [];
};

export const deleteOldAssignments = async () => {
  const db = await getDb();
  await db.execAsync(`DELETE FROM assignments WHERE due_date < date('now');`);
  console.log("Old assignments deleted");
};
