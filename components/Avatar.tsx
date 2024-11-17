import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { hp } from '@/helpers/common';
import { theme } from '@/constants/theme';
import { Image } from 'expo-image';
import { getUserImageSrc } from '@/services/imageService';
import { useTheme as usePaperTheme } from 'react-native-paper';

const Avatar = ({
  uri,
  size = hp(4.5),
  rounded = theme.radius.md,
  style = {},
}: any) => {
  const paperTheme = usePaperTheme();

  return (
    <Image
      source={!uri?.includes('dicebear') ? getUserImageSrc(uri) : { uri: uri }}
      transition={100}
      style={[
        styles.avatar,
        {
          height: size,
          width: size,
          borderRadius: rounded,
          borderColor: paperTheme.colors.outline,
        },
        style,
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textHeader: { fontSize: 42 },
  avatar: {
    borderCurve: 'continuous',
    borderWidth: 1,
  },
});
