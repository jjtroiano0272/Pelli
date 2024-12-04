// import {
//   Alert,
//   Image,
//   Keyboard,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { Link } from "expo-router";
// import {
//   createOrUpdateClient,
//   searchForClient,
// } from "@/services/clientService";
// import {
//   ActivityIndicator,
//   TextInput,
//   useTheme,
//   withTheme,
// } from "react-native-paper";
// import { FlatList } from "react-native";
// import Loading from "./Loading";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { myTheme } from "@/constants/theme";
// import Avatar from "./Avatar";
// import { destringifyArray, hp } from "@/helpers/common";
// import Input from "./Input";
// import Icon from "@/assets/icons";
// import { translate } from "@/i18n";
// import { Client } from "@/types/globals";
// import { getSupabaseFileUrl } from "@/services/imageService";

// interface SearchableTextInputProps {
//   // selectedClient: Client | null;
//   // isNewClient: boolean;
//   // setSelectedClient: React.Dispatch<React.SetStateAction<Client | null>>;
//   // setIsNewClient: React.Dispatch<React.SetStateAction<boolean>>;
//   // fromNewPost: boolean;

//   newClient: Client;
//   existingClient: Client;
//   setNewClient: React.Dispatch<React.SetStateAction<Client | null>>;
//   setExistingClient: React.Dispatch<React.SetStateAction<Client | null>>;
// }
// const numResultsToShow = 5;

// const SearchableTextInput = ({
//   // selectedClient,
//   // isNewClient,
//   // setSelectedClient,
//   // setIsNewClient,
//   // fromNewPost,

//   newClient,
//   existingClient,
//   setNewClient,
//   setExistingClient,
// }: SearchableTextInputProps) => {
//   const theme = useTheme();

//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showResults, setShowResults] = useState(false);

//   const getSearchResults = async (query: string) => {
//     if (!query) return null;

//     setLoading(true);
//     let res = await searchForClient(query);

//     if (res.success) setResults(res.data);
//     setLoading(false);
//   };

//   //   Listener for editing client name
//   useEffect(() => {
//     console.log(`query: ${JSON.stringify(query, null, 2)}`);

//     // If you're entering the name of client not yet in the database
//     if (
//       // query !== `${selectedClient?.first_name} ${selectedClient?.last_name}`
//       query !== `${newClient?.first_name} ${newClient?.last_name}`
//     ) {
//       // Goes into falsy on mount from newPost redirect
//       console.log("\x1b[34m" + `falsy`);
//       console.log(`query: ${JSON.stringify(query, null, 2)}`);

//       //   setSelectedClient(null);
//       setShowResults(false);
//       // setIsNewClient(true);
//       // setSelectedClient({
//       //   first_name: query.split(" ")[0],
//       //   last_name: query.split(" ")[1],
//       // });
//       setNewClient({
//         first_name: query.split(" ")[0],
//         last_name: query.split(" ")[1],
//       });
//       // setQuery(selectedClient?.first_name + " " + selectedClient?.last_name);
//     }
//   }, [query]);

//   useEffect(() => {
//     console.log("\x1b[31m" + `query: ${JSON.stringify(query, null, 2)}`);
//     getSearchResults(query);

//     if (query?.length > 0) {
//       setShowResults(true);
//     }

//     // Maybe a cleanup fn?
//   }, [query]);

//   // useEffect(() => {
//   //   if (
//   //     query !== `${selectedClient?.first_name} ${selectedClient?.last_name}`
//   //   ) {
//   //     setShowResults(false);
//   //     setIsNewClient(false);
//   //     setQuery(selectedClient?.first_name + " " + selectedClient?.last_name);
//   //   }
//   // }, [selectedClient]);

//   return (
//     <View>
//       <Input
//         clearButtonMode={existingClient ? "always" : "never"}
//         autoCapitalize="words"
//         icon={
//           // !selectedClient && isNewClient ? (
//           !newClient ? (
//             <Icon name="user" size={26} strokeWidth={1.6} />
//           ) : (
//             existingClient && (
//               <Image
//                 source={{
//                   uri: selectedClient?.profile_image,
//                 }}
//                 // transition={100}
//                 style={{
//                   height: hp(4.5),
//                   width: hp(4.5),
//                   borderRadius: myTheme.radius.md,
//                   borderColor: theme.colors.outline,
//                 }}
//               />

//               // <Avatar
//               //   uri={getSupabaseFileUrl(
//               //     destringifyArray(selectedClient?.profile_image)?.[0]
//               //   )}
//               // />
//             )
//           )

//           //   <Icon name="user" size={26} strokeWidth={1.6} />
//         }
//         placeholder={translate("common:clientName")}
//         returnKeyType="search"
//         // clearButtonMode={clientSelectedFromDB ? "always" : "never"}
//         onChangeText={(text: string) => {
//           setQuery(text);
//         }}
//         value={query}
//       />

//       {
//         // query.length > 0 &&
//         results.length > 0 &&
//           // selectedClient &&

