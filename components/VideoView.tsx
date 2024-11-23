import { StyleSheet, Image, Text, View, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Link, useRouter } from "expo-router";
import { IconButton, withTheme } from "react-native-paper";
import { saveToLibraryAsync } from "expo-media-library";
import { shareAsync } from "expo-sharing";
import { useTheme, Button as PaperButton } from "react-native-paper";
import { useVideoPlayer, VideoView } from "expo-video";
import { hp, wp } from "@/helpers/common";
import { translate } from "@/i18n";

interface VideoViewComponentProps {
  video: string;
  setVideo: React.Dispatch<React.SetStateAction<string>>;
}

const VideoViewComponent = ({ video, setVideo }: VideoViewComponentProps) => {
  const theme = useTheme();
  const videoViewRef = useRef<VideoView>(null);
  const player = useVideoPlayer(video, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
    // player;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  const saveToLibrary = async () => {
    // await saveToLibraryAsync(picture);
    // Alert.alert('Saved!');
  };

  const sharePicture = async () => {
    // await shareAsync(picture);
  };

  useEffect(() => {
    const subscription = player.addListener("playingChange", (isPlaying) => {
      setIsPlaying(isPlaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <View style={[styles.iconButton, { right: 6 }]}>
        <IconButton
          icon={"arrow-down"}
          mode="contained"
          containerColor={theme.colors.background}
          iconColor={theme.colors.onBackground}
          style={{ opacity: 0.7 }}
          onPress={saveToLibrary}
        />
        <IconButton
          icon={"share"}
          mode="contained"
          containerColor={theme.colors.background}
          iconColor={theme.colors.onBackground}
          style={{ opacity: 0.7 }}
          onPress={sharePicture}
        />
      </View>

      {/* Close button */}
      <View style={[styles.iconButton, { left: 6 }]}>
        <IconButton
          icon={"close"}
          mode="contained"
          containerColor={theme.colors.background}
          iconColor={theme.colors.onBackground}
          style={{ opacity: 0.7 }}
          onPress={() => setVideo("")}
        />
      </View>

      {/* Close modal and pass to post page */}

      <>
        <VideoView
          ref={videoViewRef}
          style={styles.videoView}
          contentFit="cover"
          allowsFullscreen
          nativeControls
          player={player}
        />
        <PaperButton
          children={translate("newPostScreen:addToPost")}
          mode="contained"
          contentStyle={{ padding: 20 }}
          labelStyle={{ fontSize: 20 }}
          style={{ marginTop: 20, marginHorizontal: wp(10) }}
          onPress={() => {
            router.dismiss();
            router.setParams({
              cameraCaptureUri: video,
              type: "video",
            });
          }}
        />
      </>
    </View>
  );
};

export default VideoViewComponent;

const styles = StyleSheet.create({
  iconButton: {
    position: "absolute",
    // right: 6,
    zIndex: 1,
    paddingTop: 50,
    gap: 16,
  },

  videoView: {
    // justifyContent: 'center',
    // alignSelf: 'center',
    // width: wp(90),
    width: "100%",
    height: hp(70),
    marginTop: 20,
    borderRadius: 15,
  },
});
