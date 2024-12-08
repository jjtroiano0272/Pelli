import { View, Text, ViewStyle } from "react-native";
import React from "react";
import { myTheme } from "@/constants/theme";
import { useTheme } from "react-native-paper";

interface Props {
  title: string;
  content: any;
  style?: ViewStyle;
  size?: number;
}

const DebugContainer = ({ title, content, style, size = 12 }: Props) => {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          // flex: 1,
          borderRadius: myTheme.radius.sm,
          padding: myTheme.radius.sm,
          marginVertical: 20,
          backgroundColor: theme.colors.errorContainer,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: theme.colors.error,
          fontSize: size * 1.6,
          fontWeight: "bold",
        }}
      >
        {title} ({typeof content})
      </Text>

      <Text style={{ color: theme.colors.error, fontSize: size }}>
        {JSON.stringify(content, null, 2)}
      </Text>
    </View>
  );
};

export default DebugContainer;
