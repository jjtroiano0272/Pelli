import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { wp } from "@/helpers/common";
import Icon from "@/assets/icons";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import {
  useTheme as usePaperTheme,
  useTheme,
  withTheme,
} from "react-native-paper";

export type ImageSliderType = {
  title: string;
  image: ImageSourcePropType;
  description: string;
};

type Props = {
  item: ImageSliderType;
  index: number;
  scrollX: SharedValue<number>;
  onPress?: () => {};
};

const { width } = Dimensions.get("screen");

export const SliderItem = ({ item, index, scrollX, onPress }: Props) => {
  const theme = useTheme();
  const imageScaleFactor = 1;
  const inactiveImageSizeFactor = 0.9;
  const rnAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [-width * 0.25, 0, width * 0.25],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            // Current selected image shows a little larger
            [1 * inactiveImageSizeFactor, 1, 1 * inactiveImageSizeFactor],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.itemContainer, rnAnimatedStyle]}>
      <Image
        source={item.image}
        style={{
          width: 300 * imageScaleFactor,
          height: 500 * imageScaleFactor,
          borderRadius: 20,
        }}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8"]}
        style={styles.background}
      >
        <View style={{ alignItems: "flex-end" }}>
          {/* <TouchableOpacity
            style={[styles.icon, { backgroundColor: paperTheme.colors.error }]}
            onPress={() => onPress(item.image)}
          >
            <Icon
              name='delete'
              color={paperTheme.colors.onError}
              size={32}
              strokeWidth={1.5}
            />
          </TouchableOpacity> */}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default SliderItem;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  textHeader: { fontSize: 42 },
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    width: wp(97), // was 100. Affects gap between photos
  },
  // Adjust this for styling within the card
  background: {
    position: "absolute",
    width: 300,
    height: 500,
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 20,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  description: {
    color: "#fff",
    fontSize: 12,
    letterSpacing: 1.2,
  },
  icon: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 5,
    borderRadius: 30,
  },
});
