import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import React, { useEffect } from "react";
import { Link } from "expo-router";
import { hp } from "@/helpers/common";
import { Image } from "expo-image";
import { getUserImageSrc } from "@/services/imageService";
import { useTheme, withTheme } from "react-native-paper";

interface AvatarProps {
  uri: string | string[];
  size?: number;
  rounded?: number;
  style?: StyleProp<ImageStyle>;
  debug?: boolean;
}
const Avatar = ({
  uri,
  size = hp(4.5),
  rounded = 14,
  style = {},
  debug = false,
}: AvatarProps) => {
  const theme = useTheme();

  if (Array.isArray(uri)) {
    return (
      <Image
        source={getUserImageSrc(uri?.[0])}
        transition={100}
        style={[
          styles.avatar,
          {
            height: size,
            width: size,
            borderRadius: rounded,
            borderColor: theme.colors.outline,
          },
          style,
        ]}
      />
    );
  }

  if (debug) {
    return (
      <Image
        source={{ uri: uri as string }}
        transition={100}
        style={[
          styles.avatar,
          {
            height: size,
            width: size,
            borderRadius: rounded,
            borderColor: theme.colors.outline,
          },
          style,
        ]}
      />
    );
  }

  return (
    <Image
      source={!uri?.includes("dicebear") ? getUserImageSrc(uri) : { uri: uri }}
      transition={100}
      style={[
        styles.avatar,
        {
          height: size,
          width: size,
          borderRadius: rounded,
          borderColor: theme.colors.outline,
        },
        style,
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderCurve: "continuous",
    borderWidth: 1,
  },
});
