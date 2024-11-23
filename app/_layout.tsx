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
  MD3LightTheme,
  MD3Theme,
  MD3DarkTheme,
} from "react-native-paper";
// import * as i18n from '@/i18n';
// import i18next from 'i18next';
import { initI18n } from "@/i18n";
// import AnimatedSplash from 'react-native-animated-splash-screen';
import { myTheme } from "@/constants/theme";
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

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      myOwnColor: string;
    }

    interface Theme {
      myOwnProperty: boolean;

      fontWeight: {
        medium: string;
        semibold: string;
        bold: string;
        extraBold: string;
      };

      radius: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
      };
    }
  }
}

const theme = {
  ...MD3LightTheme,
  ...MD3DarkTheme,
  // Specify custom property
  myOwnProperty: true,

  // Specify custom property in nested object
  colors: {
    ...MD3LightTheme.colors,
    ...MD3DarkTheme.colors,
    myOwnColor: "#BADA55",
  },

  // colors: {
  //   primary: '#00C26F',
  //   primaryDark: '#00AC62',
  //   dark: '#ЗЕЗЕЗЕ',
  //   darkLight: '#E1E1E1',
  //   gray: '#e3e3e3',
  //   // #44:00

  //   text: '#494949',
  //   textLight: '#7C7C7C',
  //   textDark: '#1D1D1D',

  //   rose: '#ef4444',
  //   roseLight: '#f87171',
  // },

  fontWeight: {
    medium: "500",
    semibold: "600",
    bold: "700",
    extraBold: "800",
  },

  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
  },
};

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
          borderTopLeftRadius: myTheme.radius.xxl,
          borderTopRightRadius: myTheme.radius.xxl,
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
