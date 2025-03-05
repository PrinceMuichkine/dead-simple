import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform,
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,
    ScrollView,
    Animated,
    Linking
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import PhoneNumberInput from '@/components/ui/phone-number-input';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { COLORS, globalStyles } from '@/lib/styles/globalStyles';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/lib/contexts/LanguageContext';

// We'll need to implement or adapt these imports as we build out the app
// import { useAuth } from '@/lib/contexts/AuthContext';
// import { signInWithOAuth } from '@/lib/supabase/client';
// import { getAsset } from '@/lib/utils/assetUtils';

const { width, height } = Dimensions.get('window');

// Temporary color constants until we fully integrate the global styles
const LOCAL_COLORS = {
    danger: '#DB4437',
    warning: '#F4B400',
    black: '#121212',
    transparentOverlay: 'rgba(0, 0, 0, 0.3)',
};

type UserType = 'merchant' | 'shopper';

export default function HomePage() {
    // const { user, isLoading } = useAuth(); // We'll add this when AuthContext is set up
    const { t } = useTranslation();
    const { language, changeLanguage } = useLanguage();
    const { isDark } = useTheme();
    const [phone, setPhone] = useState('');
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const [userType, setUserType] = useState<UserType>('merchant');

    // Fade in animation for the logo
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start animation when component mounts
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();
    }, []);

    // Social auth feature flags
    const enableSocialAuth = process.env.EXPO_PUBLIC_ENABLE_SOCIAL_AUTH === 'true';
    const enableAppleAuth = process.env.EXPO_PUBLIC_ENABLE_APPLE_AUTH === 'true' && enableSocialAuth;
    const enableGoogleAuth = process.env.EXPO_PUBLIC_ENABLE_GOOGLE_AUTH === 'true' && enableSocialAuth;

    // Handle social authentication
    const handleSocialAuth = async (provider: 'google' | 'apple') => {
        if (isAuthLoading) return;

        setIsAuthLoading(true);
        try {
            // Placeholder for OAuth implementation
            console.log(`${provider} auth initiated`);
            // const result = await signInWithOAuth(provider);
            // if (!result.success) {
            //     console.error(`${provider} auth failed:`, result.error);
            // }
        } catch (error) {
            console.error(`${provider} auth error:`, error);
        } finally {
            setIsAuthLoading(false);
        }
    };

    // Handle phone authentication
    const handlePhoneAuth = () => {
        if (!phone || phone.length < 10 || isAuthLoading) return;

        // For development, just log the intent
        console.log(`Would navigate to verify screen with phone: ${phone}, userType: ${userType}`);
        // We can implement this with router.push once type issues are resolved
    };

    // Handle email authentication
    const handleEmailAuth = () => {
        // For development, just log the intent
        console.log(`Would navigate to email auth screen with userType: ${userType}`);
        // We can implement this with router.push once type issues are resolved
    };

    // Toggle user type between merchant and shopper
    const toggleUserType = (type: UserType) => {
        setUserType(type);
    };

    // Toggle language between English and French
    const toggleLanguage = () => {
        changeLanguage(language === 'en' ? 'fr' : 'en');
    };

    // Loading state (temporarily disabled until we set up AuthContext)
    // if (isLoading) {
    //     return (
    //         <View style={styles.loadingContainer}>
    //             <ActivityIndicator size="large" color={COLORS.white} />
    //         </View>
    //     );
    // }

    return (
        <KeyboardAvoidingView
            style={globalStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar style="light" />

            <ImageBackground
                source={require('../assets/images/home.png')} // Using existing image
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <SafeAreaView style={styles.container}>
                        {/* Language toggle button */}
                        <TouchableOpacity
                            style={styles.languageToggle}
                            onPress={toggleLanguage}
                        >
                            <Text style={styles.languageToggleText}>
                                {language === 'en' ? 'FR' : 'EN'}
                            </Text>
                        </TouchableOpacity>

                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.logoContainer}>
                                <Image
                                    source={require('@/assets/jumbo_main_white.svg')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>

                            <View style={[
                                styles.contentContainer,
                                isDark
                                    ? styles.contentContainerDark
                                    : styles.contentContainerLight
                            ]}>
                                {/* Phone Input Section */}
                                <View style={styles.phoneInputContainer}>
                                    <PhoneNumberInput
                                        value={phone}
                                        onChange={(value) => setPhone(value || '')}
                                    />
                                    <TouchableOpacity
                                        style={[styles.socialButton, styles.phoneButton]}
                                        onPress={handlePhoneAuth}
                                    >
                                        <Text style={styles.socialButtonText}>{t('home.continueWithPhone')}</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Divider */}
                                <View style={styles.dividerContainer}>
                                    <View style={styles.divider} />
                                    <Text style={styles.dividerText}>{t('home.or')}</Text>
                                    <View style={styles.divider} />
                                </View>

                                {/* Social Authentication Buttons */}
                                <View style={styles.socialButtonsContainer}>
                                    {/* Email button first */}
                                    <TouchableOpacity
                                        style={[styles.socialButton, styles.emailButton]}
                                        onPress={handleEmailAuth}
                                        disabled={isAuthLoading}
                                    >
                                        <View style={styles.socialIconContainer}>
                                            <FontAwesome name="envelope" size={20} color="white" />
                                        </View>
                                        <Text style={styles.socialButtonText}>
                                            {t('home.continueWithEmail')}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Google button second */}
                                    {enableGoogleAuth && (
                                        <TouchableOpacity
                                            style={[styles.socialButton, styles.googleButton]}
                                            onPress={() => handleSocialAuth('google')}
                                            disabled={isAuthLoading}
                                        >
                                            <View style={styles.socialIconContainer}>
                                                <FontAwesome name="google" size={20} color="white" />
                                            </View>
                                            <Text style={styles.socialButtonText}>
                                                {t('home.continueWithGoogle')}
                                            </Text>
                                        </TouchableOpacity>
                                    )}

                                    {/* Apple button third */}
                                    {enableAppleAuth && (
                                        <TouchableOpacity
                                            style={[styles.socialButton, styles.appleButton]}
                                            onPress={() => handleSocialAuth('apple')}
                                            disabled={isAuthLoading}
                                        >
                                            <View style={styles.socialIconContainer}>
                                                <FontAwesome name="apple" size={24} color="white" />
                                            </View>
                                            <Text style={styles.socialButtonText}>
                                                {t('home.continueWithApple')}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {/* Footer */}
                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>
                                        {t('home.byContinnuing')}
                                    </Text>
                                    <View style={styles.footerLinks}>
                                        <TouchableOpacity onPress={() => Linking.openURL('https://lomi.africa/terms')}>
                                            <Text style={styles.footerLink}>{t('home.termsOfService')}</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.footerText}> {t('home.and')} </Text>
                                        <TouchableOpacity onPress={() => Linking.openURL('https://lomi.africa/privacy')}>
                                            <Text style={styles.footerLink}>{t('home.privacyPolicy')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: LOCAL_COLORS.black,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: LOCAL_COLORS.transparentOverlay,
    },
    container: {
        flex: 1,
    },
    languageToggle: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    languageToggleText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    logo: {
        width: width * 0.6,
        height: 100,
    },
    contentContainer: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 100,
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
    phoneInputContainer: {
        width: '100%',
        flexDirection: 'column',
        marginBottom: 20,
        marginTop: 15,
    },
    phoneButton: {
        marginTop: 12,
        marginBottom: -12,
        width: '100%',
        backgroundColor: LOCAL_COLORS.warning,
        height: 54,
        borderWidth: 6, // Added for style consistency
        borderColor: LOCAL_COLORS.warning,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        width: '100%',
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    dividerText: {
        color: COLORS.white,
        paddingHorizontal: 15,
        fontSize: 14,
        fontWeight: '600',
    },
    socialButtonsContainer: {
        width: '100%',
        marginBottom: 20,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        paddingVertical: 15,
        marginBottom: 12,
        width: '100%',
        height: 54,
        borderWidth: 6, // Added for style consistency
    },
    socialIconContainer: {
        position: 'absolute',
        left: 15,
        justifyContent: 'center',
        alignItems: 'center',
        width: 24,
    },
    emailButton: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    googleButton: {
        backgroundColor: LOCAL_COLORS.danger,
        borderColor: LOCAL_COLORS.danger,
    },
    appleButton: {
        backgroundColor: LOCAL_COLORS.black,
        borderColor: LOCAL_COLORS.black,
    },
    socialButtonText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
    },
    userTypeContainer: {
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
    },
    userTypeLabel: {
        color: COLORS.white,
        fontSize: 16,
        marginBottom: 10,
    },
    userTypeButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    userTypeButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginHorizontal: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    userTypeButtonActive: {
        backgroundColor: COLORS.primary,
    },
    userTypeButtonText: {
        color: COLORS.white,
        fontSize: 14,
    },
    userTypeButtonTextActive: {
        fontWeight: 'bold',
    },
    footer: {
        alignItems: 'center',
        marginTop: 10,
    },
    footerText: {
        color: COLORS.white,
        fontSize: 12,
    },
    footerLinks: {
        flexDirection: 'row',
        marginTop: 5,
    },
    footerLink: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '600',
        marginHorizontal: 5,
    },
}); 