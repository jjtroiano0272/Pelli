import type { StyleProp } from 'react-native';
import { colors as colorsLight } from '@/constants/theme';
import { colorsDark } from '@/constants/theme';

export type ThemeContexts = 'light' | 'dark' | undefined;

export type Colors = typeof colorsLight | typeof colorsDark;

export interface Theme {
  colors: Colors;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: colorsLight,
  isDark: false,
};
export const darkTheme: Theme = {
  colors: colorsDark,
  isDark: true,
};

export type ThemedStyle<T> = (theme: Theme) => T;
export type ThemedStyleArray<T> = (
  | ThemedStyle<T>
  | StyleProp<T>
  | (StyleProp<T> | ThemedStyle<T>)[]
)[];

export { colorsLight as colors };
export { colorsDark };

// export * from './styles';
