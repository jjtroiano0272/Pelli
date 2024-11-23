import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import {
  createOrUpdateClient,
  fetchClientData,
} from "@/services/clientService";
import {
  ActivityIndicator,
  TextInput,
  useTheme,
  withTheme,
} from "react-native-paper";
import { FlatList } from "react-native";
import Loading from "./Loading";
import { SafeAreaView } from "react-native-safe-area-context";
import { myTheme } from "@/constants/theme";
import Avatar from "./Avatar";
import { hp } from "@/helpers/common";
import Input from "./Input";
import Icon from "@/assets/icons";
import { translate } from "@/i18n";

const SearchableTextInput = ({
  selectedClient,
  isNewClient,
  setSelectedClient,
  setIsNewClient,
}: {
  selectedClient: Client | null;
  isNewClient: boolean;
  setSelectedClient: React.Dispatch<React.SetStateAction<Client | null>>;
  setIsNewClient: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const theme = useTheme();
  const numResultsToShow = 5;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientSelectedFromDB, setClientSelectedFromDB] = useState(false);
  //   const [isNewClient, setIsNewClient] = useState(false);
  //   const [selectedClient, setSelectedClient] = useState<Client>();

  const getSearchResults = async (text: string) => {
    if (!text) return null;

    setLoading(true);
    let res = await fetchClientData(text);

    if (res.success) setResults(res.data);
    setLoading(false);
  };

  //   const onSubmitNewClient = async () => {
  //     Keyboard.dismiss();

  //     let data = {
  //       first_name: query.split(" ")[0],
  //       last_name: query.split(" ")[1],

  //       // any more client details
  //     };

  //     // // TODO: Better explanation for what this actually does?
  //     // if (post && post?.id) data.id = post.id;

  //     // create post
  //     setLoading(true);
  //     let res = await createOrUpdateClient(data);
  //     setLoading(false);

  //     // Clear fields on post success
  //     if (res.success) {
  //       // router.back();
  //     } else {
  //       Alert.alert("Post", res.msg);
  //     }
  //   };

  useEffect(() => {
    getSearchResults(query);

    // Maybe a cleanup fn?
  }, [query]);

  //   Listener for editing client name
  useEffect(() => {
    console.log(`query: ${JSON.stringify(query, null, 2)}`);

    // If you're entering the name of client not yet in the database
    if (
      query !== `${selectedClient?.first_name} ${selectedClient?.last_name}`
    ) {
      //   setSelectedClient(null);
      setIsNewClient(true);
      setSelectedClient({
        first_name: query.split(" ")[0],
        last_name: query.split(" ")[1],
      });
    }
  }, [query]);

  useEffect(() => {
    console.log(`query: ${JSON.stringify(query, null, 2)}`);
    console.log(`selectedClient: ${JSON.stringify(selectedClient, null, 2)}`);
    console.log(`${results.length} results found`);
    // console.log(`results: ${JSON.stringify(results, null, 2)}`);
  }, [query, selectedClient, results]);

  return (
    <View>
      <Input
        autoCapitalize="words"
        icon={
          !selectedClient && isNewClient ? (
            <Icon name="user" size={26} strokeWidth={1.6} />
          ) : (
            selectedClient &&
            selectedClient.profile_image && (
              <Image
                source={{
                  uri: selectedClient?.profile_image,
                }}
                // transition={100}
                style={{
                  height: hp(4.5),
                  width: hp(4.5),
                  borderRadius: myTheme.radius.md,
                  borderColor: theme.colors.outline,
                }}
              />
            )
          )

          //   <Icon name="user" size={26} strokeWidth={1.6} />
        }
        placeholder={translate("common:clientName")}
        returnKeyType="search"
        // clearButtonMode={clientSelectedFromDB ? "always" : "never"}
        onChangeText={(text: string) => {
          setQuery(text);
        }}
        value={query}
      />

      {query.length > 0 &&
        results.length > 0 &&
        selectedClient &&
        results.slice(0, numResultsToShow).map((item: Client, key: number) => {
          return (
            <View key={item.id} style={styles.searchResultItemContainer}>
              <TouchableOpacity
                style={[
                  styles.searchResultItem,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.elevation.level5,
                  },
                ]}
                onPress={() => {
                  setQuery(`${item.first_name} ${item.last_name}`);
                  setSelectedClient(item);
                  setIsNewClient(false);

                  Keyboard.dismiss();
                }}
              >
                <Text
                  style={{
                    padding: 10,
                    fontSize: 17,
                    color: theme.colors.onBackground,
                  }}
                >
                  {item?.first_name} {item?.last_name}
                </Text>
                <View style={{ padding: 10 }}>
                  {/* A */}
                  <Avatar uri={item?.profile_image} />

                  {/* B */}
                  {/* <Image
                    source={{
                      uri: item?.profile_image,
                    }}
                    // transition={100}
                    style={{
                      height: hp(4.5),
                      width: hp(4.5),
                      borderRadius: theme.radius.md,
                      borderColor: theme.colors.outline,
                    }}
                  /> */}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      {/* Always show add new client */}
      {/* {query.length > 0 && !selectedClient && (
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.elevation.level2,
            borderColor: theme.colors.elevation.level5,
            borderWidth: 1,
            width: "100%",
            borderRadius: 5,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={onSubmitNewClient}
        >
          <Text
            style={{
              padding: 10,
              fontSize: 17,
              color: theme.colors.onBackground,
              fontWeight: theme.fontWeight.semibold,
            }}
          >
            {translate("searchableTextInputScreen:addClient")}
          </Text>
          <View style={{ paddingVertical: 10 }}>
            <View
              // transition={100}
              style={{
                height: hp(4.5),
                // width: hp(4.5),
              }}
            />
          </View>
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default SearchableTextInput;

const styles = StyleSheet.create({
  searchResultItem: {
    borderWidth: 1,
    width: "100%",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchResultItemContainer: {
    //   width: "100%",
    //   backgroundColor: "blue",
    //   height: 100,
    // position: "absolute",
    zIndex: 10, // TODO can be 1?
    alignItems: "center",
  },
});
