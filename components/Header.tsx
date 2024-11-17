import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, useRouter } from 'expo-router';
import BackButton from './BackButton';
import { hp } from '@/helpers/common';
import { theme } from '@/constants/theme';
import { useTheme } from 'react-native-paper';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  mb?: number;
}

const Header = ({ title, showBackButton = false, mb = 10 }: HeaderProps) => {
  const paperTheme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { marginBottom: mb }]}>
      {showBackButton && (
        <View style={styles.backButton}>
          <BackButton router={router} />
        </View>
      )}
      <Text
        style={[
          styles.title,
          {
            color: paperTheme.colors.onBackground,
          },
        ]}
      >
        {title || ''}
      </Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    gap: 10,
  },
  title: {
    fontSize: hp(2.7),
    // @ts-ignore
    fontWeight: theme.fonts.semibold,
  },
  textHeader: { fontSize: 42 },
  backButton: { position: 'absolute', left: 0 },
});
