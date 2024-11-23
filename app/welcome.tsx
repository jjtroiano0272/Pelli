import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { wp, hp } from "../helpers/common";
import Button from "@/components/Button";
import { Button as PaperButton, withTheme, useTheme } from "react-native-paper";
import { translate } from "@/i18n";
import { removeItem } from "@/utils/asyncStorage";

const Welcome = () => {
  const theme = useTheme();
  const router = useRouter();
  const handleReset = async () => {
    await removeItem("onboarded");
    router.replace("/onboarding");
  };

  return (
    <ScreenWrapper>
      {/* <StatusBar style='dark' /> */}
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/strands-logo-2-circle-transparent.png")}
          style={styles.welcomeImage}
          resizeMode="contain"
        />

        {/* title */}
        <View style={{ gap: 20 }}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.onBackground,
              },
            ]}
          >
            {translate("common:appName")}
          </Text>
          <Text
            style={[
              styles.punchline,
              {
                color: theme.colors.onBackground,
              },
            ]}
          >
            {translate("welcomeScreen:missionStatement")}
          </Text>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Button
            title={translate("welcomeScreen:gettingStarted")}
            buttonStyle={{ marginHorizontal: wp(3) }}
            onPress={() => router.push("/signUp")}
          />
          <View style={styles.bottomTextContainer}>
            <Text
              style={[
                styles.loginText,
                {
                  color: theme.colors.onBackground,
                },
              ]}
            >
              {translate("common:alreadyHaveAccount")}
            </Text>
            <Pressable onPress={() => router.push("/login")} hitSlop={18}>
              <Text
                style={[
                  styles.loginText,
                  // @ts-ignore
                  {
                    color: theme.colors.onBackground,
                    fontWeight: "600",
                  },
                ]}
              >
                {translate("common:loginText")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    // backgroundColor: '#fff',
    paddingHorizontal: wp(4),
  },
  textHeader: { fontSize: 42 },
  welcomeImage: { height: hp(30), width: wp(100), alignSelf: "center" },
  title: {
    fontSize: hp(4),
    textAlign: "center",
    // theme.fontWeight.extraBold
    fontWeight: "800",
  },
  punchline: {
    textAlign: "center",
    paddingHorizontal: wp(10),
    fontSize: hp(1.7),
  },
  footer: { gap: 30, width: "100%" },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  loginText: {
    textAlign: "center",
    fontSize: hp(1.6),
  },
});
