import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
    Dimensions,
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router/build/hooks';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { verifyOtp, signInWithPhone } from '@/lib/utils/supabase/client';
import { useAuth } from '@/lib/contexts/AuthContext';
import { COLORS, globalStyles } from '@/lib/styles/globalStyles';

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

    // Handle OTP verification
    const handleVerify = async () => {
        setError('');
        setIsLoading(true);

        const otpString = otp.join('');

        if (otpString.length !== OTP_LENGTH) {
            setError('Please enter the complete verification code.');
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
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.content}>
                        <Text style={styles.title}>Verify Your Phone Number</Text>
                        <Text style={styles.subtitle}>
                            We've sent a 6-digit verification code to{' '}
                            <Text style={styles.phoneText}>{phone}</Text>
                        </Text>

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
                                />
                            ))}
                        </View>

                        {/* Error message */}
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        {/* Verify Button */}
                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.buttonDisabled]}
                            onPress={handleVerify}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.buttonText}>Verify</Text>
                            )}
                        </TouchableOpacity>

                        {/* Resend Code Section */}
                        <View style={styles.resendContainer}>
                            <Text style={styles.resendText}>Didn't receive the code? </Text>
                            {timer > 0 ? (
                                <Text style={styles.timerText}>Resend in {timer}s</Text>
                            ) : (
                                <TouchableOpacity
                                    onPress={handleResendOTP}
                                    disabled={resendLoading}
                                >
                                    {resendLoading ? (
                                        <ActivityIndicator size="small" color={COLORS.primary} />
                                    ) : (
                                        <Text style={styles.resendButton}>Resend Code</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 24,
    },
    phoneText: {
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    otpInput: {
        width: width / 8,
        height: 56,
        borderWidth: 1,
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        borderColor: '#CCCCCC',
        backgroundColor: '#F5F5F5',
    },
    button: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resendText: {
        fontSize: 14,
        color: '#666666',
    },
    resendButton: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    timerText: {
        fontSize: 14,
        color: '#999999',
    },
    errorText: {
        color: '#FF0000',
        marginBottom: 16,
        textAlign: 'center',
    },
}); 