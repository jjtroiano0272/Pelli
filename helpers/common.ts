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

export const formatToPhone = (str: string) => {
  const digits = str.replace(/\D/g, "").substring(0, 10);
  const areaCode = digits.substring(0, 3);
  const prefix = digits.substring(3, 6);
  const suffix = digits.substring(6, 10);

  if (digits.length > 6) {
    str = `(${areaCode}) ${prefix} - ${suffix}`;
  } else if (digits.length > 3) {
    str = `(${areaCode}) ${prefix}`;
  } else if (digits.length > 0) {
    str = `(${areaCode}`;
  }

  return str;
};

export const unformatPhone = (str: string) => {
  return str.replace(/\D/g, "").substring(0, 10);
};

// Feed it clientName
export const splitClientName = (str: string) => {
  const firstName = str.split(" ")[0];
  const lastName = str.split(" ")[1];

  return { firstName, lastName };
};

export const joinClientName = (str: string) => {
  const first_name = clientName.split(" ")[0];
  const last_name = clientName.split(" ")[1];

  return [first_name, last_name];
};
