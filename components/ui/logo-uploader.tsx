import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '@/lib/styles/globalStyles';
import { supabase } from '@/lib/utils/supabase/client';

interface LogoUploaderProps {
    currentLogo: string | null;
    onLogoUpdate: (newLogoUrl: string) => void;
    companyName: string;
}

export default function LogoUploader({ currentLogo, onLogoUpdate, companyName }: LogoUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogo);

    const pickImage = async () => {
        try {
            // Request permission
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                // Create a notification or alert here about permissions
                console.warn('Permission to access media library denied');
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0];

                // Validate file size (max 1MB)
                if (selectedImage.fileSize && selectedImage.fileSize > 1024 * 1024) {
                    // Show notification or alert about file size
                    console.warn('File size too large (max 1MB)');
                    return;
                }

                // Set preview
                setPreviewUrl(selectedImage.uri);

                // Upload image
                await uploadImage(selectedImage.uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const uploadImage = async (uri: string) => {
        try {
            setIsUploading(true);

            // Create a filename based on timestamp and company name
            const filename = `logo_${companyName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`;
            const fileExtension = uri.split('.').pop();
            const filePath = `${filename}.${fileExtension}`;

            // Convert image to blob
            const response = await fetch(uri);
            const blob = await response.blob();

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('logos')
                .upload(filePath, blob, {
                    contentType: `image/${fileExtension}`,
                    upsert: true,
                });

            if (error) {
                throw error;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('logos')
                .getPublicUrl(filePath);

            const publicUrl = urlData.publicUrl;

            // Update state and call callback
            setPreviewUrl(publicUrl);
            onLogoUpdate(publicUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            // Show notification or alert about upload error
        } finally {
            setIsUploading(false);
        }
    };

    const getInitial = (companyName: string) => {
        return companyName.charAt(0).toUpperCase();
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        onLogoUpdate('');
    };

    return (
        <View style={styles.container}>
            {isUploading ? (
                <View style={styles.logoContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : previewUrl ? (
                <View style={styles.logoWrapper}>
                    <Image source={{ uri: previewUrl }} style={styles.logo} />
                    <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
                        <Ionicons name="close-circle" size={24} color={COLORS.danger} />
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.placeholderContainer}>
                    <Text style={styles.initialText}>{getInitial(companyName)}</Text>
                </View>
            )}

            <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickImage}
                disabled={isUploading}
            >
                <Ionicons name="cloud-upload-outline" size={20} color={COLORS.white} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>
                    {previewUrl ? 'Change Logo' : 'Upload Logo'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 6, // Following your style guidelines
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    logoWrapper: {
        position: 'relative',
        marginBottom: 15,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 6, // Following your style guidelines
    },
    removeButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: COLORS.white,
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
    placeholderContainer: {
        width: 100,
        height: 100,
        borderRadius: 6, // Following your style guidelines
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    initialText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 6, // Following your style guidelines
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 16,
    },
});
