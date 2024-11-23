import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect } from "react";
import { Link, useNavigation, useRouter } from "expo-router";
import Onboarding from "react-native-onboarding-swiper";
import Lottie from "lottie-react-native";
import LottieView from "lottie-react-native";
import { hp, wp } from "@/helpers/common";
import { translate } from "@/i18n";
import { getItem, setItem } from "@/utils/asyncStorage";
import { myTheme } from "@/constants/theme";
import { useTheme, withTheme } from "react-native-paper";

const { height, width } = Dimensions.get("window");

const OnboardingScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const router = useRouter();

  const handleDone = async () => {
    await setItem("onboarded", "1");
    router.push("/welcome");
  };

  // const checkIfAlreadyOnboarded = async () => {
  //   let onboarded = await getItem("onboarded");

  //   if (onboarded == "1") {
  //     // setShowOnboarding(false);
  //     console.log(`onboarded 1: ${JSON.stringify(onboarded, null, 2)}`);
  //   } else {
  //     // setShowOnboarding(true);
  //     console.log(`onboarded else: ${JSON.stringify(onboarded, null, 2)}`);
  //   }
  // };

  // useEffect(() => {
  //   checkIfAlreadyOnboarded();
  // }, []);

  return (
    <View style={styles.container}>
      <Onboarding
        containerStyles={{ paddingHorizontal: 25 }}
        bottomBarHighlight={true}
        // TODO titleStyles={{ fontSize: theme.fonts.headlineLarge }}
        titleStyles={{ fontSize: 50 }}
        subTitleStyles={{ marginVertical: 20 }}
        onDone={handleDone}
        onSkip={handleDone}
        pages={[
          {
            backgroundColor: "#44AF69",
            image: (
              <LottieView
                style={styles.lottie}
                source={require("@/assets/animations/anim1.json")}
                autoPlay
                loop
              />
            ),
            title: "Share notes about your clients",
            subtitle:
              "Built to connect hairstylists in particular, we wanted to give you one place to share details about your clients so other stylists can come in prepared too!",
          },
          {
            backgroundColor: "#F8333C",
            image: (
              <LottieView
                style={styles.lottie}
                source={require("@/assets/animations/anim2.json")}
                autoPlay
                loop
              />
            ),
            title: "Share photo or video clips",
            subtitle: "Include details about the formula and type used",
          },
          // TODO: Needs content
          // {
          //   backgroundColor: "#FCAB10",
          //   image: (
          //     <LottieView
          //       style={styles.lottie}
          //       source={require("@/assets/animations/anim3.json")}
          //       autoPlay
          //       loop
          //     />
          //   ),
          //   title: "Can you make the logo bigger",
          //   subtitle:
          //     "Jazz it up a little we exceed the clients' expectations i was wondering if my cat could be placed over the logo in the flyer, for can you make it look more designed , but can you make it stand out more? i know this is the final release but can we add more features?.",
          // },
        ]}
        DoneButtonComponent={({ ...props }) => (
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text>{translate("common:done")}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    // justifyContent: "center",
    // paddingHorizontal: 15,
  },
  lottie: {
    width: width * 0.9,
    height: width,
  },
  doneButton: {
    padding: 20,
    // backgroundColor: "white",
    // borderTopLeftRadius: "100%",
    // borderBottomLeftRadius: "100%",
  },
});
