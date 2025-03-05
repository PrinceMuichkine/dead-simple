import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
    Dimensions,
    ScrollView,
    Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { verifyOtp, signInWithPhone } from '@/lib/supabase/client';
import { useAuth } from '@/lib/contexts/AuthContext';
import { COLORS, globalStyles } from '@/lib/styles/globalStyles';
import { getAsset } from '@/lib/utils/assetUtils';

const { width, height } = Dimensions.get('window');

// Number of OTP input fields
const OTP_LENGTH = 6;

export default function VerifyScreen() {
    const router = useRouter();
    const { phone, userType = 'merchant' } = useLocalSearchParams();
    const { updateSession } = useAuth();

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [isLoading, setIsLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [error, setError] = useState('');

    // Refs for TextInput fields
    const inputRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));

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
        if (!/^\d*$/.test(text)) return;

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto-focus next field
        if (text && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Clear error message on input
        if (error) setError('');
    };

    // Handle backspace key press
    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        const key = e.nativeEvent.key;
        if (key === 'Backspace' && !otp[index] && index > 0) {
            // Move to previous field on backspace
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Verify the OTP
    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length !== OTP_LENGTH) {
            setError('Please enter all digits of the verification code');
            return;
        }

        setIsLoading(true);
        try {
            const result = await verifyOtp(phone as string, otpString);

            if (result.success) {
                // Navigate to appropriate screen based on user type
                const destination = userType === 'merchant'
                    ? '/merchant/dashboard'
                    : '/browse';

                router.replace(destination);
            } else {
                setError('Invalid verification code. Please try again.');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setError('An error occurred during verification. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        if (timer > 0) return;

        setResendLoading(true);
        try {
            const result = await signInWithPhone(phone as string);

            if (result.success) {
                // Reset timer and OTP fields
                setTimer(60);
                setOtp(Array(OTP_LENGTH).fill(''));
                setError('');
                inputRefs.current[0]?.focus();
            } else {
                setError('Failed to resend verification code. Please try again.');
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            setError('An error occurred while resending the code.');
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
                source={getAsset('home-bg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <SafeAreaView style={styles.contentContainer}>
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Logo */}
                            <View style={styles.logoContainer}>
                                <Image
                                    source={getAsset('jumbo-white')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>

                            {/* Verification Form Modal */}
                            <View style={styles.formContainer}>
                                <TouchableOpacity
                                    style={styles.backButton}
                                    onPress={() => router.back()}
                                >
                                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                                </TouchableOpacity>

                                <Text style={styles.formTitle}>Verify your phone number</Text>
                                <Text style={styles.formSubtitle}>
                                    We&apos;ve sent a verification code to {phone}
                                </Text>

                                {/* OTP Input Fields */}
                                <View style={styles.otpContainer}>
                                    {Array(OTP_LENGTH).fill(0).map((_, index) => (
                                        <TextInput
                                            key={index}
                                            ref={(ref) => inputRefs.current[index] = ref}
                                            style={styles.otpInput}
                                            maxLength={1}
                                            keyboardType="number-pad"
                                            value={otp[index]}
                                            onChangeText={(text) => handleOtpChange(text, index)}
                                            onKeyPress={(e) => handleKeyPress(e, index)}
                                            autoFocus={index === 0}
                                        />
                                    ))}
                                </View>

                                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                                <TouchableOpacity
                                    style={styles.verifyButton}
                                    onPress={handleVerify}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator size="small" color={COLORS.white} />
                                    ) : (
                                        <Text style={styles.verifyButtonText}>Verify</Text>
                                    )}
                                </TouchableOpacity>

                                <View style={styles.resendContainer}>
                                    <Text style={styles.resendText}>
                                        Didn&apos;t receive the code?
                                    </Text>
                                    {timer > 0 ? (
                                        <Text style={styles.timerText}>
                                            Resend in {timer}s
                                        </Text>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={handleResendOTP}
                                            disabled={resendLoading}
                                        >
                                            {resendLoading ? (
                                                <ActivityIndicator size="small" color={COLORS.primary} />
                                            ) : (
                                                <Text style={styles.resendButton}>Resend</Text>
                                            )}
                                        </TouchableOpacity>
                                    )}
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
        backgroundColor: COLORS.transparentOverlay,
    },
    contentContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    logo: {
        width: width * 0.6,
        height: 100,
    },
    formContainer: {
        backgroundColor: COLORS.darkOverlay,
        borderRadius: 6,
        padding: 20,
        width: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 15,
        left: 15,
        zIndex: 1,
    },
    formTitle: {
        color: COLORS.white,
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
        marginTop: 10,
    },
    formSubtitle: {
        color: COLORS.white,
        fontSize: 16,
        opacity: 0.8,
        textAlign: 'center',
        marginBottom: 30,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    otpInput: {
        width: 45,
        height: 50,
        borderRadius: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: COLORS.white,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
    },
    errorText: {
        color: COLORS.danger,
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
    verifyButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 6,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    verifyButtonText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 16,
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    resendText: {
        color: COLORS.white,
        fontSize: 14,
        marginRight: 5,
    },
    timerText: {
        color: COLORS.warning,
        fontSize: 14,
        fontWeight: '500',
    },
    resendButton: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
    },
}); 