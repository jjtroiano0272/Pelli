import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

export const hp = (percentage: number) => {
  return (percentage * deviceHeight) / 100;
};

export const wp = (percentage: number) => {
  return (percentage * deviceWidth) / 100;
};

export const stripHtmlTags = (html: string) => {
  return html.replace(/<[^>]*>?/gm, "");
};

export const destringifyArray = (stringifiedArr: string) => {
  if (!stringifiedArr) {
    console.log("Error in array");
    return null;
  }
  return stringifiedArr.replace(/[ \[\] "]/g, "").split(",");
};
