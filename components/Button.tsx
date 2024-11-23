import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { myTheme } from "@/constants/theme";
import { hp } from "@/helpers/common";
import Loading from "./Loading";
import { useTheme, withTheme } from "react-native-paper";

type ButtonProps = {
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  title?: string;
  onPress: () => void;
  loading?: boolean;
  hasShadow?: boolean;
  disabled?: boolean;
};

const Button = ({
  buttonStyle,
  textStyle,
  title = "",
  onPress = () => {},
  loading = false,
  hasShadow = true,
  disabled = false,
}: ButtonProps) => {
  const theme = useTheme();
  const shadowStyle = {
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  };

  if (loading) {
    return (
      <View
        style={[
          styles.button,
          buttonStyle,
          {
            backgroundColor: theme.colors.background,
            borderRadius: myTheme.radius.xl,
          },
        ]}
      >
        <Loading />
      </View>
    );
  }
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        {
          borderRadius: myTheme.radius.xl,
          backgroundColor: disabled
            ? theme.colors.surfaceDisabled
            : theme.colors.primary,
        },
        buttonStyle,
        hasShadow && shadowStyle,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: theme.colors.onPrimary,
            fontWeight: "700",
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  textHeader: { fontSize: 42 },
  button: {
    height: hp(6.6),
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
  },
  text: {
    fontSize: hp(2.5),
  },
});
