import Carousel from "react-native-reanimated-carousel";
import {
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
  Touchable,
  Alert,
  Share,
  Pressable,
  Button as NativeButton,
  TouchableWithoutFeedback,
  ActionSheetIOS,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { destringifyArray, hp, stripHtmlTags, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "@/assets/icons";
import RenderHtml from "react-native-render-html";
import { downloadFile, getSupabaseFileUrl } from "@/services/imageService";
import {
  blockUser,
  createPostLike,
  markPostNsfw,
  removePostLike,
} from "@/services/postService";
import Loading from "./Loading";
import {
  useTheme as usePaperTheme,
  IconButton,
  Icon as PaperIcon,
  Snackbar,
} from "react-native-paper";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { translate } from "@/i18n";
import Button from "./Button";
import { Dimensions } from "react-native";
import { supabase } from "@/lib/supabase";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { Video } from "expo-av";

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
  showDelete = false,
  onDelete = () => {},
  onEdit = () => {},
  canCopyFormula = false,
  canNavigateToUser = true,
  interactable = true,
}: any) => {
  const paperTheme = usePaperTheme();
  const [snackbarVisible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!snackbarVisible);
  const onDismissSnackBar = () => setVisible(false);

  const textStyle = {
    color: paperTheme.colors.onBackground,
    fontSize: hp(1.75),
  };

  const tagsStyle = {
    div: textStyle,
    p: textStyle,
    ol: textStyle,
    h1: { color: paperTheme.colors.onBackground },
    h4: { color: paperTheme.colors.onBackground },
  };

  const shadowStyles = {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };

  const created_at = moment(item?.created_at).format("MMM D");
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLikes(item?.postLikes);
  }, []);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const openPostDetails = () => {
    if (!showMoreIcon) return null;

    router.push({
      pathname: "/postDetails",
      params: {
        postId: item?.id,
      },
    });
  };

  const onPressMore = async (userId?: string, userName: string) => {
    // TODO: So then what with Android???
    // Remember though if it's the same as the current user Id, you shouldn't show this option...it makes no fucking sense.

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Block user", "Report post"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
      },
      async (buttonIndex) => {
        {
          /* /**
          |----------------------------------------------------------------------------------------------------
          | =>        			Cancel button
          |----------------------------------------------------------------------------------------------------
        */
        }
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          {
            /* /**
          |----------------------------------------------------------------------------------------------------
          | =>        			Block user
          |----------------------------------------------------------------------------------------------------
        */
          }
          // Server actions to add that user to the users list of blocked users
          setLoading(true);
          let res = await blockUser(userId, currentUser?.id);
          setLoading(false);

          if (res.success) {
            // This should probably do the check then allow 'unblock user
            // if (!res.data) {
            //   Alert.alert('You have already blocked this user.');
            //   return;
            // }

            Alert.alert(
              "Blocked user!",
              `You will no longer see any posts from ${userName}`
            );
          } else {
            Alert.alert("Error calling markPostNsfw", res.msg);
          }
        } else if (buttonIndex === 2) {
          {
            /* /**
            |----------------------------------------------------------------------------------------------------
            | =>        			Report post
            |----------------------------------------------------------------------------------------------------
          */
          }
          // Alert.alert(
          //   'Post flagged!',
          //   'This post will also no longer be shown to you.',
          //   [
          //     {
          //       text: 'Ok',
          //       onPress: () => {},
          //       style: 'cancel',
          //     },
          //   ]
          // );
          // console.log(
          //   `item reported as inappropriate: ${JSON.stringify(item, null, 2)}`
          // );

          router.push({
            pathname: "/reportPost",
            params: {
              postId: item?.id,
            },
          });

          // let res = await markPostNsfw(item.id);

          // if (res.success) {
          //   console.log('success.');
          // } else {
          //   Alert.alert('Error calling markPostNsfw', res.msg);
          // }
        }
      }
    );
  };

  const openProfileDetails = (targetUserId: string) => {
    canNavigateToUser &&
      router.push({
        pathname: "/userProfile",
        params: { targetUserId: targetUserId },
      });
  };

  const onLike = async () => {
    // Remove like if it's already been liked, otherwise like the post
    if (liked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      let updatedLikes = likes.filter((like) => like.userId != currentUser?.id);

      setLikes([...updatedLikes]);
      let res = await removePostLike(item?.id, currentUser?.id);
      console.log(`removed like res: ${JSON.stringify(res, null, 2)}`);

      if (!res.success) Alert.alert("Post", "Could not unlike post!");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      let data = { userId: currentUser?.id, postId: item?.id };

      setLikes([...likes, data]);
      let res = await createPostLike(data);
      console.log(`postLike res: ${JSON.stringify(res, null, 2)}`);

      if (!res.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Post", "Something went wrong!");
      }
    }
  };

  const onShare = async () => {
    let content = { message: stripHtmlTags(item?.body) };
    if (item?.file) {
      setLoading(true);
      let url = await downloadFile(getSupabaseFileUrl(item?.file).uri);
      setLoading(false);
      content.url = url;
    }
    Share.share(content);
  };

  const handlePostDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to do this?", [
      {
        text: "Cancel",
        onPress: () => console.log(`canceled`),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => onDelete(item),
        style: "destructive",
      },
    ]);
  };

  const handleCopyFormula = async (str: string, type?: "partial") => {
    try {
      onToggleSnackBar();
      await Clipboard.setStringAsync(str);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.error(`some error in handleCopyItem: ${error}`);
      return null;
    }
  };

  const liked = likes.filter((like) => like.userId == currentUser?.id)[0]
    ? true
    : false;

  const { width, height } = Dimensions.get("screen");

  const [isLoading, setIsLoading] = useState(true);
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  return (
    <Pressable
      onPress={interactable ? openPostDetails : null}
      style={[
        styles.container,
        {
          backgroundColor: paperTheme.colors.background,
          borderColor: paperTheme.colors.secondary,
        },
        hasShadow && shadowStyles,
      ]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() =>
            interactable ? openProfileDetails(item?.userId) : null
          }
        >
          <View style={styles.userInfo}>
            <Avatar
              size={hp(4.5)}
              uri={item?.user?.image}
              rounded={theme.radius.md}
            />
            <View style={{ gap: 2 }}>
              <Text
                style={[
                  styles.username,
                  {
                    color: paperTheme.colors.onBackground,
                  },
                ]}
              >
                {item?.user?.name || "[deleted]"}
              </Text>
              <Text
                style={[
                  styles.postTime,
                  {
                    color: paperTheme.colors.secondary,
                  },
                ]}
              >
                {created_at}
              </Text>
            </View>
          </View>
        </Pressable>

        {/* Show this if it's enabled and if it's not your own post you're looking at--you can't block or report yourself, that makes no sense. */}
        {showMoreIcon && currentUser?.id !== item?.userId && (
          <TouchableOpacity
            onPress={() =>
              interactable ? onPressMore(item?.userId, item?.user?.name) : null
            }
          >
            <Icon
              name="moreHorizontal"
              size={hp(3.4)}
              strokeWidth={3}
              color={paperTheme.colors.onBackground}
            />
          </TouchableOpacity>
        )}

        {showDelete && currentUser.id == item?.userId && (
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => (interactable ? onEdit(item) : null)}
            >
              <Icon
                name="edit"
                size={hp(2.5)}
                color={paperTheme.colors.onBackground}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={interactable ? handlePostDelete : null}>
              <Icon
                name="delete"
                size={hp(2.5)}
                color={paperTheme.colors.error}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Post details */}
      <Pressable
        style={styles.content}
        onPress={interactable ? openPostDetails : null}
      >
        <View style={styles.postBody}>
          {/* Client's name */}
          {item?.client_name && (
            <Text
              // @ts-ignore
              style={{
                color: paperTheme.colors.secondary,
                fontWeight: theme.fonts.semibold,
                marginVertical: 10,
              }}
            >
              {`>>`} {translate("homeScreen:clientName")}: {item.client_name}
            </Text>
          )}

          {/* /**
            |----------------------------------------------------------------------------------------------------
            | =>        			Client Formula
            |----------------------------------------------------------------------------------------------------
          */}
          {item?.formula_info &&
            item?.formula_info.formula_type &&
            item?.formula_info.formula_description && (
              <View
                style={{
                  backgroundColor: paperTheme.colors.elevation.level2,
                  borderRadius: theme.radius.md,
                  padding: 12,
                  marginBottom: 5,

                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
                // onPress={() =>
                //   handleCopyFormula(item.formula_info.formula_description)
                // }
              >
                <View style={{ width: "80%" }}>
                  <Text
                    // @ts-ignore
                    style={{
                      color: paperTheme.colors.secondary,
                      fontWeight: theme.fonts.semibold,
                    }}
                  >
                    {item.formula_info?.formula_type.toUpperCase()}
                  </Text>
                  {item.formula_info?.formula_description && (
                    <View style={{ left: 15 }}>
                      {item.formula_info?.formula_description
                        ?.split("+")
                        .map((descPart: string, index: number) => (
                          <Text
                            key={index}
                            // @ts-ignore
                            style={{
                              color: paperTheme.colors.secondary,
                              fontWeight: theme.fonts.medium,
                            }}
                          >
                            {descPart.trim()}
                          </Text>
                        ))}
                    </View>
                  )}
                </View>

                {canCopyFormula ? (
                  <TouchableOpacity
                    style={{
                      width: "20%",
                      alignItems: "flex-end",
                      opacity: 0.5,
                    }}
                    hitSlop={{ left: 25, top: 15, bottom: 15, right: 0 }}
                    onPress={() =>
                      interactable
                        ? handleCopyFormula(
                            item.formula_info.formula_description
                          )
                        : null
                    }
                  >
                    <PaperIcon
                      source={"clipboard-outline"}
                      color={paperTheme.colors.primary}
                      size={24}
                    />
                  </TouchableOpacity>
                ) : (
                  <View></View>
                )}
              </View>
            )}

          {/* Details about client */}
          {item?.body && (
            <RenderHtml
              contentWidth={wp(100)}
              source={{ html: item?.body }}
              tagsStyles={tagsStyle}
            />
          )}
        </View>
      </Pressable>

      {/* /**
        |----------------------------------------------------------------------------------------------------
        | =>        			Multi-image display
        |----------------------------------------------------------------------------------------------------
      */}
      {item?.file && destringifyArray(item?.file)?.length > 1 && (
        <View style={styles.imageCounterBadgeContainer}>
          <View style={styles.imageCounterBadge}>
            <Text
              style={{
                color: "white",
              }}
            >
              {carouselIndex + 1}/{destringifyArray(item?.file)?.length}
            </Text>
          </View>
          <Carousel
            loop
            width={width}
            height={width / 2}
            // autoPlay={true}
            data={destringifyArray(item?.file)}
            scrollAnimationDuration={1000 * 0.35}
            panGestureHandlerProps={{
              activeOffsetX: [-10, 10],
            }}
            onSnapToItem={(index) => setCarouselIndex(index)}
            renderItem={({ item, index }) => (
              <MotiView
                style={{
                  // borderLeftWidth: 5,
                  // borderRightWidth: 5,
                  flex: 1,
                  justifyContent: "center",
                  overflow: "hidden",
                }}
                transition={{
                  type: "timing",
                }}
                animate={{ backgroundColor: paperTheme.colors.background }}
              >
                <Skeleton
                  show={isLoading}
                  colorMode={paperTheme.dark ? "dark" : "light"}
                >
                  <Image
                    source={getSupabaseFileUrl(item)}
                    style={{ height: "100%", width: "100%" }}
                    onLoad={handleImageLoad}
                  />
                </Skeleton>
              </MotiView>
            )}
          />
        </View>
      )}

      {/* /**
        |----------------------------------------------------------------------------------------------------
        | =>        			Single-image display
        |----------------------------------------------------------------------------------------------------
      */}
      {item?.file &&
        destringifyArray(item.file).length === 1 &&
        item?.file?.includes("postImages") && (
          <>
            <Pressable onPress={interactable ? openPostDetails : null}>
              <MotiView
                transition={{
                  type: "timing",
                }}
                // style={{ flex: 1, padding: 16 }}
                animate={{ backgroundColor: paperTheme.colors.background }}
              >
                <Skeleton
                  show={isLoading}
                  colorMode={paperTheme.dark ? "dark" : "light"}
                >
                  <Image
                    source={getSupabaseFileUrl(item?.file)!}
                    transition={100}
                    style={styles.postMedia}
                    onLoad={handleImageLoad}
                    contentFit="cover"
                  />
                </Skeleton>
              </MotiView>
            </Pressable>
          </>
        )}

      {/* /**
        |----------------------------------------------------------------------------------------------------
        | =>        			Video display
        |----------------------------------------------------------------------------------------------------
      */}
      {item?.file && item?.file?.includes("postVideos") && (
        // <Pressable onPress={openPostDetails}>
        // TODO: Wrapping Video with TWF and View seems to get around the bubbling up of onPress, but be careful because this may cause errors later
        <TouchableWithoutFeedback onPress={() => console.log("Video pressed")}>
          <View>
            <Video
              style={[styles.postMedia, { height: hp(30) }]}
              source={getSupabaseFileUrl(item?.file)}
              useNativeControls
              resizeMode="cover"
              isLooping
            />
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* likeables */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={interactable ? onLike : null}>
            <Icon
              name="heart"
              size={24}
              fill={liked ? paperTheme.colors.error : "transparent"}
              color={
                liked ? paperTheme.colors.error : paperTheme.colors.secondary
              }
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.count,
              {
                color: paperTheme.colors.onBackground,
              },
            ]}
          >
            {likes.length}
          </Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={interactable ? openPostDetails : null}>
            <Icon
              name="comment"
              size={24}
              color={paperTheme.colors.secondary}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.count,
              {
                color: paperTheme.colors.onBackground,
              },
            ]}
          >
            {item?.comments[0]?.count}
          </Text>
        </View>
        <View style={styles.footerButton}>
          {loading ? (
            <Loading size={"small"} />
          ) : (
            <TouchableOpacity onPress={interactable ? onShare : null}>
              <Icon
                name="share"
                size={24}
                color={paperTheme.colors.secondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Snackbar/Toast notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackBar}
        duration={700}
        action={{
          label: "OK",
          onPress: () => {
            // Do something
          },
        }}
      >
        {translate("postCard:formulaCopied")}
      </Snackbar>
    </Pressable>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    borderWidth: 0.5,
    shadowColor: "#000",
  },
  header: { flexDirection: "row", justifyContent: "space-between" },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontSize: hp(1.7),
    // @ts-ignore
    fontWeight: theme.fonts.medium,
  },
  postTime: {
    fontSize: hp(1.4),
    // @ts-ignore
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: 10,
    // marginBottom: 10,
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  count: {
    fontSize: hp(1.8),
  },
  imageCounterBadgeContainer: { flex: 1, overflow: "hidden", borderRadius: 10 },
  imageCounterBadge: {
    height: 24,
    width: 42,
    backgroundColor: "#121",
    opacity: 0.78,
    position: "absolute",
    borderRadius: 20,
    top: 10,
    right: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
