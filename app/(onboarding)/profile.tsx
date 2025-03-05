import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    ScrollView,
    Animated,
    TextInput,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { COLORS, globalStyles } from '@/lib/styles/globalStyles';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LdrHatch } from '@/components/ui/ldrs';
import ProfilePictureUploader from '@/components/ui/avatar-uploader';

const { width, height } = Dimensions.get('window');

export default function ProfileSetupScreen() {
    const { t } = useTranslation();
    const { isDark } = useTheme();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];

    // Form state
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);

    // Fade in animation for the elements
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleContinue = () => {
        if (!fullName || !username) {
            // Show error message (would use proper validation in production)
            alert(t('onboarding.profile.fillRequiredFields', 'Please fill in all required fields'));
            return;
        }

        setIsLoading(true);
        // Navigate to the store page after a brief delay
        setTimeout(() => {
            setIsLoading(false);
            router.navigate({
                pathname: '/store'
            });
        }, 1000);
    };

    const handleBack = () => {
        router.back();
    };

    const handleSelectAvatar = () => {
        // In a real app, this would open the image picker
        alert(t('onboarding.profile.photoPickerNotImplemented', 'Photo picker is not implemented in this demo'));
    };

    return (
        <KeyboardAvoidingView
            style={globalStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ImageBackground
                source={require('../../assets/images/home.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <SafeAreaView style={styles.safeArea}>
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.headerContainer}>
                                <TouchableOpacity
                                    style={styles.backButton}
                                    onPress={handleBack}
                                >
                                    <Ionicons name="chevron-back" size={24} color={COLORS.white} />
                                </TouchableOpacity>

                                <Text style={styles.headerTitle}>
                                    {t('onboarding.profile.title', 'Create Your Profile')}
                                </Text>
                            </View>

                            <Animated.View
                                style={[
                                    styles.contentContainer,
                                    { opacity: fadeAnim },
                                    isDark
                                        ? styles.contentContainerDark
                                        : styles.contentContainerLight
                                ]}
                            >
                                <ProfilePictureUploader
                                    currentAvatar={avatar}
                                    onAvatarUpdate={(newAvatarUrl) => setAvatar(newAvatarUrl)}
                                    name={fullName}
                                />

                                <View style={styles.formContainer}>
                                    {/* Full Name Input */}
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>
                                            {t('onboarding.profile.fullName', 'Full Name')} *
                                        </Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder={t('onboarding.profile.fullNamePlaceholder', 'Your full name')}
                                                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                                value={fullName}
                                                onChangeText={setFullName}
                                            />
                                        </View>
                                    </View>

                                    {/* Username Input */}
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>
                                            {t('onboarding.profile.username', 'Username')} *
                                        </Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder={t('onboarding.profile.usernamePlaceholder', 'Choose a username')}
                                                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                                value={username}
                                                onChangeText={setUsername}
                                                autoCapitalize="none"
                                            />
                                        </View>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        isLoading && styles.buttonDisabled
                                    ]}
                                    onPress={handleContinue}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <LdrHatch />
                                    ) : (
                                        <Text style={styles.buttonText}>
                                            {t('onboarding.profile.continue', 'Continue')}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </Animated.View>
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
        textAlign: 'center',
    },
    contentContainer: {
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
        marginBottom: 40,
        borderRadius: 6,
        paddingVertical: 25,
        paddingHorizontal: 20,
    },
    contentContainerDark: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    contentContainerLight: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },
    avatarWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
        overflow: 'hidden',
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    addIconContainer: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 2,
    },
    avatarHelperText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    formContainer: {
        width: '100%',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.white,
        marginBottom: 8,
    },
    inputWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 6,
        paddingHorizontal: 15,
    },
    input: {
        height: 54,
        color: COLORS.white,
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 54,
        backgroundColor: COLORS.primary,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
}); 