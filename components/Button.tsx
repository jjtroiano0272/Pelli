import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { theme } from '@/constants/theme';
import { hp } from '@/helpers/common';
import Loading from './Loading';
import { useTheme as usePaperTheme } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

type ButtonProps = {
  // age?: number
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<ViewStyle>;
  title?: string;
  onPress: () => void;
  loading?: boolean;
  hasShadow?: boolean;
  disabled?: boolean;
};

const Button = ({
  buttonStyle,
  textStyle,
  title = '',
  onPress = () => {},
  loading = false,
  hasShadow = true,
  disabled = false,
}: ButtonProps) => {
  const paperTheme = usePaperTheme();
  const shadowStyle = {
    shadowColor: paperTheme.colors.shadow,
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
          { backgroundColor: paperTheme.colors.background },
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
          backgroundColor: disabled
            ? paperTheme.colors.surfaceDisabled
            : paperTheme.colors.primary,
        },
        buttonStyle,
        hasShadow && shadowStyle,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: paperTheme.colors.onPrimary,
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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textHeader: { fontSize: 42 },
  button: {
    height: hp(6.6),
    justifyContent: 'center',
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: theme.radius.xl,
  },
  text: {
    fontSize: hp(2.5),
    // @ts-ignore
    fontWeight: theme.fonts.bold,
  },
});
