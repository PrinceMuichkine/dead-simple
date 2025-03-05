import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform,
    Dimensions,
    ActivityIndicator,
    ImageBackground,
    KeyboardAvoidingView,
    ScrollView,
    Animated,
    Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithOAuth } from '@/lib/supabase/client';
import { getAsset } from '@/lib/utils/assetUtils';
import { COLORS, globalStyles } from '@/lib/styles/globalStyles';
import PhoneNumberInput from '@/components/ui/phone-number-input';

const { width, height } = Dimensions.get('window');

type UserType = 'merchant' | 'shopper';

// Carousel images
const carouselItems = [
    {
        id: '1',
        image: getAsset('onboarding-1'),
        title: 'Welcome to JUMBO',
        description: 'The marketplace that connects you with local merchants',
    },
    {
        id: '2',
        image: getAsset('onboarding-2'),
        title: 'Set up your store in minutes',
        description: 'Start selling your products quickly and easily',
    },
    {
        id: '3',
        image: getAsset('onboarding-3'),
        title: 'Secure payments',
        description: 'Safe and reliable payment options for all transactions',
    },
];

export default function HomeScreen() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
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
            const result = await signInWithOAuth(provider);
            if (!result.success) {
                console.error(`${provider} auth failed:`, result.error);
                // Show error to user
            }
        } catch (error) {
            console.error(`${provider} auth error:`, error);
            // Show error to user
        } finally {
            setIsAuthLoading(false);
        }
    };

    // Handle phone authentication
    const handlePhoneAuth = () => {
        if (!phone || phone.length < 10 || isAuthLoading) return;

        router.push({
            pathname: '/auth/verify',
            params: { phone, userType }
        });
    };

    // Handle email authentication
    const handleEmailAuth = () => {
        router.push({
            pathname: '/auth/email',
            params: { userType }
        });
    };

    // Toggle user type between merchant and shopper
    const toggleUserType = (type: UserType) => {
        setUserType(type);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.white} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={globalStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar style="light" />

            <ImageBackground
                source={getAsset('home-bg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <SafeAreaView style={styles.container}>
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.logoContainer}>
                                <Image
                                    source={getAsset('jumbo-white')}
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
                                        <Text style={styles.socialButtonText}>Continue with Phone</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Divider */}
                                <View style={styles.dividerContainer}>
                                    <View style={styles.divider} />
                                    <Text style={styles.dividerText}>OR</Text>
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
                                            Continue with Email
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
                                                Continue with Google
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
                                                Continue with Apple
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {/* Footer */}
                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>
                                        By continuing, you agree to our
                                    </Text>
                                    <View style={styles.footerLinks}>
                                        <TouchableOpacity onPress={() => Linking.openURL('https://lomi.africa/terms')}>
                                            <Text style={styles.footerLink}>Terms of Service</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.footerText}> and </Text>
                                        <TouchableOpacity onPress={() => Linking.openURL('https://lomi.africa/privacy')}>
                                            <Text style={styles.footerLink}>Privacy Policy</Text>
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
        backgroundColor: COLORS.black,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: COLORS.transparentOverlay,
    },
    container: {
        flex: 1,
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
        backgroundColor: COLORS.warning,
        height: 54,
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
    },
    googleButton: {
        backgroundColor: COLORS.danger,
    },
    appleButton: {
        backgroundColor: COLORS.black,
    },
    socialButtonText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
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