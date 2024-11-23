{
  /* /**
  |----------------------------------------------------------------------------------------------------
  | =>        			This is the one for other users' profiles
  |----------------------------------------------------------------------------------------------------
*/
}
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { hp, wp } from "@/helpers/common";
import Icon from "@/assets/icons";
import { myTheme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import Avatar from "@/components/Avatar";
import { fetchPosts, fetchUserDetails } from "@/services/postService";
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

const UserProfile = () => {
  const theme = useTheme();
  const { targetUserId } = useLocalSearchParams();

  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any>([]);
  const [startLoading, setStartLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [filterObjectionableContent, setFilterObjectionableContent] =
    useState(false);

  const getPosts = async () => {
    if (!hasMore) return null;
    limit = limit + 10;

    let res = await fetchPosts(
      limit,
      user.id,
      // TODO Gets changed to the id of the user we pass in
      targetUserId as string
    );

    if (res.success) {
      if (posts.length == res?.data?.length) {
        setHasMore(false);
      }

      setPosts(res.data);
    }
  };

  useEffect(() => {
    // TODO How to handle userLocalSearchPArams being string or str[] in TS
    // if (!targetUserId[0]) return null;

    getUserDetails(targetUserId as string);

    console.log(`targetUserId: ${JSON.stringify(targetUserId, null, 2)}`);
  }, []);

  const [userData, setUserData] = useState();
  const getUserDetails = async (userId: string) => {
    let res = await fetchUserDetails(userId);
    if (res.success) {
      console.log(
        `fetch user data => res.data: ${JSON.stringify(res.data, null, 2)}`
      );
      setUserData(res.data);
    }
    setStartLoading(false); // in postDetails
  };

  return (
    <ScreenWrapper>
      <FlatList
        data={posts}
        ListHeaderComponent={
          <>
            <UserHeader user={userData} router={router} theme={theme} />
            <View
              style={[
                styles.horizontalLine,
                { borderBottomColor: theme.colors.onBackground },
              ]}
            />
            <Text style={{ color: theme.colors.secondary }}>
              {/* TODO Translate */}
              Recent posts
            </Text>
          </>
        }
        ListHeaderComponentStyle={{ marginBottom: 30 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) =>
          targetUserId ? (
            <PostCard
              item={item}
              currentUser={user}
              router={router}
              canNavigateToUser={false}
            />
          ) : null
        }
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

const UserHeader = ({ user }: { [key: string]: any }) => {
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
      </View>

      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          <View style={styles.avatarContainer}>
            <Avatar
              uri={user?.image}
              size={hp(12)}
              rounded={myTheme.radius.xxl * 1.4}
            />
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
            {user && user.email && (
              <View style={styles.info}>
                {/* name mail */}
                <Icon name="email" color={theme.colors.secondary} />
                <Text
                  style={[
                    styles.infoText,
                    { color: theme.colors.onBackground },
                  ]}
                >
                  {user.email}
                </Text>
              </View>
            )}
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

export default UserProfile;

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
