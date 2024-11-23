import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { hp, wp } from "@/helpers/common";
import Icon from "@/assets/icons";
import { myTheme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import Avatar from "@/components/Avatar";
import { fetchPosts } from "@/services/postService";
import PostCard from "@/components/PostCard";
import Loading from "@/components/Loading";
import {
  useTheme as usetheme,
  Button as PaperButton,
  IconButton,
  Switch,
  withTheme,
  useTheme,
} from "react-native-paper";
import { translate } from "@/i18n";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserData, updateUser } from "@/services/userService";

var limit = 0;

const Profile = () => {
  const theme = useTheme();
  const { user, setAuth } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [filterObjectionableContent, setFilterObjectionableContent] =
    useState(false);

  // TODO Just import this later from SSOT
  const onLogout = async () => {
    // setAuth(null);
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log(`error: ${JSON.stringify(error, null, 2)}`);
      Alert.alert(translate("common:signOut"), translate("errors:signOut"));
    }
  };

  const getPosts = async () => {
    if (!hasMore) return null;
    limit = limit + 10;

    let res = await fetchPosts(limit, user.id, user.id);

    if (res.success) {
      if (posts.length == res.data.length) {
        setHasMore(false);
      }

      setPosts(res.data);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      translate("common:confirm"),
      translate("common:confirmLogout"),
      [
        {
          text: translate("common:cancel"),
          onPress: () => console.log(`canceled`),
          style: "cancel",
        },
        {
          text: translate("common:logout"),
          onPress: () => onLogout(),
          style: "destructive",
        },
      ]
    );
  };

  const updateShowObjectionableContent = async (userId: string) => {
    // TODO I dunno about the logic of this, though it definitely works as expected
    // TODO just offload this to the api probably
    const { data, error } = await supabase
      .from("users")
      .update({ filter_objectionable_content: !filterObjectionableContent }) // Set the value to true
      .eq("id", userId);

    if (error) {
      console.error("Error updating show_objectionable_content:", error);
    } else {
      console.log("Updated successfully:", data);
    }
  };

  const onToggleSwitch = async () => {
    // update the actual db value
    Haptics.ImpactFeedbackStyle.Heavy;
    setFilterObjectionableContent(!filterObjectionableContent);
    updateShowObjectionableContent(user?.id);
  };

  useEffect(() => {
    // get that user's show_objectionable_content value

    // Probably offload to the api
    const fetchUserContentSettings = async (userId: string) => {
      try {
        let res = await getUserData(userId);

        if (res.success) {
          setFilterObjectionableContent(res.data.filter_objectionable_content);
        }

        // const { data, error } = await supabase
        //   .from('users')
        //   .select('filter_objectionable_content')
        //   .eq('id', userId)
        //   .single(); // Fetch a single record

        // if (error) {
        //   console.error('Error fetching filter_objectionable_content:', error);
        // } else {
        //   console.log(
        //     'Show Objectionable Content:',
        //     data?.filter_objectionable_content
        //   );
        // }
      } catch (error) {
        console.log("Error getting user content settings", error);
      }
    };
    fetchUserContentSettings(user?.id);
  }, []);

  return (
    <ScreenWrapper>
      <FlatList
        data={posts}
        ListHeaderComponent={
          <>
            <UserHeader
              user={user}
              router={router}
              handleLogout={handleLogout}
            />
            <View
              style={[
                styles.horizontalLine,
                { borderBottomColor: theme.colors.onBackground },
              ]}
            />
            {/*Row to contain three columns, one which is liked posts  */}
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              {/* <IconButton icon={"folder"} /> */}

              <TouchableOpacity onPress={() => router.push("/likedPosts")}>
                <IconButton icon={"heart-multiple-outline"} />
              </TouchableOpacity>
              {/* <IconButton icon={"folder"} /> */}
            </View>

            {/* /**
              |----------------------------------------------------------------------------------------------------
              | =>        			NEW
              |----------------------------------------------------------------------------------------------------
            */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: theme.colors.secondary,
                  },
                ]}
              >
                {translate("profileScreen:contentSettings")}
              </Text>
              <View
                style={[
                  styles.row,
                  { backgroundColor: theme.colors.elevation.level3 },
                ]}
              >
                <View style={[styles.rowIcon, { backgroundColor: "#FE9400" }]}>
                  <IconButton iconColor="#fff" icon="eye" size={20} />
                </View>
                {/* <Text style={styles.rowLabel}>Language</Text> */}

                <Text style={{ color: theme.colors.secondary }}>
                  {translate("profileScreen:showNsfw")}
                </Text>
                <View style={styles.rowSpacer} />
                <Switch
                  style={{ marginRight: 10 }}
                  value={filterObjectionableContent}
                  onValueChange={onToggleSwitch}
                  // TODO
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  router.push("/editBlockedUsers");
                }}
                style={[
                  styles.row,
                  { backgroundColor: theme.colors.elevation.level3 },
                ]}
              >
                <View
                  style={[
                    styles.rowIcon,
                    { backgroundColor: theme.colors.error },
                  ]}
                >
                  <IconButton
                    iconColor="#fff"
                    icon="account-off-outline"
                    size={20}
                  />
                </View>
                <Text
                  style={[
                    styles.rowLabel,
                    {
                      color: theme.colors.secondary,
                    },
                  ]}
                >
                  {translate("profileScreen:editBlockedUsers")}
                </Text>
                <View style={styles.rowSpacer} />
                <IconButton
                  // '#C6C6C6'
                  iconColor={theme.colors.secondary}
                  icon="chevron-right"
                  size={20}
                />
              </TouchableOpacity>
            </View>

            <Text style={{ color: theme.colors.secondary }}>
              {translate("profileScreen:myRecentPosts")}
            </Text>
          </>
        }
        ListHeaderComponentStyle={{ marginBottom: 30 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard
            item={item}
            currentUser={user}
            router={router}
            canNavigateToUser={false}
          />
        )}
        onEndReached={() => {
          getPosts();
          console.log("End reached!");
        }}
        ListFooterComponent={
          hasMore ? (
            <View style={{ marginVertical: posts.length == 0 ? 100 : 30 }}>
              <Loading />
            </View>
          ) : (
            <View style={{ marginVertical: 30 }}>
              <Text
                style={[
                  styles.noPosts,
                  {
                    color: theme.colors.onBackground,
                  },
                ]}
              >
                {translate("common:endOfList")}
              </Text>
            </View>
          )
        }
      />
    </ScreenWrapper>
  );
};

