import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Input from "@/components/Input";
import { translate } from "@/i18n";
import { hp, wp } from "@/helpers/common";
import Header from "@/components/Header";
import Avatar from "@/components/Avatar";
import { myTheme } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { fetchClientDetails } from "@/services/clientService";
import { useTheme } from "react-native-paper";
import DebugContainer from "@/utils/DebugContainer";
import { Client } from "@/types/globals";

const EditClient = () => {
  const theme = useTheme();
  const { clientId }: { clientId: string } = useLocalSearchParams();

  const [formulaType, setFormulaType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<Client>();

  const getClientDetails = async (clientId: number | string) => {
    setLoading(true);
    let res = await fetchClientDetails(clientId);

    if (res?.success) {
      setClient(res?.data);
    }
    setLoading(false); // in postDetails
  };

  useEffect(() => {
    if (!clientId || !clientId?.[0]) {
      //   return null;
    }

    getClientDetails(clientId);
  }, []);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header
          title={
            // translate(
            // !post?.editing
            //   ? "newPostScreen:title"
            //   : "newPostScreen:editingTitle"
            // // "newPostScreen:title"
            "Add client"
            // or edit client
          }
          showBackButton
        />

        <View style={styles.avatarContainer}>
          <Avatar
            //   I have no freaking clue why you can do it inline here but as soon as it's a function...everything goes out the window
            uri={client?.profile_image?.slice(
              client?.profile_image?.indexOf("postImages"),
              client?.profile_image?.indexOf(
                ".png",
                client?.profile_image?.indexOf("postImages")
              ) + 4
            )}
            size={hp(12)}
            rounded={myTheme.radius.xxl * 1.4}
          />
        </View>

        <Input
          // icon={<Icon name="user" size={26} strokeWidth={1.6} />}
          autoCapitalize="words"
          placeholder={"Client name"}
          onChangeText={(newText: string) => setFormulaType(newText)} // each gets a separate state var
          defaultValue={formulaType}
        />
        <Input
          // icon={<Icon name="user" size={26} strokeWidth={1.6} />}
          autoCapitalize="words"
          //   placeholder={translate("newPostScreen:formulaTypePlaceholder")}
          placeholder={"Phone number"}
          onChangeText={(newText: string) => setPhoneNumber(newText)} // each gets a separate state var
          defaultValue={phoneNumber}
        />
      </View>
    </ScreenWrapper>
  );
};

export default EditClient;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15,
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "white",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  username: {
    fontSize: hp(3),
    fontWeight: "500",
  },
});
