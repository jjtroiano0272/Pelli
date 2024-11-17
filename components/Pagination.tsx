import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { ImageSliderType } from './SliderItem';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

type Props = {
  items: ImageSliderType[];
  paginationIndex: number;
  scrollX: SharedValue<number>;
};

const { width } = Dimensions.get('screen');

const Pagination = ({ items, paginationIndex, scrollX }: Props) => {
  // const pgAnimationStyle = useAnimatedStyle(() => {
  //   const dotWidth = interpolate(
  //     scrollX.value,
  //     [(index - 1) * width, index * width, (index + 1) * width],
  //     // width of prev, current, and next items
  //     [8, 20, 8],
  //     Extrapolation.CLAMP
  //   );

  //   return { width: dotWidth };
  // });

  return (
    <View style={styles.container}>
      {items.map((_, index: number) => {
        const pgAnimationStyle = useAnimatedStyle(() => {
          const dotWidth = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            // width of prev, current, and next items
            [8, 20, 8],
            Extrapolation.CLAMP
          );

          return { width: dotWidth };
        });
        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              pgAnimationStyle,
              { backgroundColor: paginationIndex === index ? '#222' : '#aaa' },
            ]}
          />
        );
      })}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  dot: {
    backgroundColor: '#aaa',
    height: 8,
    width: 8,
    marginHorizontal: 2,
    borderRadius: 8,
  },
});
