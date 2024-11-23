import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";
import { useTheme, withTheme } from "react-native-paper";

// This is just the loading ICON--not the load screen
const Loading = ({
  size = "large",
  color,
}: {
  size?: number | "large" | "small" | undefined;
  color?: string;
}) => {
  const theme = useTheme();

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size={size} color={color ?? theme.colors.primary} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
