import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  Image,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { hp, wp } from "@/helpers/common";
import { myTheme } from "@/constants/theme";
import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";
import { fetchPosts } from "@/services/postService";
import PostCard from "@/components/PostCard";
import Loading from "@/components/Loading";
import { getUserData } from "@/services/userService";
import { useTheme } from "react-native-paper";
import { translate } from "@/i18n";
import { appName } from "@/constants";
import Animated from "react-native-reanimated";
// import FlipCard from "@/components/FlipCard";
import { useAnimatedShake } from "@/hooks/useAnimatedShake";
import * as Haptics from "expo-haptics";

var limit = 0;

const Home = () => {
  const theme = useTheme();
  const { user, setAuth } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showCats, setShowCats] = useState(false);

  // TODO Much later. experimental
  const { shake, rStyle, isShaking } = useAnimatedShake();
  const showMeCats = () => {
    shake();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    const timer1 = setTimeout(() => {
      setShowCats(true);

      const timer2 = setTimeout(() => {
        setShowCats(false);
      }, 2000);

      return () => clearTimeout(timer2);
    }, 600);

    return () => clearTimeout(timer1);
  };

  const handlePostEvent = async (payload: any) => {
    console.log(`payload: ${JSON.stringify(payload, null, 2)}`);

    if (payload.eventType == "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.postLikes = [];
      newPost.comments = [{ count: 0 }];
      newPost.user = res.success ? res.data : {};
      setPosts((prevPosts: any[]) => [newPost, ...prevPosts]);
    }

    if (payload.eventType == "DELETE" && payload?.old?.id) {
      setPosts((prevPosts: any) => {
        let updatedPosts = prevPosts.filter(
          (post: any) => post.id != payload.old.id
        );

        return updatedPosts;
      });
    }

    if (payload.eventType == "UPDATE" && payload?.new?.id) {
      setPosts((prevPosts: any) => {
        let updatedPosts = prevPosts.map((post: any) => {
          if (post.id == payload.new.id) {
            post.body = payload.new.body;
            post.file = payload.new.file;
          }

          return post;
        });

        return updatedPosts;
      });
    }
  };

  const handleNewNotification = async (payload: any) => {
    console.log(`notification payload: ${JSON.stringify(payload, null, 2)}`);

    if (payload.eventType == "INSERT" && payload?.new?.id) {
      setNotificationCount((prev) => prev + 1);
    }
  };

  const handleUserEvent = async (payload) => {
    console.log(`user event payload: ${JSON.stringify(payload, null, 2)}`);

    if (
      (payload.eventType == "INSERT" || payload.eventType == "UPDATE") &&
      payload?.new?.blocked_users
    ) {
      console.log("Blocked users insert:", payload.new.blocked_users);

      const filteredPosts = posts.filter(
        (post) => !payload?.new?.blocked_users?.includes(post.userId)
      );
      // console.log(`filteredPosts: ${JSON.stringify(filteredPosts, null, 2)}`);

      setPosts(filteredPosts);
    }

    // payload.new.blocked_users is null here if it's empty
  };

  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        handlePostEvent
      )
      .subscribe();

    // getPosts();

    let notificationChannel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `receiverId=eq.${user?.id}`,
        },
        handleNewNotification
      )
      .subscribe();

    let userChannel = supabase
      .channel("users")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users", // don't know if it accepts a field from table
          filter: `id=eq.${user?.id}`,
        },
        handleUserEvent
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(notificationChannel);
      supabase.removeChannel(userChannel);
    };
  }, []);

  const getPosts = async () => {
    if (!hasMore) {
      return null;
    }
    limit = limit + 10;

    let res = await fetchPosts(limit, user?.id);

    // Previous approach
    // if (res.success) {
    //   if (posts.length == res?.data?.length) {
    //     setHasMore(false);
    //   }

    //   setPosts(res?.data);
    // }

    // Indicates you've reached the end of the posts
    // TODO Refactor this later. This is just a hacky workaround to get this thing submitted
    // TODO probably needs a listener too
    if (res.success) {
      if (!res.filterObjectionableContent) {
        if (posts.length == res?.data?.length) {
          setHasMore(false);
        }

        setPosts(res.data);
      } else {
        if (
          posts.length ==
          res.data?.filter((post) => !post.submitted_reports).length
        ) {
          setHasMore(false);
        }

        setPosts(res.data?.filter((post) => !post.submitted_reports));
      }
    }
  };

  useEffect(() => {
    console.log(
      `posts (first 3): ${JSON.stringify(posts.slice(0, 2), null, 2)}`
    );
  }, [posts]);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Pressable onPress={showMeCats}>
              <Animated.View
                style={[
                  rStyle,
                  // styles.counterText,
                  //  rErrorTextStyle
                ]}
              >
                <View style={{ position: "relative" }}>
                  <View style={styles.circleMask}>
                    <Image
                      source={require("@/assets/images/icon.png")}
                      style={{
                        width: 50,
                        height: 50,
                      }}
                    />
                  </View>
                  {/* <View style={styles.catImageContainer}>
                    <View style={styles.catImageMask}>
                      <Image
                        source={require('@/assets/images/cat-contained.png')} // Replace with your cat image
                        style={{ width: '100%', height: '100%' }}
                      />
                    </View>
                  </View> */}
                </View>
              </Animated.View>
            </Pressable>

            {/* B => Flippable Logo */}
            {/* <FlipCard /> */}
            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.secondary,
                  fontWeight: "700",
                },
              ]}
            >
              {appName}
            </Text>
          </View>

          {/* <FlipCard /> */}
          <View style={styles.icons}>
            <Pressable
              onPress={() => {
                setNotificationCount(0);
                router.push("/notifications");
              }}
            >
              <Icon
                name="notification" // heart
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.secondary}
              />
              {notificationCount > 0 && (
                <View
                  style={[
                    styles.pill,
                    {
                      backgroundColor: theme.colors.error,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      {
                        color: theme.colors.onError,
                        fontWeight: "700",
                      },
                    ]}
                  >
                    {notificationCount}
                  </Text>
                </View>
              )}
            </Pressable>
            <Pressable onPress={() => router.push("/newPost")}>
              <Icon
                name="addCircle" // plus
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.secondary}
              />
            </Pressable>
            <Pressable onPress={() => router.push("/profile")}>
              <Avatar
                uri={user?.image}
                size={hp(4.3)}
                rounded={myTheme.radius.sm}
                style={{ borderWidth: 2 }}
              />
            </Pressable>
          </View>
        </View>

        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item: any) => item?.id?.toString()}
          renderItem={({ item }) => (
            <PostCard item={item} currentUser={user} router={router} />
          )}
          onEndReached={() => {
            // Written this way, it calls getPosts on load
            getPosts();
          }}
          ListFooterComponent={
            hasMore ? (
              <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
                <Loading />
              </View>
            ) : (
              <View style={{ marginTop: 30, marginBottom: 50 }}>
                <Text
                  style={[styles.noPosts, { color: theme.colors.secondary }]}
                >
                  {translate("common:endOfList")}
                </Text>
              </View>
            )
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default Home;

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
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderCurve: "continuous",
    // borderRadius: theme.radius.sm,
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
    paddingTop: 20,
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
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  // catImage: {
  //   width: 20,
  //   height: 20,
  //   borderRadius: 10, // Ensures the cat image also has a rounded shape
  //   position: 'absolute',
  //   bottom: 0,
  //   right: 0,
  //   zIndex: 5,
  // },
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
