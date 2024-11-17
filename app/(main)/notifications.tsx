import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { fetchNotifications } from '@/services/notificationService';
import { hp, wp } from '@/helpers/common';
import { theme } from '@/constants/theme';
import ScreenWrapper from '@/components/ScreenWrapper';
import NotificationItem from '@/components/NotificationItem';
import Header from '@/components/Header';
import { useTheme as usePaperTheme } from 'react-native-paper';
import { translate } from '@/i18n';

const Notifications = () => {
  const paperTheme = usePaperTheme();
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    let res = await fetchNotifications(user.id);
    console.log(`notifications: ${JSON.stringify(res, null, 2)}`);
    if (res.success) {
      setNotifications(res.data);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header
          title={translate('common:notifications')}
          showBackButton={true}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
        >
          {notifications.map(item => {
            return (
              <NotificationItem item={item} key={item?.id} router={router} />
            );
          })}
          {notifications.length == 0 && (
            <Text
              style={[
                styles.noData,
                {
                  color: paperTheme.colors.onBackground,
                },
              ]}
            >
              {translate('common:allCaughtUp')}
            </Text>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: wp(4) },
  listStyle: {
    paddingVertical: 20,
    gap: 10,
  },
  noData: {
    fontSize: hp(1.8),
    // @ts-ignore
    fontWeight: theme.fonts.medium,
    textAlign: 'center',
  },
});
