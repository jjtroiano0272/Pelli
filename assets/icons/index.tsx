import { StyleSheet, Text, View } from "react-native";
import React, { PropsWithChildren } from "react";
import { Link } from "expo-router";
import { myTheme } from "@/constants/theme";
import Home from "./Home";
import ArrowLeft from "./ArrowLeft";
import Notification from "./Notification";
import AddCircle from "./AddCircle";
import Image from "./Image";
import Video from "./Video";
import Delete from "./Delete";
import Phone from "./Phone";
import User from "./User";
import UserCircle from "./UserCircle";
import UserEdit from "./UserEdit";
import Email from "./Email";
import LockPassword from "./LockPassword";
import Logout from "./Logout";
import MoreHorizontal from "./MoreHorizontal";
import Location from "./Location";
import Heart from "./Heart";
import Share from "./Share";
import Comment from "./Comment";
import Send from "./Send";
import Edit from "./Edit";
import Camera from "./Camera";
import { useTheme } from "react-native-paper";

const icons = {
  home: Home,
  arrowLeft: ArrowLeft,
  notification: Notification,
  addCircle: AddCircle, // plus sign newpost
  image: Image,
  video: Video,
  delete: Delete,
  phone: Phone,
  user: User,
  userCircle: UserCircle,
  userEdit: UserEdit,
  email: Email,
  lockPassword: LockPassword,
  logout: Logout,
  moreHorizontal: MoreHorizontal,
  location: Location,
  heart: Heart,
  share: Share,
  comment: Comment,
  send: Send,
  edit: Edit,
  camera: Camera,
};

type IconProps = {
  name: keyof typeof icons;
  size?: number;
  strokeWidth?: number;
  color?: string;
};

const Icon = ({ name, ...props }: IconProps) => {
  const theme = useTheme();
  // const IconComponent = Home;
  const IconComponent = icons[name];

  return (
    <IconComponent
      height={props.size || 24}
      width={props.size || 24}
      strokeWidth={props.strokeWidth || 1.9}
      color={myTheme.colors.textLight}
      {...props}
    />
  );
};

export default Icon;
