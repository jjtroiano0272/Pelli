import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { theme } from '@/constants/theme';
import { hp } from '@/helpers/common';
import Avatar from './Avatar';
import moment from 'moment';
import { useTheme } from 'react-native-paper';

const NotificationItem = ({ item, router }: any) => {
  const paperTheme = useTheme();
  const handleClick = () => {
    let { postId, commentId } = JSON.parse(item?.data);
    router.push({ pathname: '/postDetails', params: { postId, commentId } });
  };

  const createdAt = moment(item?.created_at).format('MMM D');

  // console.log(`notification item: ${JSON.stringify(item, null, 2)}`);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: paperTheme.colors.backdrop,
          borderColor: paperTheme.colors.outline,
        },
      ]}
      onPress={handleClick}
    >
      <Avatar uri={item?.sender?.image} size={hp(5)} />
      <View style={styles.nameTitle}>
        <Text
          style={[
            styles.text,
            {
              color: paperTheme.colors.onBackground,
            },
          ]}
        >
          {item?.sender?.name}
        </Text>
        <Text style={[styles.text, { color: paperTheme.colors.onBackground }]}>
          {item?.title}
        </Text>
      </View>

      <Text style={[styles.text, { color: paperTheme.colors.onSecondary }]}>
        {createdAt}
      </Text>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderWidth: 0.5,
    padding: 15,
    // paddingVertical:12,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous',
  },
  nameTitle: { flex: 1, gap: 2 },
  text: {
    fontSize: hp(1.6),
    // @ts-ignore
    fontWeight: theme.fonts.medium,
  },
});
