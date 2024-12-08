import {
  TextStyle,
  Text,
  View,
  ViewStyle,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  Menu,
  TextInput,
  useTheme,
} from "react-native-paper";
// import { bs } from "../../styles";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { Client } from "@/types/globals";
import Input from "./Input";
import { translate } from "@/i18n";
import { myTheme } from "@/constants/theme";
import { destringifyArray, hp } from "@/helpers/common";
import Avatar from "./Avatar";

interface Props {
  value: { origValue: any };
  label: string;
  data: any[];
  containerStyle: ViewStyle;
  onChange: { origOnChange: () => any };
  onClientSelected: (client: Client) => void; // Notify parent of selected client

  icon?: string;
  style?: ViewStyle | TextStyle;
  menuStyle?: ViewStyle | TextStyle;
  right?: ReactNode | (() => void);
  left?: ReactNode | (() => void);
  onPressIcon?: () => void;
  onPressMenuItem?: () => void;
}

const Autocomplete = ({
  value: origValue,
  label,
  data,
  containerStyle,
  onChange: origOnChange,
  onClientSelected, // Add this

  icon = "bike",
  style = {},
  menuStyle = {},
  right = () => {},
  left = () => {},
  onPressIcon,
  onPressMenuItem,
}: Props) => {
  const theme = useTheme();

  // const [value, setValue] = useState(origValue); // gonna be Client shape
  const [inputValue, setInputValue] = useState(origValue || "");
  const [menuVisible, setMenuVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const filterData = (text: string) => {
    if (!text) return data;
    return data.filter((val: any) =>
      `${val?.first_name} ${val?.last_name}`
        ?.toLowerCase()
        ?.includes(text?.toLowerCase())
    );
  };

  const handleMenuItemPress = (datum: Client) => {
    setInputValue(`${datum.first_name} ${datum.last_name}`);
    setMenuVisible(false);
    onClientSelected(datum); // Notify parent with selected client
  };

  useEffect(() => {
    console.log(`inputValue: ${JSON.stringify(inputValue, null, 2)}`);

    if (inputValue?.length === 0) setMenuVisible(false);
  }, [inputValue]);

  return (
    <View style={[containerStyle]}>
      <View
        style={
          {
            //   position: "relative",
            //   width: "100%",
          }
        }
      >
        <Input
          onFocus={() => {
            if (inputValue?.first_name?.length === 0) {
              console.log("zero");
              setMenuVisible(true);
            }
          }}
          placeholder={label}
          defaultValue={origValue}
          onChangeText={(text) => {
            origOnChange(text);
            if (text && text.length > 0) {
              setFilteredData(filterData(text));
            } else if (text && text.length === 0) {
              setFilteredData(data);
            }

            setMenuVisible(true);
            setInputValue(text);
          }}
          value={
            typeof inputValue === "string"
              ? inputValue
              : `${inputValue?.first_name || ""} ${
                  inputValue?.last_name || ""
                }`.trim()
          }
        />
      </View>

      {menuVisible && filteredData.length > 0 && (
        <View
          style={[
            styles.menuContainer,
            {
              // transform: [{ translateY: -hp(3.6) }],
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.outline,
            },
          ]}
        >
          {filteredData.map((datum: Client, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.searchResultItem,
                {
                  // borderBottomWidth: i === filteredData.length - 1 ? 0 : 0.4,
                  // height: i === 0 ? 80 : 50, // First item taller
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.outline,
                  height: hp(7.2),
                },
              ]}
              onPress={() => handleMenuItemPress(datum)}
            >
              <Text
                style={[
                  styles.searchResultText,
                  {
                    color: theme.colors.outline,
                  },
                ]}
              >
                {datum?.first_name} {datum?.last_name}
              </Text>

              {/* A */}
              <View style={{ padding: 10 }}>
                <Avatar
                  // check if it contains [] or , to quick-check for arrayness
                  // TODO Can definitely be more elegant
                  uri={
                    datum.profile_image?.includes("[")
                      ? datum?.profile_image
                          ?.replace(/[ \[\] "]/g, "")
                          .split(",")[0]
                      : datum.profile_image
                  }
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default Autocomplete;

const styles = StyleSheet.create({
  iconButton: {
    position: "absolute", // Overlay the button on top of the Input
    right: 10, // Position near the right edge of the Input
    // top: "50%", // Center vertically relative to the Input
    transform: [{ translateY: 5 }], // Adjust vertical centering (half the height of IconButton)
    backgroundColor: "transparent", // Ensure no background for IconButton
    alignItems: "center",
  },
  menuContainer: {
    flex: 1,
    position: "absolute", // Make menu flow below Input
    // borderWidth: 0.4,
    flexDirection: "column",
    borderTopColor: "transparent",
    borderWidth: 0.4,
    borderTopWidth: 0, // Seamlessly connect to Input
    borderRadius: 5,
    top: hp(7.2), // Match Input height
    left: 0,
    right: 0,
    zIndex: 10, // Ensure it's above other elements
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchResultItemContainer: {
    //   width: "100%",
    //   backgroundColor: "blue",
    //   height: 100,
    // position: "absolute",
    zIndex: -1, // TODO can be 1?
    alignItems: "center",
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
  },
  searchResultItem: {
    borderWidth: 0.4,
    width: "100%",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchResultText: {
    padding: 10,
    fontSize: 17,
  },
});
