import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import Icon from '@/assets/icons';
import { theme } from '@/constants/theme';
import { useTheme as usePaperTheme } from 'react-native-paper';

const BackButton = ({ size = 26, router }: any) => {
  const paperTheme = usePaperTheme();

  return (
    <Pressable
      onPress={() => router.back()}
      style={[
        styles.button,
        {
          // backgroundColor: paperTheme.colors.primary,
        },
      ]}
    >
      <Icon
        name='arrowLeft'
        strokeWidth={1.6}
        size={size}
        color={paperTheme.colors.onBackground}
      />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  textHeader: { fontSize: 42 },
  button: {
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: theme.radius.sm,
  },
});
