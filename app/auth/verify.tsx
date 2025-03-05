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
    ScrollView,
    Alert,
    Keyboard
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase/client';

export default function VerifyScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { verifyOTP } = useAuth();
    const { isDark } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));

    const inputRefs = useRef<Array<TextInput | null>>(Array(6).fill(null));

    const phone = params.phone as string;
    const userType = params.type as 'merchant' | 'customer' | undefined;

    // Countdown timer for resend button
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleOtpChange = (text: string, index: number) => {
        // Make a copy of the OTP array
        const newOtp = [...otp];

        // Only allow numbers
        const sanitizedText = text.replace(/[^0-9]/g, '');

        // Update the value at the current index
        newOtp[index] = sanitizedText;
        setOtp(newOtp);

        // If a number was entered and there's a next input, focus it
        if (sanitizedText && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        // If backspace was pressed and the current field is empty, focus the previous field
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        Keyboard.dismiss();
        setIsLoading(true);

        try {
            const otpString = otp.join('');

            // Verify the OTP
            const { error } = await verifyOTP(phone, otpString);

            if (error) {
                Alert.alert('Error', error.message);
            } else {
                if (userType) {
                    // Create user profile with the specified type
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .upsert({
                            id: (await supabase.auth.getUser()).data.user?.id,
                            user_type: userType,
                            phone: phone,
                            kyc_level: 1, // Basic level
                        });

                    if (profileError) {
                        console.error('Error creating profile:', profileError);
                    }

                    // Navigate to the appropriate screen based on user type
                    if (userType === 'merchant') {
                        router.replace('/merchant/onboarding');
                    } else {
                        router.replace('/browse');
                    }
                } else {
                    // If no user type specified (regular login), check profile and redirect accordingly
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', (await supabase.auth.getUser()).data.user?.id)
                        .single();

                    if (profile?.user_type === 'merchant') {
                        if (profile.store_id) {
                            router.replace('/merchant/dashboard');
                        } else {
                            router.replace('/merchant/onboarding');
                        }
                    } else {
                        router.replace('/browse');
                    }
                }
            }
        } catch (error) {
            console.error('Verification error:', error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsResending(true);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone,
            });

            if (error) {
                Alert.alert('Error', error.message);
            } else {
                setCountdown(60);
                Alert.alert('Success', 'A new verification code has been sent to your phone.');
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            Alert.alert('Error', 'Failed to resend the verification code. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    { backgroundColor: isDark ? '#121212' : '#F5F5F5' }
                ]}
            >
                <StatusBar style={isDark ? 'light' : 'dark'} />

                <View style={styles.headerContainer}>
                    <Text style={[styles.headerText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                        Verify Your Phone
                    </Text>
                    <Text style={[styles.subHeaderText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                        Enter the 6-digit code sent to {phone}
                    </Text>
                </View>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => inputRefs.current[index] = ref}
                            style={[
                                styles.otpInput,
                                {
                                    backgroundColor: isDark ? '#333333' : '#FFFFFF',
                                    color: isDark ? '#FFFFFF' : '#000000',
                                    borderColor: isDark ? '#555555' : '#DDDDDD'
                                }
                            ]}
                            value={digit}
                            onChangeText={(text) => handleOtpChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            textAlign="center"
                            selectTextOnFocus
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor: '#FF5722',
                            opacity: isLoading || otp.some(digit => !digit) ? 0.7 : 1
                        }
                    ]}
                    onPress={handleVerify}
                    disabled={isLoading || otp.some(digit => !digit)}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={styles.buttonText}>Verify</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.resendContainer}>
                    <Text style={[styles.resendText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                        Didn't receive the code?
                    </Text>

                    {countdown > 0 ? (
                        <Text style={[styles.countdownText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                            Resend in {countdown}s
                        </Text>
                    ) : (
                        <TouchableOpacity
                            style={styles.resendButton}
                            onPress={handleResendOTP}
                            disabled={isResending}
                        >
                            {isResending ? (
                                <ActivityIndicator size="small" color={isDark ? '#FFFFFF' : '#FF5722'} />
                            ) : (
                                <Text style={[styles.resendButtonText, { color: isDark ? '#FF7043' : '#FF5722' }]}>
                                    Resend Code
                                </Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        alignItems: 'center',
    },
    headerContainer: {
        marginTop: 60,
        marginBottom: 50,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subHeaderText: {
        fontSize: 16,
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 40,
    },
    otpInput: {
        width: 45,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 20,
        fontWeight: 'bold',
    },
    button: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resendContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    resendText: {
        marginBottom: 10,
    },
    countdownText: {
        fontWeight: '500',
    },
    resendButton: {
        padding: 5,
    },
    resendButtonText: {
        fontWeight: '500',
    },
}); 