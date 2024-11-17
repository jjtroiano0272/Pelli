import { StyleSheet, Text, View } from 'react-native';
import React, { ReactNode } from 'react';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme as usePaperTheme } from 'react-native-paper';

const ScreenWrapper = ({ children }: { children: ReactNode }) => {
  const { top } = useSafeAreaInsets();
  const paperTheme = usePaperTheme();
  const paddingTop = top > 0 ? top + 5 : 30;

  return (
    <View
      style={{
        flex: 1,
        paddingTop,
        backgroundColor: paperTheme.colors.background,
      }}
    >
      {children}
    </View>
  );
};

export default ScreenWrapper;
