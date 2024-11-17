import { LogBox, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Redirect, Slot, useRouter } from "expo-router";
import { Stack } from "expo-router/stack";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/services/userService";
import {
  PaperProvider as PaperThemeProvider,
  useTheme as usePaperTheme,
} from "react-native-paper";
// import * as i18n from '@/i18n';
// import i18next from 'i18next';
import { initI18n } from "@/i18n";
// import AnimatedSplash from 'react-native-animated-splash-screen';
import { theme } from "@/constants/theme";
import { getItem } from "@/utils/asyncStorage";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

/* 
 ERROR  Warning: TNodeChildrenRenderer: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead. */
LogBox.ignoreLogs([
  "Warning: TNodeChildrenRenderer",
  "Warning: MemoizedTNodeRenderer",
  "Warning: TRenderEngineProvider",
]);

const _layout = () => {
  return (
    <AuthProvider>
      <PaperThemeProvider>
        <MainLayout />
      </PaperThemeProvider>
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);
  const paperTheme = usePaperTheme();
  const [showOnboarding, setShowOnboarding] = useState<boolean | number | null>(
    null
  );

  useEffect(() => {
    initI18n().then(() => setIsI18nInitialized(true));
    // .then(() => loadDateFnsLocale());
  }, []);

  // useEffect(() => {
  //   const checkIfAlreadyOnboarded = async () => {
  //     let onboarded = await getItem("onboarded");
  //     setShowOnboarding(onboarded === "1" ? false : true);
  //   };
  //   checkIfAlreadyOnboarded();
  // }, []);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_auth, session) => {
      console.log(`_auth: ${JSON.stringify(_auth, null, 2)}`);
      console.log(`session: ${JSON.stringify(session, null, 2)}`);

      if (session && session?.user?.email) {
        setAuth(session?.user);
        updateUserData(session?.user, session?.user?.email);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    });
  }, []);

  useEffect(() => {
    console.log(`showOnboarding: ${JSON.stringify(showOnboarding, null, 2)}`);
    // if (showOnboarding) router.replace("/onboarding");
  }, [showOnboarding]);

  const updateUserData = async (user: Record<string, any>, email: string) => {
    let res = await getUserData(user?.id);

    if (res.success) setUserData({ ...res.data, email });
  };

  if (showOnboarding == null) {
    console.log(`Null here....`);

    // return (
    //   <View style={{ justifyContent: "center", alignItems: "center" }}>
    //     <Text style={{ fontSize: 76 }}>null</Text>
    //   </View>
    // );
  }

  const ModalHandle = () => {
    return (
      // For both backgroundColors, the extra wite background that pops up behind eveyrthing is NOT affecte dby thi
      <View
        style={{
          height: 50,
          top: 25,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: paperTheme.colors.background, // Match your modal's background color
          borderTopLeftRadius: theme.radius.xxl,
          borderTopRightRadius: theme.radius.xxl,
        }}
      >
        <View
          style={{
            width: 60, // Adjust the width as needed
            height: 4, // Adjust the height as needed
            backgroundColor: paperTheme.colors.onSurfaceDisabled, // Modal handle color
            borderRadius: 2, // Adjust the border radius as needed
          }}
        />
      </View>
    );
  };

  return (
    <Stack
      screenOptions={{ headerShown: false }}
      // key={showOnboarding ? "onboarding" : "welcome"}
      // initialRouteName={showOnboarding ? "onboarding" : "welcome"}
    >
      <Stack.Screen
        name="(main)/postDetails"
        options={{
          presentation: "modal",
          headerShown: true,
          header: () => <ModalHandle />,

          // statusBarBackgroundColor: "red",
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
      <Stack.Screen
        name="(main)/reportPost"
        options={{
          presentation: "modal",
          headerShown: true,
          header: () => <ModalHandle />,
        }}
      />
      <Stack.Screen
        name="(main)/mediaCapture"
        options={{
          presentation: "modal",
          headerShown: true,
          header: () => <ModalHandle />,
        }}
      />

      {/* TODO */}
      {/* <Stack.Screen
          name='(main)/confirmDeleteAccount'
          options={{ presentation: 'modal' }}
        /> */}
    </Stack>
  );
};

export default _layout;
