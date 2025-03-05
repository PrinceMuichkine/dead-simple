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
import { supabase } from '@/lib/supabase/client';
import { COLORS } from '@/lib/styles/globalStyles';
import { useNotificationContext } from '@/lib/contexts/NotificationContext';

interface ProfilePictureUploaderProps {
    currentAvatar: string | null;
    onAvatarUpdate: (newAvatarUrl: string) => void;
    name: string;
}

export default function ProfilePictureUploader({
    currentAvatar,
    onAvatarUpdate,
    name
}: ProfilePictureUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar);
    const { error, success } = useNotificationContext();

    const pickImage = async () => {
        try {
            // Request permission
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                error('Permission denied', 'Camera roll permission is required');
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
                    error('File too large', 'Please select an image smaller than 1MB');
                    return;
                }

                // Set preview
                setPreviewUrl(selectedImage.uri);

                // Upload image
                await uploadImage(selectedImage.uri);
            }
        } catch (e) {
            error('Error', 'Failed to pick image');
            console.error(e);
        }
    };

    const uploadImage = async (uri: string) => {
        try {
            setIsUploading(true);

            // Get current session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session) {
                throw new Error('Authentication error');
            }

            const user = session.user;
            if (!user) {
                throw new Error('User not found');
            }

            // Create a filename based on user ID and timestamp
            const fileExtension = uri.split('.').pop();
            const fileName = `${user.id}/avatar-${Date.now()}.${fileExtension}`;

            // Convert image to blob
            const response = await fetch(uri);
            const blob = await response.blob();

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, blob, {
                    contentType: `image/${fileExtension}`,
                    upsert: true,
                });

            if (uploadError) {
                throw uploadError;
            }

            if (!data) {
                throw new Error('Upload failed');
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(data.path);

            const publicUrl = urlData.publicUrl;

            // Update merchant avatar with public URL
            const { error: updateError } = await supabase.rpc('update_merchant_avatar', {
                p_merchant_id: user.id,
                p_avatar_url: publicUrl
            });

            if (updateError) {
                throw updateError;
            }

            // Update preview and parent component
            setPreviewUrl(publicUrl);
            onAvatarUpdate(publicUrl);

            success('Success', 'Profile picture updated');
        } catch (e) {
            console.error('Error uploading image:', e);
            error('Upload failed', 'Could not upload your profile picture');
            // Reset preview
            setPreviewUrl(currentAvatar);
        } finally {
            setIsUploading(false);
        }
    };

    const getInitials = (name: string): string => {
        if (!name) return '';
        return name.charAt(0).toUpperCase();
    };

    // Generate a consistent color based on the name
    const getBackgroundColor = (name: string): string => {
        if (!name) return COLORS.primary;

        const colors = [
            COLORS.primary,
            COLORS.success,
            COLORS.warning,
            COLORS.danger,
            '#9C27B0', // purple
            '#FF9800', // orange
            '#795548', // brown
            '#607D8B', // blue grey
        ];

        // Use string to generate a consistent index
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        onAvatarUpdate('');
    };

    const backgroundColor = getBackgroundColor(name);

    return (
        <View style={styles.container}>
            {isUploading ? (
                <View style={[styles.avatarContainer, { backgroundColor }]}>
                    <ActivityIndicator size="large" color={COLORS.white} />
                </View>
            ) : (
                <TouchableOpacity style={styles.avatarTouchable} onPress={pickImage}>
                    {previewUrl ? (
                        <Image
                            source={{ uri: previewUrl }}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <View style={[styles.avatarContainer, { backgroundColor }]}>
                            <Text style={styles.initialsText}>{getInitials(name)}</Text>
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
    avatarTouchable: {
        position: 'relative',
        marginBottom: 10,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50, // Circle for avatar
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    initialsText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    editBadge: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.primary,
        borderRadius: 15,
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
        fontSize: 14,
    },
});