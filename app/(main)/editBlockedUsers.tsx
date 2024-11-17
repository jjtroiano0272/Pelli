import {
  ActionSheetIOS,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useTheme, List, MD3LightTheme, IconButton } from "react-native-paper";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Avatar from "@/components/Avatar";
import Header from "@/components/Header";
import Icon from "@/assets/icons";
import {
  fetchBlockedUsers,
  fetchPosts,
  unblockUser,
} from "@/services/postService";
import { translate } from "@/i18n";
import { useAuth } from "@/context/AuthContext";

var limit = 0;

const editBlockedUsers = () => {
  const { user: currentUser, setAuth } = useAuth();
  const paperTheme = useTheme();
  const [hasMore, setHasMore] = useState(true);

  // TODO Types
  /* Shape is like
        [{
            "id": "18308ab1-772e-4e59-85ba-229132f563dc",
            "created_at": "2024-10-20T14:26:42.464417+00:00",
            "name": "Jon",
            "image": "https://api.dicebear.com/9.x/avataaars-neutral/png?seed=18308ab1-772e-4e59-85ba-229132f563dc&backgroundColor=614335,ae5d29,d08b5b,edb98a,f8d25c,fd9841,ffdbb4,b6e3f4,c0aede,d1d4f9,ffd5dc&backgroundType=gradientLinear",
            "bio": null,
            "address": null,
            "phoneNumber": null,
            "showNsfwResults": false,
            "blocked_users": null
        }]
  */
  const [blockedUsers, setBlockedUsers] = useState<{ [key: string]: any }[]>([
    {},
  ]);
  useEffect(() => {
    getListOfBlockedUsers();
  }, []);

  useEffect(() => {
    console.log(`STATE blockedUsers: ${JSON.stringify(blockedUsers, null, 2)}`);
  }, [blockedUsers]);

  const onPressMore = (item?: { [key: string]: any }) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          "Cancel",
          "Unblock user",
          // 'View profile'
        ],
        // destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          if (!item?.id) return null;

          let res = await unblockUser(currentUser?.id, item?.id);

          if (res.success) {
            Alert.alert("Success!", `${item?.name} is no longer blocked.`);
          }
        }
      }
    );
  };

  const getListOfBlockedUsers = async () => {
    if (!hasMore) return null;
    limit = limit + 10;

    let res = await fetchBlockedUsers(currentUser?.id);

    if (res.success) {
      // if (posts.length == res.data.length) {
      //   setHasMore(false);
      // }

      setBlockedUsers(res.data);
    }
  };

  return (
    <ScreenWrapper>
      <FlatList
        data={blockedUsers}
        ListEmptyComponent={
          // TODO UI) Better styling
          <View style={{ paddingVertical: 50 }}>
            <Text
              style={{
                color: paperTheme.colors.onBackground,
                fontSize: theme.radius.xl,
              }}
            >
              {translate("editBlockedUsersScreen:noUsers")}
            </Text>
          </View>
        }
        // showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        // keyExtractor={(item: any) => item?.id?.toString()}
        onEndReached={getListOfBlockedUsers}
        ListHeaderComponent={
          <View
            style={{
              flex: 1,
              backgroundColor: paperTheme.colors.background,
              paddingHorizontal: wp(4),
            }}
          >
            <View>
              <Header
                title={translate("editBlockedUsersScreen:title")}
                showBackButton
              />

              {/* <TouchableOpacity
                style={[
                  {
                    backgroundColor: paperTheme.colors.error,
                    position: 'absolute',
                    right: 0,
                    padding: 5,
                    borderRadius: theme.radius.sm,
                  },
                ]}
                // onPress={handleLogout}
              >
                <Icon name={'logout'} color={paperTheme.colors.onError} />
              </TouchableOpacity> */}
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <List.Item
            key={index}
            // onPress={() => console.log('go to unblock user')}
            title={item?.name}
            description={item?.bio}
            left={(props) => (
              <Avatar
                size={hp(4.5)}
                // uri={item?.user?.image}
                uri={item?.image}
                rounded={theme.radius.md}
              />
            )}
            right={(props) => (
              <TouchableOpacity onPress={() => onPressMore(item)}>
                <Icon
                  name="moreHorizontal"
                  size={hp(3.4)}
                  strokeWidth={3}
                  color={paperTheme.colors.onBackground}
                />
              </TouchableOpacity>
            )}
          />
        )}
      />
    </ScreenWrapper>
  );
};

export default editBlockedUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: wp (4)
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    fontSize: hp(3.2),
    // @ts-ignore
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    // borderColor: theme.colors.gray,
    borderWidth: 3,
  },

  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
  listStyle: {
    // paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  pillText: {
    fontSize: hp(1.2),
    // @ts-ignore
    fontWeight: theme.fonts.bold,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  maskedView: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    overflow: "hidden",
  },
  mask: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "black",
  },

  circleMask: {
    borderRadius: 25,
    overflow: "hidden",
  },
  mainImage: {
    width: 50,
    height: 50,
  },
  catImageContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 10,
    overflow: "hidden",
  },
  catImageMask: {
    borderRadius: 10,
    overflow: "hidden",
    width: 20,
    height: 20,
  },
  catImage: {
    width: "100%",
    height: "100%",
  },
});
