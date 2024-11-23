import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { myTheme } from "@/constants/theme";
import { hp } from "@/helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "@/assets/icons";
import { useTheme, withTheme } from "react-native-paper";
import { translate } from "@/i18n";

const CommentItem = ({
  item,
  canDelete = false,
  onDelete = () => {},
  highlight = false,
}) => {
  const theme = useTheme();
  const createdAt = moment(item?.created_at).format("MMM d");

  const handleDelete = () => {
    Alert.alert(
      translate("common:confirm"),
      translate("postDetailsSreen:confirmDeletePost"),
      [
        {
          text: translate("common:cancel"),
          onPress: () => console.log(`canceled`),
          style: "cancel",
        },
        {
          text: translate("common:deleteTitle"),
          onPress: () => onDelete(item),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Avatar uri={item?.user?.image} />
      <View
        style={[
          styles.content,
          {
            backgroundColor: theme.colors.elevation.level2,
            borderRadius: myTheme.radius.md,
          },
          highlight && [
            styles.highlight,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.outline,
              shadowColor: theme.colors.shadow,
            },
          ],
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={styles.nameContainer}>
            <Text
              style={[
                styles.text,
                {
                  color: theme.colors.onBackground,
                  fontWeight: "500",
                },
              ]}
            >
              {item?.user?.name}
            </Text>
            <Text>•</Text>
            <Text style={[styles.text, { color: theme.colors.secondary }]}>
              {createdAt}
            </Text>
          </View>
          {canDelete && (
            <TouchableOpacity onPress={handleDelete}>
              <Icon name="delete" size={20} color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
        <Text
          style={[
            styles.text,
            { fontWeight: "normal", color: theme.colors.onBackground },
          ]}
        >
          {item?.text}
        </Text>
      </View>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 7,
  },
  content: {
    flex: 1,
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderCurve: "continuous",
  },
  highlight: {
    borderWidth: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  text: {
    fontSize: hp(1.6),
    // @ts-ignore
  },
});
