import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Link, router, useRouter } from "expo-router";
import Icon from "../assets/icons";
import ScreenWrapper from "@/components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import BackButton from "@/components/BackButton";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";
import { useTheme as usePaperTheme } from "react-native-paper";
import * as Haptics from "expo-haptics";
import { translate } from "@/i18n";

const Login = () => {
  const paperTheme = usePaperTheme();
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Fields missing!");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    // cleared to run
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(false);

    if (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Login", error.message);
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      {/* <StatusBar style='dark' /> */}
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
            {translate("loginScreen:welcomeBack1")}
          </Text>
          <Text
            style={[
              styles.welcomeText,
              {
                color: paperTheme.colors.onBackground,
              },
            ]}
          >
            {translate("loginScreen:welcomeBack2")}
          </Text>
        </View>

        {/* form */}
        <View style={styles.form}>
          <Text
            style={{ fontSize: hp(1.5), color: paperTheme.colors.onBackground }}
          >
            {translate("loginScreen:pleaseLogin")}
          </Text>
          {/* @56:00 */}
          <Input
            icon={<Icon name="email" size={26} strokeWidth={1.6} />}
            placeholder={translate("common:emailInputPlaceholder")}
            onChangeText={(value: string) => (emailRef.current = value)}
          />
          <Input
            icon={<Icon name="lockPassword" size={26} strokeWidth={1.6} />}
            placeholder={translate("common:passwordInputPlaceholder")}
            secureTextEntry
            onChangeText={(value: string) => (passwordRef.current = value)}
          />
          <TouchableOpacity onPress={() => router.push("/forgotPassword")}>
            <Text
              style={[
                styles.forgotPassword,
                {
                  color: paperTheme.colors.onBackground,
                },
              ]}
            >
              {translate("common:forgotPassword")}
            </Text>
          </TouchableOpacity>

          <Button
            title={translate("common:login")}
            loading={loading}
            onPress={onSubmit}
          />
        </View>

        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              {
                color: paperTheme.colors.onBackground,
              },
            ]}
          >
            {translate("common:dontHaveAccount")}
          </Text>
          <Pressable onPress={() => router.push("/signUp")} hitSlop={18}>
            <Text
              style={[
                styles.footerText,
                // @ts-ignore
                {
                  color: paperTheme.colors.onBackground,
                  fontWeight: theme.fonts.semibold,
                },
              ]}
            >
              {translate("common:signUp")}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

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
    textAlign: "right",
    // @ts-ignore
    fontWeight: theme.fonts.semibold,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    fontSize: hp(1.6),
  },
});
