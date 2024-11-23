import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  Button as PaperButton,
  Chip,
  useTheme as usetheme,
  withTheme,
  useTheme,
} from "react-native-paper";
import { myTheme } from "@/constants/theme";
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Button from "@/components/Button";
import { reportPost } from "@/services/postService";
import { hp, wp } from "@/helpers/common";
import { useAuth } from "@/context/AuthContext";
import { translate } from "@/i18n";

const ReportPost = () => {
  const { user: currentUser } = useAuth();
  const theme = useTheme();

  const { postId } = useLocalSearchParams();
  const reportCategories = [
    "Offensive image content",
    "Offensive username",
    "Hate Speech",
    "Spam",
  ];
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    if (!postId || !selectedCategory || !currentUser?.id) return null;

    setLoading(true);
    let res = await reportPost(
      postId as string,
      selectedCategory,
      currentUser?.id
    );
    setLoading(false);

    if (res.success) {
      console.log("success.");
      router.dismiss();
    } else {
      Alert.alert("Error calling markPostNsfw", res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View
        style={[
          styles.container,
          {
            // backgroundColor: theme.colors.background,
            // borderColor: theme.colors.secondary,
          },
        ]}
      >
        <Header
          title={translate("reportPostScreen:title")}
          showBackButton={false}
        />
        <Text>{translate("reportPostScreen:thankYou")}</Text>

        <View style={{ flex: 1 }}>
          {reportCategories.map((category, index) => (
            <PaperButton
              key={index}
              style={{ marginVertical: 15, height: hp(5.2) }}
              labelStyle={{
                fontSize: 16,
                justifyContent: "center",
                alignItems: "flex-end",
              }}
              onPress={() => setSelectedCategory(category)}
              mode={category === selectedCategory ? "contained" : "outlined"}
            >
              {category}
            </PaperButton>
          ))}
        </View>
        <Button
          buttonStyle={{ height: hp(6.2) }}
          onPress={onSubmit}
          loading={loading}
          title={translate("common:submit")}
          disabled={!!!selectedCategory}
        />
      </View>
    </ScreenWrapper>
  );
};

export default ReportPost;

const styles = StyleSheet.create({
  container: {
    // gap: 10,
    // marginBottom: 15,
    // borderRadius: theme.radius.xxl * 1.1,
    // borderCurve: 'continuous',
    // padding: 10,
    // paddingVertical: 12,
    // paddingHorizontal: wp(5),

    // // borderWidth: 0.5,
    // shadowColor: '#000',

    // // flex: 1,
    // gap: 45,
    // paddingHorizontal: wp(5),

    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15,
    justifyContent: "space-between",
  },
  // header: { flexDirection: 'row', justifyContent: 'space-between' },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  textHeader: { fontSize: 42 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
});
