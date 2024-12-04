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
import { hp } from "@/helpers/common";
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

  // useEffect(() => {
  //   console.log(
  //     `value in state of Autocomplete: ${JSON.stringify(value, null, 2)}`
  //   );
  // }, [value]);

  return (
    <View style={[containerStyle]}>
      {/* =====================================================================================
        === A =============================================
        ========================================================================================= */}
      {/* <TextInput
        mode="outlined"
        onFocus={() => {
          if (value.length === 0) {
            console.log("zero");
            setMenuVisible(true);
          }
        }}
        // onBlur={() => setMenuVisible(false)}
        label={label}
        right={right}
        left={left}
        // style={style}

        outlineStyle={{
          height: hp(7.2),

          borderColor: theme.colors.outline,
          borderRadius: myTheme.radius.xxl,
        }}
        onChangeText={(text) => {
          origOnChange(text);
          if (text && text.length > 0) {
            setFilteredData(filterData(text));
          } else if (text && text.length === 0) {
            setFilteredData(data);
          }
          setMenuVisible(true);
          setValue(text);
        }}
        // value={value}
        value={
          typeof value === "string"
            ? value
            : `${inputValue?.first_name || ""} ${inputValue?.last_name || ""}`.trim()
        }
      /> */}

      {/* =====================================================================================
        === B =============================================
        ========================================================================================= */}
      {/* <Text
        style={{
          padding: 10,
          color: theme.colors.error,
          backgroundColor: theme.colors.errorContainer,
          borderRadius: 20,
        }}
      >
        {value && JSON.stringify(value, null, 2)}
      </Text> */}
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
          // label={label}
          // right={right}
          // left={left}
          // onChangeText={(newText: string) => setFormulaType(newText)} // each gets a separate state var
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

      {menuVisible && filteredData && (
        <View
          style={[
            styles.menuContainer,
            {
              //   backgroundColor: "white",
              //   borderColor: "grey",
            },
          ]}
        >
          {filteredData.map((datum: Client, i) => (
            <>
              {/* <Menu.Item
                key={i}
                //   theme={theme.dark ? MD3DarkTheme : MD3LightTheme}
                style={[
                  { width: "100%" },
                  // bs.borderBottom,
                  menuStyle,
                ]}
                icon="user"
                // onPress={() => {
                //   setValue(datum);
                //   setMenuVisible(false);
                //   onPressMenuItem();

                //   origOnChange(datum); // Notify parent
                // }}
                onPress={() => handleMenuItemPress(datum)} // Handle selection
                title={
                  // datum
                  `${datum?.first_name} ${datum?.last_name}`
                }
              /> */}

              {/* My transposition */}
              <View key={i} style={styles.searchResultItemContainer}>
                <TouchableOpacity
                  style={[
                    styles.searchResultItem,
                    {
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.elevation.level5,
                    },
                  ]}
                  onPress={() => handleMenuItemPress(datum)}
                >
                  <Text
                    style={[
                      styles.searchResultText,
                      {
                        color: theme.colors.onBackground,
                      },
                    ]}
                  >
                    {datum?.first_name} {datum?.last_name}
                  </Text>

                  {/* A */}
                  {/* <View style={{ padding: 10 }}>
                    <Avatar uri={item?.profile_image} />
                  </View> */}
                </TouchableOpacity>
              </View>
            </>
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
    borderWidth: 0.4,
    flexDirection: "column",
  },
  searchResultItemContainer: {
    //   width: "100%",
    //   backgroundColor: "blue",
    //   height: 100,
    // position: "absolute",
    zIndex: 10, // TODO can be 1?
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  searchResultItem: {
    borderWidth: 1,
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
