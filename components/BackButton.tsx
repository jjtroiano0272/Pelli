import { Pressable, StyleSheet } from "react-native";
import React from "react";
import Icon from "@/assets/icons";
import { useTheme, withTheme } from "react-native-paper";
import { myTheme } from "@/constants/theme";

const BackButton = ({ size = 26, router }: any) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => router.back()}
      style={[
        styles.button,
        {
          // backgroundColor: paperTheme.colors.primary,
          borderRadius: myTheme.radius.sm,
        },
      ]}
    >
      <Icon
        name="arrowLeft"
        strokeWidth={1.6}
        size={size}
        color={theme.colors.onBackground}
      />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  textHeader: { fontSize: 42 },
  button: {
    alignSelf: "flex-start",
    padding: 5,
  },
});
