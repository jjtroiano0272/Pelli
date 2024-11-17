import { StyleSheet, Image, Text, View, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { IconButton, Button as PaperButton } from 'react-native-paper';
import { saveToLibraryAsync } from 'expo-media-library';
import { shareAsync } from 'expo-sharing';
import { useTheme as usePaperTheme } from 'react-native-paper';
import Loading from './Loading';
import { translate } from '@/i18n';

interface PictureViewProps {
  picture: string;
  setPicture: React.Dispatch<React.SetStateAction<string>>;
}

const PictureView = ({ picture, setPicture }: PictureViewProps) => {
  let image = { uri: picture };
  const paperTheme = usePaperTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const saveToLibrary = async () => {
    setLoading(true);
    await saveToLibraryAsync(picture);
    setLoading(false);
    Alert.alert('Saved!');
  };

  const sharePicture = async () => {
    setLoading(true);
    await shareAsync(picture);
    setLoading(false);
  };

  useEffect(() => {
    console.log(`picture: ${JSON.stringify(picture, null, 2)}`);
  }, [picture]);

  return (
    <View style={{ backgroundColor: paperTheme.colors.background }}>
      <View
        style={{
          position: 'absolute',
          right: 6,
          zIndex: 1,
          paddingTop: 50,
          gap: 16,
        }}
      >
        <IconButton
          icon={'arrow-down'}
          mode='contained'
          containerColor={paperTheme.colors.background}
          iconColor={paperTheme.colors.onBackground}
          style={{ opacity: 0.7 }}
          onPress={saveToLibrary}
        />
        <IconButton
          icon={'share'}
          mode='contained'
          containerColor={paperTheme.colors.background}
          iconColor={paperTheme.colors.onBackground}
          style={{ opacity: 0.7 }}
          onPress={sharePicture}
        />
      </View>

      <View
        style={{
          position: 'absolute',
          left: 6,
          zIndex: 1,
          paddingTop: 50,
          gap: 16,
        }}
      >
        <IconButton
          icon={'close'}
          mode='contained'
          containerColor={paperTheme.colors.background}
          iconColor={paperTheme.colors.onBackground}
          style={{ opacity: 0.7 }}
          onPress={() => setPicture('')}
        />
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 60,
          zIndex: 1,
          justifyContent: 'center',
          alignSelf: 'center',
        }}
      >
        <PaperButton
          children={translate('newPostScreen:addToPost')}
          mode='contained'
          contentStyle={{ padding: 20 }}
          labelStyle={{ fontSize: 20 }}
          onPress={() => {
            router.dismiss();
            router.setParams({ cameraCaptureUri: picture, type: 'photo' });
          }}
        />
      </View>
      {/* Background image */}
      <Image
        source={image}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </View>
  );
};

export default PictureView;

const styles = StyleSheet.create({});
