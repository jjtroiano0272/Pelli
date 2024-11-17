import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@/lib/supabase';
import { supabaseUrl } from '@/constants';
import { ImagePickerAsset } from 'expo-image-picker';

export const getUserImageSrc = (imagePath: string) => {
  if (imagePath) {
    return getSupabaseFileUrl(imagePath);
  } else {
    // defaultUser
    return require('../assets/images/default-user.png');
  }
};

export const getSupabaseFileUrl = (filePath: string) => {
  if (!filePath) return null;

  // console.log(`filePath: ${JSON.stringify(filePath, null, 2)}`);
  return {
    uri: filePath.includes('dicebear')
      ? filePath
      : `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`,
  };
};

export const downloadFile = async (url: string) => {
  try {
    const { uri } = await FileSystem.downloadAsync(url, getLocalFilePath(url));
    return uri;
  } catch (error) {
    return null;
  }
};

export const getLocalFilePath = (filePath: string) => {
  let fileName = filePath.split('/').pop();
  return `${FileSystem.documentDirectory}${fileName}`;
};

// export const getLocalFilePath = () => {};

export const uploadFile = async (
  folderName: string,
  fileUri: string,
  isImage = true
) => {
  try {
    /* 
      ERROR  File upload error => Error: Calling the 'readAsStringAsync' function has failed
      → Caused by: The 1st argument cannot be cast to type URL
      → Caused by: Cannot convert 'Optional(nil)' to URL
    */
    console.log(`fileUri: ${JSON.stringify(fileUri, null, 2)}`);

    let fileName = getFilePath(folderName, isImage);
    let fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    let fileData = decode(fileBase64);
    let { data, error } = await supabase.storage
      .from('uploads')
      .upload(fileName, fileData, {
        cacheControl: '3600',
        upsert: false,
        contentType: isImage ? 'image/*' : 'video/*',
      });

    if (error) {
      console.error(`File upload error => ${error}`);
      return { success: false, msg: 'Could not upload media' };
    }

    return { success: true, data: data?.path };
  } catch (error) {
    console.error(`File upload error => ${error}`);
    return { success: false, msg: 'Could not upload media' };
  }
};

export const uploadMultipleFiles = async (
  folderName: string,
  imageArr: ImagePickerAsset[],
  isImage = true
) => {
  try {
    const uploadPromises = imageArr.map(async element => {
      let fileName = getFilePath(folderName, isImage);
      let fileBase64 = await FileSystem.readAsStringAsync(element.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      let fileData = decode(fileBase64);
      let { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, fileData, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/*',
          // potential bug creator
        });

      // console.log(`data per element: ${JSON.stringify(data, null, 2)}`);

      if (error) {
        console.error(`File upload error => ${JSON.stringify(error, null, 2)}`);
        return { success: false, msg: 'Could not upload media' };
      }

      return data;
    });

    /* uploadResults has  */
    /*  path: postImages/fooBar
        fullPath: uploads/postImages/fooBar
     */
    const uploadResults = await Promise.all(uploadPromises);
    console.log(`uploadResults: ${JSON.stringify(uploadResults, null, 2)}`);

    const pathsInResult = uploadResults.map(item => item?.path);
    console.log(`pathsInResult: ${JSON.stringify(pathsInResult, null, 2)}`);

    // instead, return all paths...let's say an array of paths
    return { success: true, data: pathsInResult };
  } catch (error) {
    console.error(`File upload error => ${error}`);
    return { success: false, msg: 'Could not upload media' };
  }
};

export const getFilePath = (folderName: string, isImage: boolean) => {
  return `/${folderName}/${new Date().getTime()}${isImage ? '.png' : '.mp4'}`;
};
