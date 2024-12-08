import { Client } from "@/types/globals";
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

export const destringifyArray = (stringifiedArr: string): string[] | null => {
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

export const joinClientName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`;
};

/** Transform the file arrray into the right shape which has the correct fields that Slider can use. */
export const toSliderItemList = (data: any) => {
  if (!data || !Array.isArray(data)) return null;
  console.log("\x1b[36m" + `data: ${JSON.stringify(data, null, 2)}`);

  return data?.map((item) => ({
    title: item.assetId,
    image: { uri: item.uri },
    description: item.fileName,
  }));
};

export const getAvatarUri = (
  file: any,
  chosenClient: Client,
  editing?: boolean
) => {
  if (file?.uri) {
    console.log(`file?.uri: ${JSON.stringify(file?.uri, null, 2)}`);
    return file.uri;
  }

  if (chosenClient?.profile_image) {
    console.log(
      `chosenClient?.profile_image: ${JSON.stringify(
        chosenClient?.profile_image,
        null,
        2
      )}`
    );

    // Check if the profile_image contains a bracketed array
    return chosenClient.profile_image.includes("[")
      ? chosenClient.profile_image.replace(/[ \[\]"]/g, "").split(",")[0]
      : chosenClient.profile_image;
  }

  return null; // Fallback if nothing is found
};
