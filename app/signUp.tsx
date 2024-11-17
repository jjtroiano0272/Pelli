import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Link, router, useRouter } from 'expo-router';
import Icon from '../assets/icons';
import ScreenWrapper from '@/components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar';
import BackButton from '@/components/BackButton';
import { hp, wp } from '@/helpers/common';
import { theme } from '@/constants/theme';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';
import { useTheme as usePaperTheme } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { translate } from '@/i18n';

const SignUp = () => {
  const paperTheme = usePaperTheme();
  const router = useRouter();
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const nameRef = useRef('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    // signUpScreen.title
    // signUpScreen.alerts.fieldsMissing
    if (!emailRef.current || !passwordRef.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        translate('signUpScreen:title'),
        translate('signUpScreen:alerts.fieldsMissing')
      );
    }

    // cleared to run
    let name = nameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(false);

    console.log(`session: ${JSON.stringify(session, null, 2)}`);
    console.log(`error: ${JSON.stringify(error, null, 2)}`);

    // signUpScreen.title
    if (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (error.code != 'anonymous_provider_disabled') {
        Alert.alert(translate('signUpScreen:title'), error.message);
      }
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton router={router} />

        <View>
          <Text
            style={[
              styles.welcomeText,
              {
                color: paperTheme.colors.onBackground,
              },
            ]}
          >
            {translate('signUpScreen:getStarted')}
          </Text>
        </View>

        {/* form */}
        <View style={styles.form}>
          <Text
            style={{ fontSize: hp(1.5), color: paperTheme.colors.onBackground }}
          >
            {translate('signUpScreen:formPrompt')}
          </Text>
          <Input
            icon={<Icon name='user' size={26} strokeWidth={1.6} />}
            placeholder={translate('common:nameInputPlaceholder')}
            onChangeText={(value: string) => (nameRef.current = value)}
          />
          <Input
            icon={<Icon name='email' size={26} strokeWidth={1.6} />}
            placeholder={translate('common:emailInputPlaceholder')}
            onChangeText={(value: string) => (emailRef.current = value)}
          />
          <Input
            icon={<Icon name='lockPassword' size={26} strokeWidth={1.6} />}
            placeholder={translate('common:passwordInputPlaceholder')}
            secureTextEntry
            onChangeText={(value: string) => (passwordRef.current = value)}
          />
          <TouchableOpacity onPress={() => router.push('/forgotPassword')}>
            <Text
              style={[
                styles.forgotPassword,
                {
                  color: paperTheme.colors.secondary,
                },
              ]}
            >
              {translate('common:forgotPassword')}
            </Text>
          </TouchableOpacity>
          <Button
            title={translate('signUpScreen:title')}
            loading={loading}
            onPress={onSubmit}
          />
        </View>

        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              {
                color: paperTheme.colors.secondary,
              },
            ]}
          >
            {translate('common:alreadyHaveAccount')}
          </Text>
          <Pressable onPress={() => router.push('/login')} hitSlop={18}>
            <Text
              style={[
                styles.footerText,
                // @ts-ignore
                {
                  color: paperTheme.colors.secondary,
                  fontWeight: theme.fonts.semibold,
                },
              ]}
            >
              {translate('common:login')}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  textHeader: { fontSize: 42 },
  welcomeText: {
    fontSize: hp(4),
    // @ts-ignore
    fontWeight: theme.fonts.bold,
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: 'right',
    // @ts-ignore
    fontWeight: theme.fonts.semibold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    textAlign: 'center',
    fontSize: hp(1.6),
  },
});
