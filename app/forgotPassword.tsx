import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import BackButton from "@/components/BackButton";
import { translate } from "@/i18n";
import { hp, wp } from "@/helpers/common";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Icon from "@/assets/icons";
import { supabase } from "@/lib/supabase";
import * as Haptics from "expo-haptics";
import { useTheme, withTheme } from "react-native-paper";
import { myTheme } from "@/constants/theme";

const ForgotPassword = () => {
  const theme = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const emailRef = useRef("");

  const onSubmit = async () => {
    if (!emailRef.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        translate("forgotPasswordScreen:title"),
        translate("forgotPasswordScreen:alerts.emailMissing")
      );
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      emailRef?.current
    );
    // Clear all input fields
    console.log(`data: ${JSON.stringify(data, null, 2)}`);
    setLoading(false);

    if (error) {
      Alert.alert(
        "Reset Password",
        "There was an error sending the password reset."
      );
      console.log(
        `onSubmitForgotPassword error: ${JSON.stringify(error, null, 2)}`
      );
    }
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        const newPassword = prompt(
          translate("forgotPasswordScreen:newPasswordPrompt")
        );
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        // on success
        if (data) {
          alert(translate("forgotPasswordScreen:passwordUpdateSuccess"));
          // log user in the same way we do with login.tsx
          let email = emailRef.current.trim();

          setLoading(true);
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password: newPassword,
          });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setLoading(false);
        }
        if (error) alert(translate("forgotPasswordScreen:passwordUpdateError"));
      }
    });
  }, []);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton router={router} />

        <View>
          <Text
            style={[
              styles.welcomeText,
              {
                color: theme.colors.onBackground,
                fontWeight: "700",
              },
            ]}
          >
            {translate("forgotPasswordScreen:title")}
          </Text>
        </View>

        {/* form */}
        <View style={styles.form}>
          <Input
            icon={<Icon name="email" size={26} strokeWidth={1.6} />}
            placeholder={translate("common:emailInputPlaceholder")}
            onChangeText={(value: string) => (emailRef.current = value)}
          />
          {/* <Input
            icon={<Icon name='lockPassword' size={26} strokeWidth={1.6} />}
            placeholder={translate('common:passwordInputPlaceholder')}
            secureTextEntry
            onChangeText={(value: string) => (passwordRef.current = value)}
          /> */}

          <Button
            title={translate("forgotPasswordScreen:sendReset")}
            loading={loading}
            onPress={onSubmit}
          />
        </View>

        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              {
                color: theme.colors.onBackground,
              },
            ]}
          >
            {translate("common:dontHaveAccount")}
          </Text>
          <Pressable onPress={() => router.push("/signUp")}>
            <Text
              style={[
                styles.footerText,
                // @ts-ignore
                {
                  color: theme.colors.onBackground,
                  fontWeight: "600",
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

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  textHeader: { fontSize: 42 },
  welcomeText: {
    fontSize: hp(4),
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: "right",
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
