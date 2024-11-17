import { supabase } from "@/lib/supabase";
import { uploadFile, uploadMultipleFiles } from "./imageService";

// for example, post that is passed on in newPost looks like
/* let data = {
      file,
      body: bodyRef?.current,
      userId: user?.id,
    }; */
export const createOrUpdatePost = async (post: PostData) => {
  try {
    {
      /* /**
      |----------------------------------------------------------------------------------------------------
      | =>        			Single-file upload
      |----------------------------------------------------------------------------------------------------
    */
    }
    if (post.file && typeof post.file == "object" && post.file.length === 1) {
      let isImage = post?.file?.[0]?.type == "image"; // I think this only works for stuff from phot roll
      let folderName = isImage ? "postImages" : "postVideos";
      // Seems built only for single files
      console.log(
        `post?.file?.uri before pass to uploadFile: ${JSON.stringify(
          post,
          null,
          2
        )}`
      );
      let fileResult = await uploadFile(
        folderName,
        // post?.file?.uri,
        post?.file?.[0]?.uri,
        isImage
      );

      if (fileResult.success) {
        post.file = fileResult.data;
      } else {
        return fileResult;
      }

      const { data, error } = await supabase
        .from("posts")
        .upsert(post)
        .select()
        .single();

      if (error) {
        console.error(`createPost error: `, error);
      }

      return { success: true, data: data };
    } else if (post.file.length > 1) {
      {
        /* /**
      |----------------------------------------------------------------------------------------------------
      | =>        			Multi-file upload
      |----------------------------------------------------------------------------------------------------
    */
      }

      let fileResult = await uploadMultipleFiles(
        "postImages",
        post?.file,
        true
      );

      console.log(`fileResult: ${JSON.stringify(fileResult, null, 2)}`);
      /* 
       LOG  fileResult: {
              "success": true,
              "data": [
                "postImages/1730388465325.png",
                "postImages/1730388465326.png",
                "postImages/1730388465326.png"
              ]
     */
      if (fileResult.success) {
        post.file = fileResult.data; // data is array of image paths...with the last two being duplicates for some fucking reason
      } else {
        return fileResult;
      }

      // Then actually create the post on the server
      const { data, error } = await supabase
        .from("posts")
        .upsert(post)
        .select()
        .single();

      if (error) {
        console.error(`Post upsert error => ${error.message}`);
        return { success: false, msg: "Could not create/update post" };
      }

      console.log(`data from creating post: ${JSON.stringify(data, null, 2)}`);
      return { success: true, data: data };
    }
  } catch (error) {
    console.error(`createPost error: `, error);
    return { succes: false, msg: "Could not create the post" };
  }
};

/**
 * Represents a book.
 * @param {numberz} limit - How many posts to fetch
 * @param {string} userId - Fetch the posts made by this user id
 */

export const fetchPosts = async (
  limit = 10,
  currentUserId?: string,
  userId?: string
) => {
  try {
    {
      /* /**
      |----------------------------------------------------------------------------------------------------
      | =>        			If you're looking for posts from a specific user
      |----------------------------------------------------------------------------------------------------
    */
    }
    if (userId) {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `*, 
          user: users (id, name, image),
          postLikes (*),
          comments (count)`
        )
        .order("created_at", { ascending: false })
        .eq("userId", userId)
        .limit(limit);

      if (error) {
        console.error(`fetchPost error: `, error);
        return { success: false, msg: "Could not fetchPosts" };
      }

      return { success: true, data: data };
    } else {
      // TODO: Logic) This could all be rewritten to be one SQL query and be a lot neater, but I'm not there yet
      const { data, error } = await supabase
        .from("posts")
        // this grabs the nsfw setting for EVERY user. Needs just to be only for the current user
        .select(
          `*,
          user: users (id, name, image, blocked_users, filter_objectionable_content),
          postLikes (*),
          comments (count)`
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      const blocked_users =
        data?.find((post) => post.user.id === currentUserId)?.user
          .blocked_users || [];

      let filterObjectionableContent: boolean = data?.find(
        (post) => post.user.id === currentUserId
      )?.user?.filter_objectionable_content;

      if (blocked_users.length > 0) {
        const filteredPosts = data?.filter(
          (post) => !blocked_users.includes(post.userId)
        );
        return {
          success: true,
          data: filteredPosts,
          // This works... but bad implementation....this boolean should be appended to the array but only show up once
          filterObjectionableContent: filterObjectionableContent,
        };
      }

      if (error) {
        console.error(`fetchPost error: `, error);
        return { success: false, msg: "Could not fetchPosts" };
      }

      return {
        success: true,
        data: data,
        filterObjectionableContent: filterObjectionableContent,
      };
    }
  } catch (error) {
    console.error(`fetchPost error: `, error);
    return { success: false, msg: "Could not fetchPosts" };
  }
};

