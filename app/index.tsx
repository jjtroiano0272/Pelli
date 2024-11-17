import { Button, LogBox, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Redirect, useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import Loading from "@/components/Loading";
// @ts-ignore
import AnimatedSplash from "react-native-animated-splash-screen";
import { getItem } from "@/utils/asyncStorage";
import { useTheme as usePaperTheme } from "react-native-paper";

const index = () => {
  const paperTheme = usePaperTheme();
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
        backgroundColor: paperTheme.colors.background,
      }}
    >
      <Loading />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  textHeader: { fontSize: 42 },
});
