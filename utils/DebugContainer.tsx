import { View, Text, ViewStyle } from "react-native";
import React from "react";
import { myTheme } from "@/constants/theme";
import { useTheme } from "react-native-paper";

interface Props {
  content: any;
  style?: ViewStyle;
  size?: number;
}

const DebugContainer = ({ content, style, size = 12 }: Props) => {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          // flex: 1,
          borderRadius: myTheme.radius.sm,
          backgroundColor: theme.colors.errorContainer,
          padding: myTheme.radius.sm,
          marginVertical: 20,
        },
        style,
      ]}
    >
      <Text style={{ color: theme.colors.error, fontSize: size }}>
        {JSON.stringify(content, null, 2)}
      </Text>
    </View>
  );
};

export default DebugContainer;
