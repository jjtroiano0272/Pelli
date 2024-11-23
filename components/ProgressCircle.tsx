import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { hp } from "@/helpers/common";
import {
  useTheme as usePaperTheme,
  useTheme,
  withTheme,
} from "react-native-paper";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const radius = 45;
const circumference = radius * Math.PI * 2;

interface ProgressCircleProps {
  progress?: number;
  videoRecordTimeLimit: number;
  size: number;
  isRecording: boolean;
}
const ProgressCircle = ({
  progress,
  videoRecordTimeLimit,
  size,
  isRecording,
}: ProgressCircleProps) => {
  const theme = useTheme();
  const strokeOffset = useSharedValue(circumference);
  const percentage = useDerivedValue(() => {
    const number = ((circumference - strokeOffset.value) / circumference) * 100;
    return withTiming(number, { duration: videoRecordTimeLimit * 1000 }); // looks for time in ms
  });
  const strokeColor = useDerivedValue(() => {
    return interpolateColor(
      percentage.value,
      [0, 50, 100],
      ["#9e4784", "#66347F", "#37306B"]
    );
  });
  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: withTiming(strokeOffset.value, {
        duration: videoRecordTimeLimit * 1000,
      }),
      stroke: strokeColor.value,
    };
  });

  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const countRef = useRef(null); // reference to the interval ID
  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  };
  const handlePause = () => {
    clearInterval(countRef.current);
    setIsPaused(true);
  };
  const handleContinue = () => {
    setIsPaused(false);
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  };
  const handleReset = () => {
    clearInterval(countRef.current);
    setIsActive(false);
    setIsPaused(false);
    setTimer(0);
  };

  useEffect(() => {
    // if (!isRecording) strokeOffset.value = 0;
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg height={size} width={size} viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r="45"
          stroke="#fff"
          strokeWidth="10"
          fill="transparent"
        />
        <AnimatedCircle
          animatedProps={animatedCircleProps}
          cx="50"
          cy="50"
          r="45"
          stroke="#ff0000"
          strokeWidth="10"
          strokeDasharray={`${radius * Math.PI * 2}`}
          fill="transparent"
        />
      </Svg>
    </View>
  );
};

export default ProgressCircle;