//           showResults &&
//           results
//             .slice(0, numResultsToShow)
//             .map((item: Client, key: number) => {
//               return (
//                 <View key={item.id} style={styles.searchResultItemContainer}>
//                   <TouchableOpacity
//                     style={[
//                       styles.searchResultItem,
//                       {
//                         backgroundColor: theme.colors.background,
//                         borderColor: theme.colors.elevation.level5,
//                       },
//                     ]}
//                     onPress={() => {
//                       setShowResults(false);
//                       setQuery(`${item.first_name} ${item.last_name}`);
//                       setSelectedClient(item);
//                       setIsNewClient(false);

//                       Keyboard.dismiss();
//                     }}
//                   >
//                     <Text
//                       style={{
//                         padding: 10,
//                         fontSize: 17,
//                         color: theme.colors.onBackground,
//                       }}
//                     >
//                       {item?.first_name} {item?.last_name}
//                     </Text>
//                     <View style={{ padding: 10 }}>
//                       {/* A */}
//                       <Avatar uri={item?.profile_image} />
//                     </View>
//                   </TouchableOpacity>
//                 </View>
//               );
//             })
//       }
//     </View>
//   );
// };

// export default SearchableTextInput;

// const styles = StyleSheet.create({
//   searchResultItem: {
//     borderWidth: 1,
//     width: "100%",
//     borderRadius: 5,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   searchResultItemContainer: {
//     //   width: "100%",
//     //   backgroundColor: "blue",
//     //   height: 100,
//     // position: "absolute",
//     zIndex: 10, // TODO can be 1?
//     alignItems: "center",
//   },
// });

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
  searchForClient,
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
import { destringifyArray, hp } from "@/helpers/common";
import Input from "./Input";
import Icon from "@/assets/icons";
import { translate } from "@/i18n";
import { Client } from "@/types/globals";
import { getSupabaseFileUrl } from "@/services/imageService";

interface SearchableTextInputProps {
  // selectedClient: Client | null;
  // isNewClient: boolean;
  // setSelectedClient: React.Dispatch<React.SetStateAction<Client | null>>;
  // setIsNewClient: React.Dispatch<React.SetStateAction<boolean>>;
  // fromNewPost: boolean;

  newClient: Client;
  existingClient: Client;
  setNewClient: React.Dispatch<React.SetStateAction<Client | null>>;
  setExistingClient: React.Dispatch<React.SetStateAction<Client | null>>;
}
const numResultsToShow = 5;

const SearchableTextInput = ({
  // selectedClient,
  // isNewClient,
  // setSelectedClient,
  // setIsNewClient,
  // fromNewPost,

  newClient,
  existingClient,
  setNewClient,
  setExistingClient,
}: SearchableTextInputProps) => {
  const theme = useTheme();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const getSearchResults = async (query: string) => {
    if (!query) return null;

    setLoading(true);
    let res = await searchForClient(query);

    if (res.success) setResults(res.data);
    setLoading(false);
  };

  //   Listener for editing client name
  useEffect(() => {
    console.log(`query: ${JSON.stringify(query, null, 2)}`);

    // If you're entering the name of client not yet in the database
    if (
      // query !== `${selectedClient?.first_name} ${selectedClient?.last_name}`
      query !== `${newClient?.first_name} ${newClient?.last_name}`
    ) {
      // Goes into falsy on mount from newPost redirect
      console.log("\x1b[34m" + `falsy`);
      console.log(`query: ${JSON.stringify(query, null, 2)}`);

      //   setSelectedClient(null);
      setShowResults(false);
      // setIsNewClient(true);
      // setSelectedClient({
      //   first_name: query.split(" ")[0],
      //   last_name: query.split(" ")[1],
      // });
      setNewClient({
        first_name: query.split(" ")[0],
        last_name: query.split(" ")[1],
      });
      // setQuery(selectedClient?.first_name + " " + selectedClient?.last_name);
    }
  }, [query]);

  useEffect(() => {
    console.log("\x1b[31m" + `query: ${JSON.stringify(query, null, 2)}`);
    getSearchResults(query);

    if (query?.length > 0) {
      setShowResults(true);
    }

    // Maybe a cleanup fn?
  }, [query]);

  // useEffect(() => {
  //   if (
  //     query !== `${selectedClient?.first_name} ${selectedClient?.last_name}`
  //   ) {
  //     setShowResults(false);
  //     setIsNewClient(false);
  //     setQuery(selectedClient?.first_name + " " + selectedClient?.last_name);
  //   }
  // }, [selectedClient]);

  return (
    <View>
      <Input
        clearButtonMode={existingClient ? "always" : "never"}
        autoCapitalize="words"
        icon={
          // !selectedClient && isNewClient ? (
          !newClient ? (
            <Icon name="user" size={26} strokeWidth={1.6} />
          ) : (
            existingClient && (
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

              // <Avatar
              //   uri={getSupabaseFileUrl(
              //     destringifyArray(selectedClient?.profile_image)?.[0]
              //   )}
              // />
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

      {
        // query.length > 0 &&
        results.length > 0 &&
          // selectedClient &&

          showResults &&
          results
            .slice(0, numResultsToShow)
            .map((item: Client, key: number) => {
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
                      setShowResults(false);
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
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })
      }
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
