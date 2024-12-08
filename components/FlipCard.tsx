import { faker } from "@faker-js/faker/.";
import React, { ReactNode, useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Image,
  ViewStyle,
} from "react-native";
import { useTheme } from "react-native-paper";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const RegularContent = () => {
  return (
    <View
    // style={regularContentStyles.card}
    >
      {/* <Text style={regularContentStyles.text}>Regular content ✨</Text> */}
      <Image
        source={require("@/assets/images/strands-logo-2-circle-transparent.png")}
        style={{
          width: 50,
          height: 50,
        }}
      />
    </View>
  );
};

const regularContentStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#b6cff7",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#001a72",
  },
});

interface FlippedContentProps {
  content?: string;
}

const FlippedContent = ({ content }: FlippedContentProps) => {
  const theme = useTheme();
  return (
    <View style={flippedContentStyles.card}>
      <Text style={flippedContentStyles.text}>{content}</Text>
    </View>
  );
};

const flippedContentStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#baeee5",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#001a72",
  },
});

interface FlipCardProps {
  isFlipped: boolean;
  cardStyle: ViewStyle;
  direction: string;
  duration: number;
  RegularContent: JSX.Element;
  FlippedContent: JSX.Element;
  content: JSX.Element;
}
const FlipCard = ({
  isFlipped,
  cardStyle,
  direction = "y",
  duration = 500,
  RegularContent,
  FlippedContent,
  content,
}: FlipCardProps) => {
  const isDirectionX = direction === "x";
  const regularCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.valueOf), [0, 1], [0, 180]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration });
    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
    };
  });
  const flippedCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(
      Number(isFlipped.valueOf),
      [0, 1],
      [180, 360]
    );
    const rotateValue = withTiming(`${spinValue}deg`, { duration });
    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
    };
  });
  return (
    <View>
      <Animated.View
        style={[
          flipCardStyles.regularCard,
          cardStyle,
          regularCardAnimatedStyle,
        ]}
      >
        {RegularContent}
      </Animated.View>
      <Animated.View
        style={[
          flipCardStyles.flippedCard,
          cardStyle,
          flippedCardAnimatedStyle,
        ]}
      >
        <FlippedContent content={content} />
      </Animated.View>
    </View>
  );
};

const flipCardStyles = StyleSheet.create({
  regularCard: {
    position: "absolute",
    zIndex: 1,
  },
  flippedCard: {
    backfaceVisibility: "hidden",
    zIndex: 2,
  },
});

function App() {
  const isFlipped = useSharedValue(false);
  const [flippedContent, setFlippedContent] = useState("");

  const getContent = () => {
    return faker.animal.bird();
  };

  const handlePress = () => {
    const newContent = getContent();
    setFlippedContent(newContent);
    isFlipped.value = !isFlipped.value;
  };

  return (
    <Pressable onPress={handlePress}>
      <FlipCard
        isFlipped={isFlipped}
        cardStyle={styles.flipCard}
        FlippedContent={FlippedContent} // pass component itself
        RegularContent={<RegularContent />}
        content={flippedContent} // pass content prop
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  flipCard: {
    // width: 170,
    // height: 200,
    width: 50,
    height: 50,
  },
});
