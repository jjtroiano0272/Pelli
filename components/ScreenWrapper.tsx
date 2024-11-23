import { StyleSheet, Text, View } from "react-native";
import React, { ReactNode } from "react";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useTheme as usePaperTheme,
  useTheme,
  withTheme,
} from "react-native-paper";

// TODO Isn't this JSX.Element?
const ScreenWrapper = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();

  const paddingTop = top > 0 ? top + 5 : 30;

  return (
    <View
      style={{
        flex: 1,
        paddingTop,
        backgroundColor: theme.colors.background,
      }}
    >
      {children}
    </View>
  );
};

export default ScreenWrapper;
