import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  createComment,
  fetchPostDetails,
  removeComment,
  removePost,
} from "@/services/postService";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import PostCard from "@/components/PostCard";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import Input from "@/components/Input";
import Icon from "@/assets/icons";
import CommentItem from "@/components/CommentItem";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/services/userService";
import { createNotification } from "@/services/notificationService";
import { useTheme as usePaperTheme, IconButton } from "react-native-paper";
import { translate } from "@/i18n";

const PostDetails = () => {
  const paperTheme = usePaperTheme();
  const { postId, commentId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(true);
  const inputRef = useRef(null);
  const commentRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [post, setPost] = useState(null);

  const handleNewComment = async (payload: any) => {
    console.log(`got new comment: ${JSON.stringify(payload.new, null, 2)}`);
    console.log(`payload: ${JSON.stringify(payload, null, 2)}`);

    if (payload.new) {
      let newComment = { ...payload.new };
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};

      setPost((prevPost: any) => {
        return { ...prevPost, comments: [newComment, ...prevPost.comments] };
      });
    }
  };

  useEffect(() => {
    let commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleNewComment
      )
      .subscribe();

    getPostDetails();

    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, []);

  const getPostDetails = async () => {
    let res = await fetchPostDetails(postId);
    if (res.success) setPost(res.data);
    setStartLoading(false);
  };

  const onNewComment = async () => {
    // NOTE, TODO: If Unexpected errors start happening, get rid of everything referencing inputValue....
    if (!commentRef.current) return null;
    if (!inputValue) return;

    let data = {
      userId: user?.id,
      postId: post?.id,
      text: commentRef.current,
    };

    setLoading(true);
    let res = await createComment(data);
    setLoading(false);

    if (res.success) {
      if (user.id != post.userId) {
        let notify = {
          senderId: user.id,
          receiverId: post.userId,
          title: "commented on your post",
          data: JSON.stringify({ postId: post.id, commentId: res?.data?.id }),
        };

        createNotification(notify);
      }

      inputRef?.current?.clear();
      commentRef.current = "";
      setInputValue("");
    } else {
      Alert.alert(translate("common:comment"), res.msg);
    }
  };

  const onDeleteComment = async (comment: any) => {
    console.log(`deleting comment: ${JSON.stringify(comment, null, 2)}`);
    let res = await removeComment(comment?.id);

    if (res.success) {
      setPost((prevPost: any) => {
        let updatedPost = { ...prevPost };
        updatedPost.comments = updatedPost.comments.filter(
          (c: any) => c.id != comment.id
        );

        return updatedPost;
      });
    } else {
      Alert.alert(translate("common:comment"), res.msg);
    }
  };

  const onDeletePost = async (item: any) => {
    console.log(`delete post: ${JSON.stringify(item, null, 2)}`);
    let res = await removePost(post.id);

    if (res.success) {
      router.back();
    } else {
      Alert.alert(translate("common:post"), res.msg);
    }
  };

  const onEditPost = async (item: any) => {
    router.back();
    router.push({ pathname: "/newPost", params: { ...item } });
  };

  if (startLoading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: paperTheme.colors.background },
        ]}
      >
        <Loading />
      </View>
    );
  }

  if (!post) {
    return (
      <View
        style={[styles.center, { justifyContent: "center", marginTop: 100 }]}
      >
        <Text
          style={[
            styles.notFound,
            {
              color: paperTheme.colors.onBackground,
            },
          ]}
        >
          {translate("postDetailsSreen:noPosts")}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: paperTheme.colors.background },
      ]}
      behavior="position" // Works best for both. 'Padding' ends up with keyboard too close.
      keyboardVerticalOffset={-hp(17)}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        <PostCard
          item={{ ...post, comments: [{ count: post?.comments?.length }] }}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
          showDelete={true}
          onDelete={onDeletePost}
          onEdit={onEditPost}
          canCopyFormula={true}
        />
        <View style={styles.inputContainer}>
          <Input
            inputRef={inputRef}
            placeholder={translate("postDetailsSreen:commentInputPlaceholder")}
            // placeholderTextColor={paperTheme.colors.onBackground}
            containerStyle={{
              flex: 1,
              height: hp(6.2),
              borderRadius: theme.radius.xl,
            }}
            onChangeText={(value: string) => {
              commentRef.current = value;
              setInputValue(value);
            }}
          />
          {loading ? (
            <View style={styles.loading}>
              <Loading size={"small"} />
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.sendIcon,
                {
                  borderColor: inputValue
                    ? paperTheme.colors.outline
                    : paperTheme.colors.surfaceDisabled,
                },
              ]}
              onPress={onNewComment}
              disabled={!inputValue}
            >
              {/* if text in box exists, then !disabled => green color */}
              <Icon
                name="send"
                color={
                  inputValue
                    ? paperTheme.colors.primary
                    : paperTheme.colors.surfaceDisabled
                }
              />
            </TouchableOpacity>
          )}
        </View>

        {/* /**
          |----------------------------------------------------------------------------------------------------
          | =>        			Comments on post
          |----------------------------------------------------------------------------------------------------
        */}
        <View style={{ marginVertical: 15, gap: 17 }}>
          {post?.comments.map((comment) => (
            <CommentItem
              key={comment?.id?.toString()}
              item={comment}
              highlight={comment.id == commentId}
              canDelete={user.id == comment.userId || user.id == post.userId}
              onDelete={onDeleteComment}
            />
          ))}
          {post?.comments?.length == 0 && (
            <Text
              style={{
                color: paperTheme.colors.onBackground,
                marginLeft: 5,
              }}
            >
              {translate("postDetailsSreen:noCommentsYet")}
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: wp(7),

    // flexDirection: 'column',
    // justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  list: {
    paddingHorizontal: wp(4),
  },
  sendIcon: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
    height: hp(5.8),
    width: hp(5.8),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFound: {
    fontSize: hp(2.5),
    // @ts-ignore
    fontWeight: theme.fonts.medium,
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1.3 }],
  },
});
