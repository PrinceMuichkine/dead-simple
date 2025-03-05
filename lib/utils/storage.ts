import { supabase } from '../supabase/client';
import { StorageOptions } from '../types/storage.types';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { decode } from 'base64-arraybuffer';

/**
 * Upload a file to Supabase Storage
 */
export const uploadFile = async (
  uri: string,
  options: StorageOptions
): Promise<{ success: boolean; url?: string; error?: any }> => {
  try {
    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      return { success: false, error: 'File does not exist' };
    }

    // Get file extension
    const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
    
    // Get content type
    const contentType = options.contentType || 
      fileExt === 'jpg' || fileExt === 'jpeg' ? 'image/jpeg' :
      fileExt === 'png' ? 'image/png' :
      fileExt === 'gif' ? 'image/gif' :
      fileExt === 'pdf' ? 'application/pdf' :
      'application/octet-stream';

    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert to ArrayBuffer
    const arrayBuffer = decode(base64);

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(options.bucket)
      .upload(options.path, arrayBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error('Error uploading file:', error);
      return { success: false, error };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(options.bucket)
      .getPublicUrl(options.path);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error in uploadFile:', error);
    return { success: false, error };
  }
};

/**
 * Delete a file from Supabase Storage
 */
export const deleteFile = async (
  bucket: StorageOptions['bucket'],
  path: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Error deleting file:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteFile:', error);
    return { success: false, error };
  }
};

/**
 * Pick an image from the device library
 */
export const pickImage = async (): Promise<{ success: boolean; uri?: string; error?: any }> => {
  try {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return { 
        success: false, 
        error: 'Permission to access media library was denied' 
      };
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return { success: false, error: 'Image picking was cancelled' };
    }

    return { success: true, uri: result.assets[0].uri };
  } catch (error) {
    console.error('Error picking image:', error);
    return { success: false, error };
  }
};

/**
 * Take a photo with the device camera
 */
export const takePhoto = async (): Promise<{ success: boolean; uri?: string; error?: any }> => {
  try {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return { 
        success: false, 
        error: 'Permission to access camera was denied' 
      };
    }

    // Take photo
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return { success: false, error: 'Photo taking was cancelled' };
    }

    return { success: true, uri: result.assets[0].uri };
  } catch (error) {
    console.error('Error taking photo:', error);
    return { success: false, error };
  }
};

/**
 * Upload a profile avatar
 */
export const uploadAvatar = async (
  uri: string,
  userId: string
): Promise<{ success: boolean; url?: string; error?: any }> => {
  const path = `${userId}/avatar.${uri.split('.').pop()?.toLowerCase() || 'jpg'}`;
  
  return uploadFile(uri, {
    bucket: 'avatars',
    path,
    contentType: 'image/jpeg',
  });
};

/**
 * Upload an organization logo
 */
export const uploadLogo = async (
  uri: string,
  organizationId: string
): Promise<{ success: boolean; url?: string; error?: any }> => {
  const path = `${organizationId}/logo.${uri.split('.').pop()?.toLowerCase() || 'jpg'}`;
  
  return uploadFile(uri, {
    bucket: 'logos',
    path,
    contentType: 'image/jpeg',
  });
};

/**
 * Upload a product image
 */
export const uploadProductImage = async (
  uri: string,
  productId: string,
  index: number = 0
): Promise<{ success: boolean; url?: string; error?: any }> => {
  const path = `${productId}/image_${index}.${uri.split('.').pop()?.toLowerCase() || 'jpg'}`;
  
  return uploadFile(uri, {
    bucket: 'products',
    path,
    contentType: 'image/jpeg',
  });
};

/**
 * Upload multiple product images
 */
export const uploadProductImages = async (
  uris: string[],
  productId: string
): Promise<{ success: boolean; urls?: string[]; error?: any }> => {
  try {
    const results = await Promise.all(
      uris.map((uri, index) => uploadProductImage(uri, productId, index))
    );
    
    const failed = results.filter(result => !result.success);
    if (failed.length > 0) {
      console.error('Some images failed to upload:', failed);
    }
    
    const urls = results
      .filter(result => result.success && result.url)
      .map(result => result.url as string);
    
    return { success: true, urls };
  } catch (error) {
    console.error('Error uploading product images:', error);
    return { success: false, error };
  }
}; 