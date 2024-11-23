import { Button, LogBox, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Redirect, useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import Loading from "@/components/Loading";
// @ts-ignore
import AnimatedSplash from "react-native-animated-splash-screen";
import { getItem } from "@/utils/asyncStorage";
import {
  useTheme as usePaperTheme,
  useTheme,
  withTheme,
} from "react-native-paper";
import { myTheme } from "@/constants/theme";

const index = () => {
  const theme = useTheme();
  const [showOnboarding, setShowOnboarding] = useState<boolean | number | null>(
    null
  );

  useEffect(() => {
    const checkIfAlreadyOnboarded = async () => {
      let onboarded = await getItem("onboarded");
      setShowOnboarding(onboarded === "1" ? false : true);
    };
    checkIfAlreadyOnboarded();
  }, []);

  // if (showOnboarding) {
  //   return <Redirect href="/onboarding" />;
  // }

  return (
    // {/* TODO Change to a really fancy intricate loading spinner */}
    // {/* Shows loading screen by default, otherwise redirects to /home or /welcome */}
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <Loading />
    </View>
  );
};

export default index;
