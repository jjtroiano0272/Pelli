import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  Pressable,
  TextInputProps,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { myTheme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import Avatar from "@/components/Avatar";
import RichTextEditor from "@/components/RichTextEditor";
import { useAuth } from "@/context/AuthContext";
import Icon from "@/assets/icons";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import { getSupabaseFileUrl } from "@/services/imageService";
import { Video } from "expo-av";
import {
  createOrUpdatePost,
  fetchPostDetails,
  updatePost,
} from "@/services/postService";
import {
  Chip,
  IconButton,
  MD3Theme,
  useTheme,
  useTheme as usetheme,
  withTheme,
} from "react-native-paper";
import Input from "@/components/Input";
import Picker from "@/components/Picker";
import { translate } from "@/i18n";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import Slider from "@/components/Slider";
import { faker } from "@faker-js/faker/.";
import SearchableTextInput from "@/components/SearchableTextInput";
import {
  createOrUpdateClient,
  fetchClientDetails,
} from "@/services/clientService";
import { Client } from "@/types/globals";

const NewPost = ({ route }: { route: any }) => {
  const theme = useTheme();
  // original:
  const post = useLocalSearchParams();

  console.log("\x1b[37m" + `post params: ${JSON.stringify(post, null, 2)}`);

  // const { post, editing }: { [key: string]: any } = useLocalSearchParams();
  // const {
  //   id,
  //   clientId,
  //   editing,
  // }: { [key: string]: any; clientId: number; editing: number } =
  //   useLocalSearchParams();
  const { user } = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const clientNameRef = useRef("");
  const formulaDescriptionRef = useRef("");
  const formulaTypeRef = useRef("");
  const [selectedClient, setSelectedClient] = useState<Client | null>();
  const [isNewClient, setIsNewClient] = useState(false);
  const [fromNewPost, setFromNewPost] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<
    // | ImagePicker.ImagePickerAsset
    ImagePicker.ImagePickerAsset[] | null | undefined
  >();
  const [inputValue, setInputValue] = useState("");
  const ref = useRef<{
    inputValue: string;
    otherValueYouCanImagine: number | string | null;

    formulaType: string;
    formulaDescription: string;
  }>({
    inputValue: "",
    otherValueYouCanImagine: null,

    formulaType: "",
    formulaDescription: "",
  });

  const getAllDetails = async (clientId: string) => {
    setLoading(true);
    let [clientRes, postRes] = await Promise.all([
      fetchClientDetails(clientId),
      fetchPostDetails(post.id),
    ]);
    setLoading(false);

    console.log(`clientRes: ${JSON.stringify(clientRes, null, 2)}`);
    console.log(`postRes: ${JSON.stringify(postRes, null, 2)}`);

    if (clientRes?.success && postRes?.success) {
      // bodyRef.current = "DOES ANYTHING FUCKING SHOW UP";

      console.log(
        `on success => clientRes.data: ${JSON.stringify(
          clientRes.data,
          null,
          2
        )}`
      );

      setFile([postRes?.data?.file]);

      // Set the input values to be what's coming down from the server
      // ✅
      const { formula_type, formula_description } = postRes?.data?.formula_info;
      ref.current.formulaType = formula_type;
      setInputValue(formula_type);
      ref.current.formulaDescription = formula_description;

      // Previous approach
      // formulaTypeRef.current = postRes?.data?.formula_info?.formula_type;
      // formulaDescriptionRef.current =
      //   postRes?.data?.formula_info?.formula_description;

      // set client:Client which we will pass in to searchableTextInput
      setSelectedClient(clientRes?.data);
      setFromNewPost(true);
    } else {
      console.error(clientRes.msg);
      console.error(postRes.msg);
    }

    // return [clientRes, postRes];

    // if (res.success) {
    //   // set state or var that will be rendered
    //   return res.data;
    // } else {
    //   // TODO Make snackbar notification
    //   Alert.alert("Couldn't get client data", res.msg);
    // }
  };

  // Fills the post data if it exists on server
  useEffect(() => {
    if (post && post.id) {
      console.log(`post, 167: ${JSON.stringify(post, null, 2)}`);

      getAllDetails(post?.clientId);

      bodyRef.current = post.body;
      setFile(post.file || null);

      setTimeout(() => {
        editorRef?.current?.setContentHTML(post.body);
      }, 500);
    } else {
      console.log(
        "\x1b[32m" + `falsy => post: ${JSON.stringify(post, null, 2)}`
      );
    }
  }, []);

  useEffect(() => {
    console.log(`post: ${JSON.stringify(post, null, 2)}`);

    if (post?.cameraCaptureUri) {
      console.log(`params passed in: ${JSON.stringify(post, null, 2)}`);

      if (!file || file[0].uri !== post?.cameraCaptureUri) {
        setFile([{ uri: post?.cameraCaptureUri, type: post?.type }]);
      }
    }

    if (post?.uri) {
      console.log(`in if post?.uri`);
      let videoUri = post.uri;

      getFileDetails(videoUri)
        .then((res) => setFile(res))
        .catch((error) =>
          console.log(`getFileDetails on call error: ${error}`)
        );
      // setFile(post?.uri);
    } else {
      // console.log(`falsy`);
    }
  }, [post?.cameraCaptureUri, post?.uri]);

  // TODO Create type
  // Comes from ImagePicker
  // When selecting video from photo roll, it returns ImagePickerAsset
  /* Type mockup...only thing in 'common' is 'fileSize (ImagePicker) => size (expo-file))
  
    {    
        "fileSize": 5945935, (size)
        "type": "video",
        "mimeType": "video/quicktime",
        "uri": "file:///var/mobile/Containers/Data/Application/47897D7E-1A53-49DB-B...4.mov",
        "height": 1920,
        "assetId": null,
        "base64": null,
        "width": 1080,
        "duration": 3865,
        "fileName": null,
        "exif": null
    }
  */
  const getFileDetails = async (fileUri: string) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      const asset = await MediaLibrary.getAssetInfoAsync(fileUri);

      return {
        ...fileInfo,
        type: "video",
      };
    } catch (error) {
      console.log(`getFileDetails error: ${JSON.stringify(error, null, 2)}`);
    }
  };

  const onPick = async (isImage: boolean) => {
    let multiSelect = true;
    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: multiSelect,
      allowsEditing: !multiSelect, // !multiSelect
      aspect: [4, 3],
      quality: 0.7,
    };

    // Only allowing single video selection
    if (!isImage) {
      mediaConfig = {
        ...mediaConfig,
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        allowsMultipleSelection: false,
      };
    }

    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    // Finally, set the file selected to the global var.
    if (!result.canceled) {
      // result.assets
      // File works with object methods, but will need to work with array of object methods

      // if (result.assets.length === 1) {
      //   console.log(`selecting one photo from roll`);
      //   setFile(result.assets[0]);
      // }

      // if (result.assets.length > 1) {
      //   setFile(result.assets);
      // }
      setFile(result.assets);
    }
  };

  const onSubmit = async () => {
    // Cancel if there's either no media or anything written
    if (!bodyRef.current && !file) {
      Alert.alert(
        translate("common:post"),
        translate("newPostScreen:chooseSomeMedia")
      );
      return;
    }
    console.log(`body: ${JSON.stringify(bodyRef.current, null, 2)}`);
    console.log(`file: ${JSON.stringify(file, null, 2)}`);

    // Create client if they don't yet exist in the db
    let clientRes;
    let newClientId;
    if (isNewClient) {
      setLoading(true);
      clientRes = await createOrUpdateClient({
        first_name: selectedClient?.first_name,
        last_name: selectedClient?.last_name,
      });
      setLoading(false);
      console.log(`clientRes: ${JSON.stringify(clientRes, null, 2)}`);

      if (clientRes.success) {
        newClientId = clientRes?.data?.id;
      }
    }

    let data = {
      // Check postRes log for what's comin in
      // file: file ? ,
      file,
      body: bodyRef?.current,
      // client_name: clientNameRef?.current,
      clientId: !isNewClient ? selectedClient?.id : newClientId,
      formula_info: {
        // formula_type: formulaTypeRef?.current,
        // formula_description: formulaDescriptionRef?.current,

        formula_type: ref.current.formulaType,
        formula_description: ref.current.formulaDescription,
      },
      userId: user?.id,
    };

    console.log(
      "\x1b[32m" + `data to submit: ${JSON.stringify(data, null, 2)}`
    );

    // If the post already exists, replace the submitting id to the id of the post that exists in the db
    // and copy over other fields.
    if (post && post?.id) {
      console.log(
        "\x1b[36m" + `post in equal: ${JSON.stringify(post, null, 2)}`
      );

      data.id = post.id;
      data.file = post.file;
      data.clientId = post.clientId;

      setLoading(true);
      let res = await updatePost(data);
      setLoading(false);

      if (res?.success) {
        setFile(null);
        bodyRef.current = "";
        editorRef.current?.setContentHTML("");
        clientNameRef.current = "";

        router.back();
      } else {
        Alert.alert("Update", res?.msg);
      }

      return;
    }

    // create post
    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);

    console.log(`post res: ${JSON.stringify(res, null, 2)}`);

    // Clear fields on post success
    if (res?.success) {
      setFile(null);
      bodyRef.current = "";
      editorRef.current?.setContentHTML("");
      clientNameRef.current = "";

      router.back();
    } else {
      Alert.alert("Post", res?.msg);
    }
  };

  const isLocalFile = (file: any) => {
    if (!file) return null;
    if (typeof file == "object") return true;

    return false;
  };

  const getFileType = (file: any) => {
    if (!file) return null;

    if (isLocalFile(file)) {
      return file.type;
    }

    // This means it's on the server.
    if (file.includes("postImages")) {
      return "image";
    }

    return "video";
  };

  const getFileUri = (file: any) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.uri;
    }

    return getSupabaseFileUrl(file)?.uri;
  };

  useEffect(() => {
    console.log(`file state var: ${JSON.stringify(file, null, 2)}`);
    console.log(
      `selectedClient (parent cpt): ${JSON.stringify(selectedClient, null, 2)}`
    );
  }, [file, selectedClient]);

  /** Transform the file arrray into the right shape which has the correct fields that Slider can use. */
  const transformData = (data) => {
    if (!data || !Array.isArray(data)) return null;
    console.log("\x1b[36m" + `data: ${JSON.stringify(data, null, 2)}`);

    return data?.map((item) => ({
      title: item.assetId,
      image: { uri: item.uri },
      description: item.fileName,
    }));
  };

  // The uri looks like "file:///var/mobile/Containers/Data/Application/47897D7E-1A53-49DB-B17D...BB8B-317765E87EAC.png"
  const handleRemoveImage = (uri: string) => {
    console.log(
      `Expecting to see the object for the image upon which delete was pressed`
    );
    console.log(`image: ${JSON.stringify(uri, null, 2)}`);
  };

  const onChangeInput: TextInputProps["onChange"] = (event) => {
    ref.current.inputValue = event.nativeEvent.text;

    setInputValue(event.nativeEvent.text);
  };

  useEffect(() => {
    console.log(`selectedClient: ${JSON.stringify(selectedClient, null, 2)}`);
    console.log(
      `ref.current.formulaType: ${JSON.stringify(
        ref.current.formulaType,
        null,
        2
      )}`
    );
    console.log(
      `ref.current.formulaDescription: ${JSON.stringify(
        ref.current.formulaDescription,
        null,
        2
      )}`
    );
  }, [
    selectedClient,
    ref.current.formulaDescription,
    ref.current.formulaType,
    ref.current.inputValue,
    ref.current,
    ref,
  ]);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header
          title={translate(
            !post?.editing
              ? "newPostScreen:title"
              : "newPostScreen:editingTitle"
            // "newPostScreen:title"
          )}
          showBackButton
        />
        <ScrollView
          contentContainerStyle={{ gap: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* avatar */}
          <View style={styles.header}>
            <Avatar
              uri={user?.image}
              size={hp(6.5)}
              rounded={myTheme.radius.xl}
            />
            <View style={{ gap: 2 }}>
              <Text
                style={[
                  styles.username,
                  {
                    color: theme.colors.onBackground,
                    fontWeight: "600",
                  },
                ]}
              >
                {user && user.name}
              </Text>
              <Text
                style={[
                  styles.publicText,
                  {
                    color: theme.colors.secondary,
                    fontWeight: "500",
                  },
                ]}
              >
                {translate("common:public")}
              </Text>
            </View>
          </View>

          {/* Client input */}
          {selectedClient &&
          selectedClient.first_name &&
          selectedClient.last_name ? (
            <View
              style={{
                borderColor: theme.colors.outline,
                borderRadius: myTheme.radius.xxl,

                flexDirection: "row",
                height: hp(7.2),
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 0.4,
                borderCurve: "continuous",
                paddingHorizontal: 18,
                gap: 12,
                backgroundColor: theme.colors.secondaryContainer,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12, // Space between Avatar and Text
                }}
              >
                {selectedClient.profile_image && (
                  <Avatar uri={selectedClient.profile_image} size={hp(6)} />
                )}
                <Text
                  style={{ color: theme.colors.onSecondaryContainer }}
                >{`${selectedClient.first_name} ${selectedClient.last_name}`}</Text>
              </View>

              <IconButton
                icon={"close-circle"}
                style={{ right: -10, overflow: "hidden" }}
                onPress={() => setSelectedClient(undefined)}
              />
            </View>
          ) : (
            <SearchableTextInput
              selectedClient={selectedClient}
              setSelectedClient={setSelectedClient}
              isNewClient={isNewClient}
              setIsNewClient={setIsNewClient}
            />
          )}

          {/* Formula type */}
          <Input
            // icon={<Icon name="user" size={26} strokeWidth={1.6} />}
            autoCapitalize="words"
            placeholder={translate("newPostScreen:formulaTypePlaceholder")}
            // A)
            // onChangeText={(value: string) => (formulaTypeRef.current = value)}
            // value={formulaTypeRef.current}

            // B)
            defaultValue={ref.current.formulaType}
            value={inputValue}
            onChange={onChangeInput}
          />
          <Text>{inputValue}</Text>
          {/* Formula description */}
          <Input
            // icon={<Icon name='user' size={26} strokeWidth={1.6} />}
            autoCapitalize="words"
            placeholder={translate(
              "newPostScreen:formulaDescriptionPlaceholder"
            )}
            // onChangeText={(value: string) =>
            //   (formulaDescriptionRef.current = value)
            // }
            // value={formulaDescriptionRef.current}

            defaultValue={ref.current.formulaDescription}
            onChange={onChangeInput}
          />

          <View>
            <RichTextEditor
              editorRef={editorRef}
              onChange={(body) => (bodyRef.current = body)}
            />
          </View>

          {/* /**
            |----------------------------------------------------------------------------------------------------
            | =>        			Handling media from media library...single media to show
            |----------------------------------------------------------------------------------------------------
          */}
          {file && file.length === 1 && (
            <View
              style={[
                styles.file,
                {
                  borderRadius: myTheme.radius.xl,
                },
              ]}
            >
              {getFileType(file[0]) == "video" ? (
                <Video
                  style={{ flex: 1 }}
                  source={{ uri: getFileUri(file[0]) }}
                  useNativeControls
                  resizeMode="cover"
                  isLooping
                />
              ) : (
                <Image
                  style={{ flex: 1 }}
                  source={{ uri: getFileUri(file[0]) }}
                  resizeMode="cover"
                />
              )}
              <Pressable style={styles.closelcon} onPress={() => setFile(null)}>
                <Icon name="delete" size={20} color="white" />
              </Pressable>
            </View>
          )}
          {/* /**
            |----------------------------------------------------------------------------------------------------
            | =>        			Multiple media shown
            |----------------------------------------------------------------------------------------------------
          */}
          {file && file?.length > 1 && transformData(file) && (
            <Slider
              itemList={transformData(file)}
              onPress={handleRemoveImage}
            />
          )}

          {/* /**
            |----------------------------------------------------------------------------------------------------
            | =>        			Media Capture
            |----------------------------------------------------------------------------------------------------
          */}
          <View
            style={[
              styles.media,
              {
                borderColor: theme.colors.outline,
                borderRadius: myTheme.radius.xl,
              },
            ]}
          >
            <Text
              style={[
                styles.addImageText,
                {
                  color: theme.colors.onBackground,
                  fontWeight: "500",
                },
              ]}
            >
              {translate("newPostScreen:addToPost")}
            </Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity
                onPress={() => router.push("/(main)/mediaCapture")}
              >
                <Icon
                  name="camera"
                  size={30}
                  color={theme.colors.onBackground}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPick(true)}>
                <Icon
                  name="image"
                  size={30}
                  color={theme.colors.onBackground}
                />
              </TouchableOpacity>
              {/* TODO Generalize component for readability...later */}
              {/* upload video from roll */}
              <TouchableOpacity onPress={() => onPick(false)}>
                <Icon
                  name="video"
                  size={33}
                  color={theme.colors.onBackground}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Button
          // disabled={clientNameRef.current.length === 0}
          buttonStyle={{ height: hp(6.2) }}
          title={
            post && post.id
              ? translate("common:update")
              : translate("common:postActionButton")
          }
          loading={loading}
          hasShadow={false}
          onPress={onSubmit}
        />
      </View>
    </ScreenWrapper>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15,
  },
  textHeader: { fontSize: 42 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  username: {
    fontSize: hp(2.2),
  },
  publicText: {
    fontSize: hp(1.7),
  },
  textEditor: {
    // marginTop: 10
  },
  media: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderCurve: "continuous",
  },
  mediaIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  addImageText: {
    fontSize: hp(1.9),
  },
  file: {
    height: hp(30),
    width: "100%",
    overflow: "hidden",
    borderCurve: "continuous",
  },
  video: {},
  closelcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "rgba(255, 0, 0, 0.6)",
    // shadowColor: theme.colors.textLight,
    // shadowOffset: {width: 0, height: 3},
    // shadow0pacity: 0.6,
    // shadowRadius:
  },
});
