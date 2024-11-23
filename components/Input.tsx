import { StyleSheet, TextInput, View } from "react-native";
import React from "react";
import { hp } from "@/helpers/common";
import { Chip, useTheme, withTheme } from "react-native-paper";
import { myTheme } from "@/constants/theme";

const Input = (props: any, chipContent?: Client) => {
  const theme = useTheme();
  // const [showPassword, setShowPassword] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.outline,
          borderRadius: myTheme.radius.xxl,
        },
        props.containerStyle && props.containerStyle,
      ]}
    >
      {props.icon && props.icon}
      <TextInput
        style={{
          flex: 1,
          color: theme.colors.onBackground,
        }}
        placeholderTextColor={theme.colors.secondary}
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
      {chipContent && (
        <View
          style={
            {
              // position: "absolute",
            }
          }
        >
          <Chip
            onPress={() => console.log(`action to clear input`)}
            mode="flat"
            icon={"close"}
          >
            {chipContent?.first_name}
          </Chip>
        </View>
      )}
      {props.right && props.right}
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
    borderCurve: "continuous",
    paddingHorizontal: 18,
    gap: 12,
  },
  textHeader: { fontSize: 42 },
});
