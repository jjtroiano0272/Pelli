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
  uri: string;
  size?: number;
  rounded?: 14;
  style?: StyleProp<ImageStyle>;
}
const Avatar = ({
  uri,
  size = hp(4.5),
  rounded = 14,
  style = {},
}: AvatarProps) => {
  const theme = useTheme();

  useEffect(() => {
    console.log(
      `getUserImageSrc(uri): ${JSON.stringify(getUserImageSrc(uri), null, 2)}`
    );
  }, []);

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
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  textHeader: { fontSize: 42 },
  avatar: {
    borderCurve: "continuous",
    borderWidth: 1,
  },
});
