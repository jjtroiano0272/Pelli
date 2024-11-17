import * as ImagePicker from 'expo-image-picker';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { getUserImageSrc, uploadFile } from '@/services/imageService';
import Icon from '@/assets/icons';
import { hp, wp } from '@/helpers/common';
import { theme } from '@/constants/theme';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { removeUser, updateUser } from '@/services/userService';
import {
  useTheme as usePaperTheme,
  Button as PaperButton,
} from 'react-native-paper';
import { faker, tr } from '@faker-js/faker';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';
import { translate } from '@/i18n';

type User = {
  name: string;
  phoneNumber: string;
  image: ImagePicker.ImagePickerAsset | string | null;
  bio: string;
  address: string;
};

const editProfile = () => {
  const paperTheme = usePaperTheme();
  const { user: currentUser, setUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [user, setUser] = useState<User>({
    name: '',
    phoneNumber: '',
    image: null,
    bio: '',
    address: '',
  });

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || '',
        phoneNumber: currentUser.phoneNumber || '',
        image: currentUser.image || null,
        address: currentUser.address || '',
        bio: currentUser.bio || '',
      });
    }
  }, [currentUser]);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] });
    }
  };

  const onSubmit = async () => {
    let userData = { ...user };
    let { name, phoneNumber, address, image, bio } = userData;

    if (!name || !phoneNumber || !address || !bio || !image) {
      Alert.alert(translate('common:fieldsMissing'));
      return;
    }

    setLoading(true);

    if (typeof image == 'object') {
      // upload this bishlet
      let imageRes = await uploadFile('profiles', image?.uri, true);
      if (imageRes.success) userData.image = imageRes.data;
      else userData.image = null;
    }
    const res = await updateUser(currentUser?.id, userData);
    setLoading(false);

    if (res.success) {
      setUserData({ ...currentUser, ...userData });
      router.back();
    }
  };

  const submitDeleteAccount = async () => {
    const res = await removeUser(currentUser?.id);

    if (res.success) {
      await supabase.auth.signOut();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/welcome');
    } else {
      Alert.alert(translate('common:deleteTitle'), res.msg);
    }
  };

  const onPressDeleteAccount = async () => {
    Alert.alert(
      translate('editProfileScreen:deletePromptTitle'),
      translate('editProfileScreen:deletePromptDescription'),
      [
        {
          text: translate('common:cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: translate('common:confirmDelete'),
          onPress: () => {
            // Adjective +  Noun
            const randomizedString = [faker.word.adjective(), faker.word.noun()]
              .map((word, index) =>
                index === 0
                  ? word.charAt(0).toUpperCase() + word.slice(1)
                  : word.charAt(0).toUpperCase() + word.slice(1)
              )
              .join('');

            Alert.prompt(
              translate('common:areYouSure'),
              `${translate(
                'editProfileScreen:deleteAccountFinal'
              )}\n\n${randomizedString}`,
              userEnteredText => {
                // Check that text matches
                if (userEnteredText == randomizedString) {
                  submitDeleteAccount();
                }
              }
            );
          },
          style: 'destructive',
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      }
    );
  };

  let imageSource =
    user.image && typeof user.image == 'object'
      ? user.image
      : getUserImageSrc(user?.image);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title={translate('editProfileScreen:title')} />

          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image
                source={imageSource}
                style={[
                  styles.avatar,
                  {
                    borderColor: paperTheme.colors.outline,
                  },
                ]}
              />
              <Pressable
                style={[
                  styles.cameraIcon,
                  {
                    shadowColor: paperTheme.colors.shadow,
                  },
                ]}
                onPress={onPickImage}
              >
                <Icon name='userEdit' />
              </Pressable>
            </View>

            <Text
              style={{
                fontSize: hp(1.5),
                color: paperTheme.colors.onBackground,
              }}
            >
              {translate('editProfileScreen:formPrompt')}
            </Text>
            <Input
              icon={<Icon name='user' />}
              placeholder={translate('common:nameInputPlaceholder')}
              value={user.name}
              onChangeText={(value: string) =>
                setUser({ ...user, name: value })
              }
            />
            <Input
              icon={<Icon name='phone' />}
              placeholder={translate('common:phoneInputPlaceholder')}
              value={user.phoneNumber}
              onChangeText={(value: string) =>
                setUser({ ...user, phoneNumber: value })
              }
            />
            <Input
              icon={<Icon name='location' />}
              placeholder={translate('common:addressInputPlaceholder')}
              value={user.address}
              onChangeText={(value: string) =>
                setUser({ ...user, address: value })
              }
            />
            <Input
              placeholder={translate('common:bioInputPlaceholder')}
              value={user.bio}
              multiline={true}
              containerStyle={styles.bio}
              onChangeText={(value: string) => setUser({ ...user, bio: value })}
            />

            <Button
              title={translate('common:update')}
              loading={loading}
              onPress={onSubmit}
            />
            {/* <Button
              buttonStyle={
                {
                  // backgroundColor: '#ff0000',
                }
              }
              title='DELETE ACCOUNT'
              loading={loading}
              onPress={onSubmitDeleteAccount}
            /> */}

            <PaperButton
              children={translate('editProfileScreen:deleteAccountButtonTitle')}
              uppercase
              mode='outlined'
              onPress={onPressDeleteAccount}
              textColor={paperTheme.colors.error}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default editProfile;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: wp(4) },
  textHeader: { fontSize: 42 },

  form: { gap: 18, marginTop: 20 },
  avatarContainer: { height: hp(14), width: hp(14), alignSelf: 'center' },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: -18,
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  input: {
    flexDirection: 'row',
    borderWidth: wp(0.4),
    // borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous',
    padding: 17,
    paddingHorizontal: 20,
    gap: 15,
  },
  bio: {
    flexDirection: 'row',
    height: hp(15),
    alignItems: 'flex-start',
    paddingVertical: 15,
  },
});
