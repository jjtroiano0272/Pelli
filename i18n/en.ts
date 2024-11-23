import editBlockedUsers from "@/app/(main)/editBlockedUsers";
import { appName } from "@/constants";

const en = {
  common: {
    appName: "Pelli",
    welcome: `Welcome!`,
    alreadyHaveAccount: `Already have an account?`,
    dontHaveAccount: `Don't have an account?`,
    loginText: `Login`,
    forgotPassword: `Forgot password?`,
    public: "Public",

    endOfList: `Nothing more here!`,
    fieldsMissing: "Please fill out all fields!",
    deleteTitle: "Deletion",
    cancel: "Cancel",
    confirmDelete: `Yes, Delete`,
    confirmLogout: "Are you sure you want to log out?",
    areYouSure: "Are you sure?",
    nameInputPlaceholder: "Enter name",
    emailInputPlaceholder: "Enter email",
    passwordInputPlaceholder: "Enter password",
    phoneInputPlaceholder: "Enter phone number",
    addressInputPlaceholder: "Enter address",
    bioInputPlaceholder: "Enter bio",

    update: "Update",
    post: "Post",
    clientName: "Client name",
    allCaughtUp: "All caught up!",
    comment: "Comment",
    commentVerb: "Comment",
    signOut: "Sign Out",
    confirm: "Confirm",
    logout: "Logout",
    login: "Login",
    signUp: "Sign Up",
    profile: "Profile",
    notifications: "Notifications",
    postActionButton: "Post",
    submit: "Submit",
    grantPermission: "Grant Permission",
    done: "Done",
    deletedUser: "[deleted]",
  },
  errors: {
    signOut: "Error signing out",
  },

  // Screen-specific
  welcomeScreen: {
    title: `Welcome!`,
    missionStatement: `We want to give you one place to share details about your clients
            like what their hair responds best to, and success and pitfalls you
            may have had with them!`,
    gettingStarted: "Getting Started",
  },
  signUpScreen: {
    title: `Sign Up`,
    alerts: {
      fieldsMissing: `Please fill all the fields in order to create your account`,
    },
    getStarted: `Let's\nGet Started`,
    formPrompt: `Please fill in all details to create your own account`,
  },
  loginScreen: {
    title: `Login`,
    fieldsMissing: `Fields missing!`,
    welcomeBack1: `Hey,`,
    welcomeBack2: `Welcome Back`,
    pleaseLogin: `Please login to continue`,
  },
  homeScreen: {
    clientName: "Client",
  },
  editProfileScreen: {
    title: "Edit Profile",
    formPrompt: "Please fill in your profile details",
    deleteAccountButtonTitle: "Delete account",
    deletePromptTitle: "Delete account?",
    deletePromptDescription: `Once you delete your account, your profile and username are permanently removed from ${appName} and your posts and comments are disassociated (will show up as 'deleted user') from your account`,
    deleteAccountFinal: `This action will completely remove your account. Enter the text below to proceed (case-sensitive!)`,
  },
  newPostScreen: {
    chooseSomeMedia: "Choose some media or something to post!",
    formulaTypePlaceholder: "Type (e.g. AVEDA, Tramesi, ...)",
    formulaDescriptionPlaceholder: "Description (e.g. 20g Bronze + 40 AU)",
    addToPost: "Add to post",
    title: "Create Post",
    postBodyPlaceholder: `What are some details about your client you'd like to share?`,
  },
  postCard: { formulaCopied: "Formula copied!" },
  postDetailsSreen: {
    noPosts: "No post here!",
    commentInputPlaceholder: "Type comment...",
    noCommentsYet: "Be the first comment!",
    confirmDeletePost: "Delete post?",
  },
  profileScreen: {
    myRecentPosts: "My recent posts:",
    contentSettings: "Content Settings",
    showNsfw: "Show posts marked inappropriate",
    editBlockedUsers: "Edit Blocked Users",
  },
  forgotPasswordScreen: {
    title: "Reset Password",
    sendReset: "Send Password Reset",
    newPasswordPrompt: "What would you like your new password to be?",
    passwordUpdateSuccess: "Password updated successfully!", // *
    passwordUpdateError: "There was an error updating your password", // *
    alerts: {
      emailMissing: "Email cannot be left blank!",
    },
  },
  editBlockedUsersScreen: {
    title: "Blocked Users",
    noUsers: `You don't have any blocked users!`,
  },
  reportPostScreen: {
    thankYou: `Thank you for chosing to submit a report. It's important that Pelli
          remains a friendly place to be!`,
    title: "Report Post",
  },
  searchableTextInputScreen: { addClient: "Add as new client" },

  errorScreen: {},
  emptyStateComponent: {
    generic: {},
  },

  /**
   * Not yet added
   */
  // 'Post flagged!',
  // 'This post will also no longer be shown to you.',
  // 'Error calling markPostNsfw',
  // 'Could not unlike post',
  // 'Something went wrong'
};

export default en;
export type Translations = typeof en;
