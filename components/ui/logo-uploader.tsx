import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    Text,
    StyleSheet,
    ActivityIndicator,
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
            ) : (
                <TouchableOpacity style={styles.logoTouchable} onPress={pickImage}>
                    {previewUrl ? (
                        <Image source={{ uri: previewUrl }} style={styles.logoImage} />
                    ) : (
                        <View style={styles.placeholderContainer}>
                            <Text style={styles.initialText}>{getInitial(companyName)}</Text>
                        </View>
                    )}

                    <View style={styles.editBadge}>
                        <Ionicons name="camera" size={16} color={COLORS.white} />
                    </View>
                </TouchableOpacity>
            )}

            <View style={styles.buttonContainer}>
                {previewUrl && (
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={handleRemove}
                        disabled={isUploading}
                    >
                        <Ionicons name="trash-outline" size={18} color={COLORS.danger} style={styles.buttonIcon} />
                        <Text style={[styles.buttonText, { color: COLORS.danger }]}>Remove</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoTouchable: {
        position: 'relative',
        marginBottom: 10,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: 100,
        height: 100,
        borderRadius: 6,
    },
    placeholderContainer: {
        width: 100,
        height: 100,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    initialText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    editBadge: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.primary,
        borderRadius: 6,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    removeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.danger,
    },
    buttonIcon: {
        marginRight: 5,
    },
    buttonText: {
        fontWeight: '500',
        fontSize: 16,
    }
});
