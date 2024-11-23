import Loading from "@/components/Loading";
import PictureView from "@/components/PictureView";
import VideoView from "@/components/VideoView";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  Camera,
  CameraViewRef,
  CameraMode,
} from "expo-camera";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button as NativeButton,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  IconButton,
  useTheme as usetheme,
  Button as PaperButton,
  MD3Theme,
  withTheme,
  useTheme,
} from "react-native-paper";
import Button from "@/components/Button";
import { SymbolView } from "expo-symbols";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ProgressCircle from "@/components/ProgressCircle";
import { translate } from "@/i18n";
// import ProgressCircle from 'rn-animated-progress-circle';
import * as Haptics from "expo-haptics";
import { myTheme } from "@/constants/theme";

let videoRecordTimeLimit = 10;

const MediaCapture = () => {
  const theme = useTheme();

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraViewRef>(null);
  const [picture, setPicture] = useState("");
  const [video, setVideo] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [cameraMode, setCameraMode] = useState<CameraMode>("picture");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      // setHasPermission(status === 'granted');
    })();
  }, []);

  const onCameraReady = () => {
    // setIsCameraReady(true);
  };

  const toggleCameraFacing = () => {
    Haptics.selectionAsync();
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleTakePicture = async () => {
    try {
      if (cameraRef.current) {
        const options = { quality: 0.5, base64: true, skipProcessing: true };
        // Throws error on simulator specifically because it fails to take pictures
        const data = await cameraRef.current.takePictureAsync(options);
        const source = data.uri;

        if (source) {
          // await cameraRef.current.pausePreview(); // dunno where this came from
          // setIsPreview(true);
          setPicture(source);
        }
      }
    } catch (error: any) {
      console.log("takePicture error:", error?.message || error);
    }
  };

  const toggleRecord = async () => {
    try {
      if (isRecording) {
        cameraRef?.current?.stopRecording();
        setIsRecording(false);
      } else {
        setIsRecording(true);
        const res = await cameraRef?.current?.recordAsync({
          maxDuration: videoRecordTimeLimit,
        });
        setVideo(res!.uri);
      }
    } catch (error: any) {
      console.log(`toggleRecord error: ${error?.message || error}`);
    }
  };

  useEffect(() => {
    console.log(`cameraMode: ${JSON.stringify(cameraMode, null, 2)}`);
    console.log(`isRecording: ${JSON.stringify(isRecording, null, 2)}`);
    console.log(`picture: ${JSON.stringify(picture, null, 2)}`);
    console.log(`video: ${JSON.stringify(video, null, 2)}`);
  }, [picture, video, cameraMode, isRecording]);

  if (!permission) {
    // Camera permissions are still loading.
    return <Loading />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          {/* TODO Translations */}
          We need your permission to show the camera
        </Text>
        <NativeButton
          onPress={requestPermission}
          title={translate("common:grantPermission")}
        />
      </View>
    );
  }

  if (picture) {
    return <PictureView picture={picture} setPicture={setPicture} />;
  }

  if (video) {
    return <VideoView video={video} setVideo={setVideo} />;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        // onCameraReady={()=>}
        ref={cameraRef}
        mode={cameraMode}
      >
        {/* <View style={styles.buttonContainer}> */}

        <View
          style={{
            position: "absolute",
            top: 20,
            right: 0,
            padding: 20,
          }}
        >
          <IconButton
            icon={"camera-flip-outline"}
            mode="outlined"
            containerColor={theme.colors.background}
            iconColor={theme.colors.onBackground}
            style={{ opacity: 0.7 }}
            onPress={toggleCameraFacing}
          />
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 75,
            // alignSelf: 'center',
            // flexDirection: 'row',
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: 100,
          }}
        >
          <TouchableOpacity
            onPress={
              cameraMode === "picture" ? handleTakePicture : toggleRecord
            }
          >
            <SymbolView
              name={
                cameraMode === "picture"
                  ? "circle"
                  : isRecording
                  ? "record.circle"
                  : "circle.circle"
              }
              size={90}
              type="hierarchical"
              // this has a hard time with paerTheme...dunno why
              tintColor={isRecording ? "#ff0000" : "#fff"}
              animationSpec={{
                effect: {
                  type: isRecording ? "pulse" : "bounce",
                },
                repeating: isRecording,
              }}
            />

            {/* TODO Saved for later */}
            {/* Approach B */}
            {/* <ProgressCircle
              // progress={recordProgress}
              videoRecordTimeLimit={videoRecordTimeLimit}
              size={90}
              isRecording={isRecording}
            /> */}
            {/* Approach C */}
            {/* <ProgressCircle
              value={0.6}
              size={90}
              thickness={7}
              color={isRecording ? '#ff0000' : '#fff'}
              unfilledColor='#fff'
              animationConfig={{ duration: 200 }}
              shouldAnimateFirstValue={false}
            /> */}
          </TouchableOpacity>
        </View>

        <View style={[styles.bottomContainer, styles.directionRowItemsCenter]}>
          <PaperButton
            children="Photo"
            onPress={() => setCameraMode("picture")}
            labelStyle={{
              fontWeight: cameraMode === "picture" ? "bold" : "200",
              fontSize: 22,
            }}
            mode="text"
          />
          <PaperButton
            children="Video"
            onPress={() => setCameraMode("video")}
            labelStyle={{
              fontWeight: cameraMode === "video" ? "bold" : "200",
              fontSize: 22,
            }}
            mode="text"
          />
        </View>

        {/* </View> */}
      </CameraView>
    </View>
  );
};

export default MediaCapture;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 50,
    // borderRadius: 50,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  directionRowItemsCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bottomContainer: {
    width: "100%",
    justifyContent: "space-around",
    position: "absolute",
    alignSelf: "center",
    bottom: 32,
  },
});
