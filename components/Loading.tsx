import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { theme } from "@/constants/theme";
import { useTheme } from "react-native-paper";

// This is just the loading ICON--not the load screen
const Loading = ({
  size = "large",
  color,
}: {
  size?: number | "large" | "small" | undefined;
  color?: string;
}) => {
  const paperTheme = useTheme();

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator
        size={size}
        color={color ?? paperTheme.colors.primary}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  textHeader: { fontSize: 42 },
});
