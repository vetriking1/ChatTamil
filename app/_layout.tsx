import React from "react";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";

const styles = StyleSheet.create({
  header: {
    backgroundColor: "4c00b0", // Change this to the color you prefer
  },
  headerTitle: {
    color: "black",
    // Change this to the color you prefer for the header text
  },
});

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "முகப்பு பக்கம்",
          headerStyle: styles.header,
          headerTintColor: styles.headerTitle.color,
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          title: "விவசாயி உரையாடல்",
          headerStyle: styles.header,
          headerTintColor: styles.headerTitle.color,
        }}
      />
      <Stack.Screen
        name="cropCheck"
        options={{
          title: "பயிர் ஆரோக்கியம் சோதனை",
          headerStyle: styles.header,
          headerTintColor: styles.headerTitle.color,
        }}
      />
    </Stack>
  );
}
