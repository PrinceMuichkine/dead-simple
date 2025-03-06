import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
    Dimensions,
    ScrollView,
    ImageBackground,
    Animated,
    Linking
} from 'react-native';
import { useRouter } from 'expo-router/build/hooks';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { verifyOtp, signInWithPhone } from '@/lib/utils/supabase/client';
import { useAuth } from '@/lib/contexts/AuthContext';
import { COLORS, globalStyles } from '@/lib/styles/globalStyles';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@/components/ui/button-expand';
import { LdrHatch } from '@/components/ui/ldrs';
import { ClientOnly, LoadingIndicator } from '@/components/ui/client-loaders';
import { useTheme } from '@/lib/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

// Temporary color constants until we fully integrate the global styles
const LOCAL_COLORS = {
    danger: '#DB4437',
    warning: '#F4B400',
    black: '#121212',
    transparentOverlay: 'rgba(0, 0, 0, 0.3)',
};

// Number of OTP input fields
const OTP_LENGTH = 6;

export default function VerifyScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { phone, userType = 'merchant' } = useLocalSearchParams();
    const { updateSession } = useAuth();
    const { isDark } = useTheme();

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [isLoading, setIsLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [error, setError] = useState('');

    // Refs for TextInput fields
    const inputRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));

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

    // Start countdown timer for OTP resend
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Handle OTP input change
    const handleOtpChange = (text: string, index: number) => {
        if (text.length > 1) {
            // If pasting, handle multiple characters
            const pastedText = text.split('');
            const updatedOtp = [...otp];

            for (let i = 0; i < Math.min(pastedText.length, OTP_LENGTH - index); i++) {
                updatedOtp[index + i] = pastedText[i];
            }

            setOtp(updatedOtp);

            // Move focus to the next field after pasting
            const nextIndex = Math.min(index + pastedText.length, OTP_LENGTH - 1);
            inputRefs.current[nextIndex]?.focus();
        } else {
            // Single character input
            const updatedOtp = [...otp];
            updatedOtp[index] = text;
            setOtp(updatedOtp);

            // Auto-move to next field
            if (text && index < OTP_LENGTH - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    // Handle backspace key press for better UX
    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            // Move to previous field on backspace if current field is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    // Handle OTP verification
    const handleVerify = async () => {
        setError('');
        setIsLoading(true);

        const otpString = otp.join('');

        if (otpString.length !== OTP_LENGTH) {
            setError(t('auth.verifyScreen.enterComplete'));
            setIsLoading(false);
            return;
        }

        try {
            // Verify OTP with your authentication service
            const response = await verifyOtp(phone as string, otpString);

            if (response.error) {
                throw new Error(response.error.toString());
            }

            if (response.success && response.data && response.data.session) {
                await updateSession(response.data.session);
                // Navigate to home or dashboard after successful verification
                router.replace('/');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to verify code. Please try again.');
            console.error('Verification error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP resend
    const handleResendOTP = async () => {
        if (timer > 0) return;

        setResendLoading(true);
        setError('');

        try {
            // Resend OTP 
            const response = await signInWithPhone(phone as string);

            if (response.error) {
                throw new Error(response.error.toString());
            }

            // Reset timer and OTP fields
            setTimer(60);
            setOtp(Array(OTP_LENGTH).fill(''));
            inputRefs.current[0]?.focus();

        } catch (err: any) {
            setError(err.message || 'Failed to resend code. Please try again later.');
            console.error('Resend error:', err);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={globalStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar style="light" />

            <ImageBackground
                source={require('@//assets/images/home.webp')}
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
                                <Animated.Image
                                    source={require('@/assets/')}
                                    style={[styles.logo, { opacity: fadeAnim }]}
                                    resizeMode="contain"
                                />
                            </View>

                            <View style={[
                                styles.contentContainer,
                                isDark
                                    ? styles.contentContainerDark
                                    : styles.contentContainerLight
                            ]}>
                                <View style={styles.headerContainer}>
                                    <Text style={styles.title}>{t('auth.verifyScreen.title')}</Text>
                                    <Text style={styles.subtitle}>
                                        {t('auth.verifyScreen.subtitle')}{' '}
                                        <Text style={styles.phoneText}>{phone}</Text>
                                    </Text>
                                </View>

                                {/* OTP Input Fields */}
                                <View style={styles.otpContainer}>
                                    {Array(OTP_LENGTH).fill(0).map((_, index) => (
                                        <TextInput
                                            key={index}
                                            ref={(ref) => inputRefs.current[index] = ref}
                                            style={styles.otpInput}
                                            value={otp[index]}
                                            onChangeText={(text) => handleOtpChange(text, index)}
                                            onKeyPress={(e) => handleKeyPress(e, index)}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            selectTextOnFocus
                                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                        />
                                    ))}
                                </View>

                                {/* Error message */}
                                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                                {/* Verify Button */}
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        styles.verifyButton,
                                        isLoading && styles.buttonDisabled
                                    ]}
                                    onPress={handleVerify}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ClientOnly fallback={<LoadingIndicator />}>
                                            <LdrHatch />
                                        </ClientOnly>
                                    ) : (
                                        <Text style={styles.buttonText}>{t('auth.verifyScreen.verifyCode')}</Text>
                                    )}
                                </TouchableOpacity>

                                {/* Go Back Button */}
                                <View style={[styles.backButtonContainer, { marginTop: -5 }]}>
                                    <BackButton
                                        onPress={handleGoBack}
                                        text={t('auth.verifyScreen.goBack')}
                                    />
                                </View>

                                {/* Resend Code Section */}
                                <View style={styles.resendContainer}>
                                    <Text style={styles.resendText}>{t('auth.verifyScreen.didntReceiveCode')} </Text>
                                    {timer > 0 ? (
                                        <Text style={styles.timerText}>{t('auth.verifyScreen.resendIn')} {timer}{t('auth.verifyScreen.seconds')}</Text>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={handleResendOTP}
                                            disabled={resendLoading}
                                        >
                                            {resendLoading ? (
                                                <ClientOnly fallback={<LoadingIndicator />}>
                                                    <LdrHatch />
                                                </ClientOnly>
                                            ) : (
                                                <Text style={styles.resendButton}>{t('auth.verifyScreen.resendCode')}</Text>
                                            )}
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
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 90,
        paddingBottom: 20,
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
        marginBottom: 50,
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
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginBottom: 5,
    },
    phoneText: {
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    otpInput: {
        width: `${Math.floor(100 / OTP_LENGTH) - 3}%`, // Adaptive sizing based on number of fields
        height: 56,
        borderRadius: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorText: {
        color: LOCAL_COLORS.danger,
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
    button: {
        width: '100%',
        height: 54,
        borderRadius: 6,
        borderWidth: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    verifyButton: {
        backgroundColor: COLORS.warning, // Yellow button
        borderColor: COLORS.warning,
    },
    backButtonContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    resendText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginRight: 4,
    },
    resendButton: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    timerText: {
        color: COLORS.warning,
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        alignItems: 'center',
        marginTop: 15,
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