export const fetchPostDetails = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *, 
        postLikes (*),
        comments (*, user: users(id, name, image))
        `
      )
      .eq("id", postId)
      .order("created_at", { ascending: false, referencedTable: "comments" })
      .single();

    if (error) {
      // Code 22P02 is a current bug recognized in supabase: https://tinyurl.com/msbb9dtt
      error.code != "22P02" && console.error(`fetchPostDetails error: `, error);
      return { success: false, msg: "Could not fetch post details" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error(`fetchPost error: `, error);
    return { success: false, msg: "Could not fetchPosts" };
  }
};

export const fetchUserDetails = async (userId: string) => {
  try {
    // const { data, error } = await supabase
    //   .from('posts')
    //   .select(
    //     `
    //     *,
    //     postLikes (*),
    //     comments (*, user: users(id, name, image))
    //     `
    //   )
    //   .eq('id', postId)
    //   .order('created_at', { ascending: false, referencedTable: 'comments' })
    //   .single();

    // Get only the data of the user, not heir posts or anything
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        *
        `
      )
      .eq("id", userId)
      .single();

    if (error) {
      error.code != "22P02" && console.error(`fetchUserDetails error: `, error);
      return { success: false, msg: "Could not fetch user details" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error(`fetchPost error: `, error);
    return { success: false, msg: "Could not fetch user details" };
  }
};

export const fetchBlockedUsers = async (currentUserId: string) => {
  try {
    const { data, error } = await supabase.rpc(
      "get_blocked_users_for_current_user",
      { current_user_id: currentUserId }
    );

    if (error) {
      console.error(
        `fetchBlockedUsers error: `,
        JSON.stringify(error, null, 2)
      );
      return { success: false, msg: "Could not fetch post details" };
    }

    console.log(`data of blocked Users: ${JSON.stringify(data, null, 2)}`);

    return { success: true, data: data };
  } catch (error) {
    console.error(`fetchBlockedUsers error: `, error);
    return { success: false, msg: "Could not fetchBlockedUsers" };
  }
};

export const unblockUser = async (
  currentUserId: string,
  userIdToUnblock: string
) => {
  try {
    const { data, error } = await supabase.rpc("unblock_user", {
      current_user_id: currentUserId,
      user_id_to_unblock: userIdToUnblock,
    });

    if (error) {
      console.error(
        `fetchBlockedUsers error: `,
        JSON.stringify(error, null, 2)
      );
      return { success: false, msg: "Could not fetch post details" };
    }

    console.log(`data of blocked Users: ${JSON.stringify(data, null, 2)}`);

    return { success: true, data: data };
  } catch (error) {
    console.error(`fetchBlockedUsers error: `, error);
    return { success: false, msg: "Could not fetchBlockedUsers" };
  }
};

export const fetchUsersLikedPosts = async (limit = 10, userId: string) => {
  try {
    // const { data, error } = await supabase.rpc("fetch_users_liked_posts", {
    //   user_id: userId,
    // });

    const { data, error } = await supabase
      .from("posts")
      .select(
        `*, 
        user: users (id, name, image),
        postLikes (*),
        comments (count)`
      )
      .order("created_at", { ascending: false })
      .eq("userId", userId)
      .limit(limit);

    if (error) {
      console.error(`fetchUsersLikedPosts error: `, error);
      return { success: false, msg: "Could not fetch this users liked posts" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error(`fetchUsersLikedPosts error: `, error);
    return { success: false, msg: "Could not fetch this users liked posts" };
  }
};

export const createPostLike = async (postLike: any) => {
  try {
    const { data, error } = await supabase
      .from("postLikes")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.error(`postLike error: `, error);
      return { success: false, msg: "Could not like the post" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error(`postLike error: `, error);
    return { success: false, msg: "Could not like the post" };
  }
};

export const removePostLike = async (postId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId);

    if (error) {
      console.error(`postLike error: `, error);
      return { success: false, msg: "Could not remove the postLike" };
    }

    return { success: true };
  } catch (error) {
    console.error(`postLike error: `, error);
    return { success: false, msg: "Could not remove the postLike" };
  }
};

export const createComment = async (comment: string) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(comment)
      .select()
      .single();

    if (error) {
      console.error(`comment error: `, error);
      return { success: false, msg: "Could not comment on post" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error(`comment error: `, error);
    return { success: false, msg: "Could not comment on post" };
  }
};

export const removeComment = async (commentId: string) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.error(`removeComment error: `, error);
      return { success: false, msg: "Could not remove the comment" };
    }

    return { success: true, data: { commentId } };
  } catch (error) {
    console.error(`removeComment error: `, error);
    return { success: false, msg: "Could not remove the comment" };
  }
};

export const removePost = async (postId: any) => {
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      console.error(`removePost error: `, error);
      return { success: false, msg: "Could not remove the post" };
    }

    return { success: true, data: { postId } };
  } catch (error) {
    console.error(`removePost error: `, error);
    return { success: false, msg: "Could not remove the post" };
  }
};

export const reportPost = async (
  postId: number | string,
  category: string,
  currentUserId: string
) => {
  try {
    if (typeof postId == "string") {
      postId = parseInt(postId);
    }

    const { data, error } = await supabase.rpc("report_post", {
      post_id: postId,
      category: category,
      submitted_by: currentUserId,
    });

    if (error) {
      console.error(`reportPost error: `, error);
      return { success: false, msg: "Could not report post!" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error(`reportPost error: `, error);
    return { success: false, msg: "Could not report post!" };
  }
};

export const blockUser = async (
  idOfUserToBlock: number | string,
  currentUserId: number | string
) => {
  try {
    const { data, error } = await supabase.rpc("add_to_blocked_users", {
      current_user_id: currentUserId,
      user_to_block: idOfUserToBlock,
    });

    if (error) {
      console.error(`blockUser error: `, error);
      return { success: false, msg: "Error blocking user!" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error(`blockUser error: `, error);
    return { success: false, msg: "Error blocking user!" };
  }
};
