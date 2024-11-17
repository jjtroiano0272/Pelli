import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ViewToken,
  Alert,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { wp } from '@/helpers/common';
import Icon from '@/assets/icons';
import SliderItem, { ImageSliderType } from './SliderItem';
import { faker } from '@faker-js/faker/.';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Pagination from './Pagination';
import { BlurView } from 'expo-blur';

type Props = {
  itemList: ImageSliderType[];
  onPress: () => void;
};

const Slider = ({ itemList, onPress }: Props) => {
  const scrollX = useSharedValue(0);
  const [paginationIndex, setPaginationIndex] = useState(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (
      viewableItems &&
      viewableItems[0]?.index !== undefined &&
      viewableItems[0]?.index !== null
    ) {
      setPaginationIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  return (
    <View>
      <Animated.FlatList
        data={itemList}
        renderItem={({ item, index }) => (
          <SliderItem
            item={item}
            index={index}
            scrollX={scrollX}
            onPress={image => onPress(image)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={onScrollHandler}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      {/* <LinearGradient
        colors={[
          'rgba(255, 255, 255, 1)',
          'rgba(255, 255, 255, 0)',
          'rgba(255, 255, 255, 1)',
        ]}
        style={styles.leftBlur}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 1)',
          'rgba(255, 255, 255, 0)',
          'rgba(255, 255, 255, 1)',
        ]}
        style={styles.rightBlur}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
      /> */}
      <Pagination
        items={itemList}
        scrollX={scrollX}
        paginationIndex={paginationIndex}
      />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  leftBlur: { position: 'absolute', width: '25%', height: '100%' },
  rightBlur: { position: 'absolute', width: '25%', height: '100%', right: 0 },
});
