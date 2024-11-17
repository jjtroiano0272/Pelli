import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import { theme } from "@/constants/theme";
import { hp } from "@/helpers/common";
import {
  useTheme,
  TextInput as PaperInput,
  Chip as PaperChip,
} from "react-native-paper";
import { Chip as MaterialChip } from "@react-native-material/core";

const Input = (props: any, withChip = false) => {
  const paperTheme = useTheme();
  // const [showPassword, setShowPassword] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: paperTheme.colors.outline,
        },
        props.containerStyle && props.containerStyle,
      ]}
    >
      {props.icon && props.icon}
      <TextInput
        style={{ flex: 1, color: paperTheme.colors.onBackground }}
        placeholderTextColor={paperTheme.colors.secondary}
        ref={props.inputRef && props.inputRef}
        autoCapitalize="sentences"
        hitSlop={{
          bottom: 20,
          top: 20,
          left: 20,
          right: 20,
        }}
        // secureTextEntry={!showPassword}

        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: hp(7.2),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.4,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    paddingHorizontal: 18,
    gap: 12,
  },
  textHeader: { fontSize: 42 },
});
