import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Handle notification behavior (optional)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Ask for permissions and get token
export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for notifications!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Notification token:", token);
  } else {
    alert("Must use physical device for push notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
};

// Schedule notification (e.g., 2 days before)
export const scheduleNotification = async (title, body, triggerDate) => {
  console.log("Scheduling notification:");
  console.log("→ Title:", title);
  console.log("→ Body:", body);
  console.log("→ Trigger Date:", triggerDate.toISOString());

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: triggerDate,
    });
    console.log("✅ Notification scheduled with ID:", id);
    return id;
  } catch (err) {
    console.error("❌ Failed to schedule notification:", err);
  }
};

