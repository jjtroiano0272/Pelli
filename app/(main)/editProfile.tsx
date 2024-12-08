import { Image as ExpoImage } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { getUserImageSrc, uploadFile } from "@/services/imageService";
import Icon from "@/assets/icons";
import { hp, wp } from "@/helpers/common";
import { myTheme } from "@/constants/theme";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { removeUser, updateUser } from "@/services/userService";
import {
  useTheme as usetheme,
  Button as PaperButton,
  withTheme,
  useTheme,
  IconButton,
} from "react-native-paper";
import { faker, tr } from "@faker-js/faker";
import { supabase } from "@/lib/supabase";
import * as Haptics from "expo-haptics";
import { translate } from "@/i18n";
import DebugContainer from "@/utils/DebugContainer";
import Avatar from "@/components/Avatar";

type User = {
  name: string;
  phoneNumber: string;
  image: ImagePicker.ImagePickerAsset | string | null;
  bio: string;
  address: string;
};

const editProfile = () => {
  const theme = useTheme();
  const { user: currentUser, setUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [user, setUser] = useState<User>({
    name: "",
    phoneNumber: "",
    image: null,
    bio: "",
    address: "",
  });

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        phoneNumber: currentUser.phoneNumber || "",
        image: currentUser.image || null,
        address: currentUser.address || "",
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser]);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] });
    }
  };

  const onSubmit = async () => {
    let userData = { ...user };
    let { name, phoneNumber, address, image, bio } = userData;

    // if (!name || !phoneNumber || !address || !bio || !image) {
    //   Alert.alert(translate("common:fieldsMissing"));
    //   return;
    // }

    setLoading(true);

    if (typeof image == "object") {
      // upload this bishlet
      let imageRes = await uploadFile("profiles", image?.uri, true);
      if (imageRes.success) userData.image = imageRes.data;
      else userData.image = null;
    }
    const res = await updateUser(currentUser?.id, userData);
    setLoading(false);

    if (res.success) {
      setUserData({ ...currentUser, ...userData });
      router.back();
    }
  };

  const submitDeleteAccount = async () => {
    const res = await removeUser(currentUser?.id);

    if (res.success) {
      await supabase.auth.signOut();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/welcome");
    } else {
      Alert.alert(translate("common:deleteTitle"), res.msg);
    }
  };

  const onPressDeleteAccount = async () => {
    Alert.alert(
      translate("editProfileScreen:deletePromptTitle"),
      translate("editProfileScreen:deletePromptDescription"),
      [
        {
          text: translate("common:cancel"),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: translate("common:confirmDelete"),
          onPress: () => {
            // Adjective +  Noun
            const randomizedString = [faker.word.adjective(), faker.word.noun()]
              .map((word, index) =>
                index === 0
                  ? word.charAt(0).toUpperCase() + word.slice(1)
                  : word.charAt(0).toUpperCase() + word.slice(1)
              )
              .join("");

            Alert.prompt(
              translate("common:areYouSure"),
              `${translate(
                "editProfileScreen:deleteAccountFinal"
              )}\n\n${randomizedString}`,
              (userEnteredText) => {
                // Check that text matches
                if (userEnteredText == randomizedString) {
                  submitDeleteAccount();
                }
              }
            );
          },
          style: "destructive",
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      }
    );
  };

  let imageSource =
    user.image && typeof user.image == "object"
      ? user.image
      : getUserImageSrc(user?.image);

  useEffect(() => {
    console.log(
      `imageSource @editProfile: ${JSON.stringify(imageSource, null, 2)}`
    );
  }, [imageSource]);

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: wp(4) }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            // flex: 1, // Take up 100% of the visible height
            height: hp(100), // Ensures it's always screen height
            // justifyContent: "center",
            // alignItems: "center",
          }}
        >
          <Header title={translate("editProfileScreen:title")} />
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <ExpoImage
                source={imageSource}
                style={[
                  styles.avatar,
                  {
                    borderColor: theme.colors.outline,
                    borderRadius: myTheme.radius.xxl * 1.8,
                  },
                ]}
              />
              {/* Change avatar */}
              <Pressable
                style={[
                  styles.editAvatarIcon,
                  {
                    shadowColor: theme.colors.shadow,
                    backgroundColor: theme.colors.background,
                  },
                ]}
                onPress={onPickImage}
              >
                <Icon name="userEdit" />
              </Pressable>
              {/* Clear avatar */}
              {/* user?.image will be a FilePicker object if it's selected from the photo roll. */}
              {typeof user?.image == "object" && (
                <Pressable
                  style={[
                    styles.clearAvatarIcon,
                    {
                      backgroundColor: theme.colors.background,
                      shadowColor: theme.colors.shadow,
                    },
                  ]}
                  onPress={() =>
                    setUser({
                      ...user,
                      image: `https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${currentUser?.id}&mouth=default,disbelief,eating,serious,smile,tongue,twinkle&backgroundType=gradientLinear,solid`,
                    })
                  }
                >
                  <Icon
                    name="removePhoto"
                    color={theme.colors.error}
                    size={12}
                  />
                </Pressable>
              )}
            </View>
            <Text
              style={{
                fontSize: hp(1.5),
                color: theme.colors.onBackground,
              }}
            >
              {translate("editProfileScreen:formPrompt")}
            </Text>
            <Input
              icon={<Icon name="user" />}
              placeholder={translate("common:nameInputPlaceholder")}
              value={user.name}
              onChangeText={(value: string) =>
                setUser({ ...user, name: value })
              }
            />
            <Input
              icon={<Icon name="phone" />}
              placeholder={translate("common:phoneInputPlaceholder")}
              value={user.phoneNumber}
              onChangeText={(value: string) =>
                setUser({ ...user, phoneNumber: value })
              }
            />
            <Input
              icon={<Icon name="location" />}
              placeholder={translate("common:addressInputPlaceholder")}
              value={user.address}
              onChangeText={(value: string) =>
                setUser({ ...user, address: value })
              }
            />
            <Input
              placeholder={translate("common:bioInputPlaceholder")}
              value={user.bio}
              multiline={true}
              containerStyle={styles.bio}
              onChangeText={(value: string) => setUser({ ...user, bio: value })}
            />
            <Button
              title={translate("common:update")}
              loading={loading}
              onPress={onSubmit}
            />
            {/* <Button
                buttonStyle={
                  {
                    // backgroundColor: '#ff0000',
                  }
                }
                title='DELETE ACCOUNT'
                loading={loading}
                onPress={onSubmitDeleteAccount}
              /> */}

            <View
              style={{
                alignItems: "center",
                marginTop: 50,
              }}
            >
              <IconButton
                icon={"arrow-down"}
                size={26}
                iconColor={theme.colors.backdrop}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PaperButton
            children={translate("editProfileScreen:deleteAccountButtonTitle")}
            uppercase
            mode="text"
            onPress={onPressDeleteAccount}
            textColor={theme.colors.error}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default editProfile;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: wp(4),

    height: hp(100),
    flexGrow: 1,
  },
  textHeader: { fontSize: 42 },

  form: { gap: 18, marginTop: 20 },
  avatarContainer: { height: hp(14), width: hp(14), alignSelf: "center" },
  avatar: {
    width: "100%",
    height: "100%",
    borderCurve: "continuous",
    borderWidth: 1,
  },
  editAvatarIcon: {
    position: "absolute",
    bottom: 0,
    right: -18,
    padding: 8,
    borderRadius: 50,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  input: {
    flexDirection: "row",
    borderWidth: wp(0.4),
    // borderColor: theme.colors.text,
    // borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    padding: 17,
    paddingHorizontal: 20,
    gap: 15,
  },
  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
  clearAvatarIcon: {
    position: "absolute",
    bottom: 0,
    left: -18,
    padding: 8,
    borderRadius: 50,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
});