const UserHeader = ({ user, router, handleLogout }: any) => {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: wp(4),
      }}
    >
      <View>
        <Header title={translate("common:profile")} showBackButton />
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: theme.colors.error,
              borderRadius: myTheme.radius.sm,
            },
          ]}
          onPress={handleLogout}
        >
          <Icon name={"logout"} color={theme.colors.onError} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          <View style={styles.avatarContainer}>
            <Avatar
              uri={user?.image}
              size={hp(12)}
              rounded={myTheme.radius.xxl * 1.4}
            />
            <Pressable
              style={[
                styles.editIcon,
                {
                  shadowColor: theme.colors.shadow,
                },
              ]}
              onPress={() => router.push("/editProfile")}
            >
              {/* name: edit */}
              <Icon name="userEdit" strokeWidth={2.5} size={20} />
            </Pressable>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.username,
                {
                  color: theme.colors.onBackground,
                },
              ]}
            >
              {user && user.name}
            </Text>
            <Text
              style={[
                styles.infoText,
                {
                  color: theme.colors.onSurface,
                },
              ]}
            >
              {user && user.address}
            </Text>
          </View>

          <View style={{ gap: 10 }}>
            <View style={styles.info}>
              {/* name mail */}
              <Icon name="email" color={theme.colors.secondary} />
              <Text
                style={[styles.infoText, { color: theme.colors.onBackground }]}
              >
                {user && user.email}
              </Text>
            </View>
            {user && user?.phoneNumber && (
              <View style={styles.info}>
                {/* name call/phone */}
                <Icon name="phone" color={theme.colors.secondary} />
                <Text
                  style={[
                    styles.infoText,
                    { color: theme.colors.onBackground },
                  ]}
                >
                  {user && user.phoneNumber}
                </Text>
              </View>
            )}
            {user && user?.bio && (
              <Text
                style={[styles.infoText, { color: theme.colors.onBackground }]}
              >
                {user && user.bio}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  textHeader: { fontSize: 42 },

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
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20,
  },
  headerShape: {
    width: wp(100),
    height: hp(20),
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
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: "500",
  },
  logoutButton: {
    position: "absolute",
    right: 0,
    padding: 5,
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
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
    // backgroundColor: theme.colors.roseLight,
  },
  horizontalLine: {
    marginVertical: 20,
    justifyContent: "center",
    alignSelf: "center",
    borderBottomWidth: 0.3,
    width: wp(50),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 50,
    // backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "400",
    // color: '#0c0c0c',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  section: {
    // paddingHorizontal: 24,
  },
  sectionTitle: {
    paddingVertical: 12,
    fontSize: 12,
    fontWeight: "600",
    // color: '#9e9e9e',
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
});
