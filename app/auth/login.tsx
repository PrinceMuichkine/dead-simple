import React, { useState } from 'react';
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
    Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';

type FormData = {
    phone: string;
};

export default function LoginScreen() {
    const router = useRouter();
    const { signIn } = useAuth();
    const { isDark } = useTheme();
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            phone: '',
        }
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);

        try {
            // Format phone number to E.164 format if not already
            let phoneNumber = data.phone;
            if (!phoneNumber.startsWith('+')) {
                // Assuming West African numbers - this would need to be adjusted based on target countries
                phoneNumber = '+' + phoneNumber;
            }

            const { error } = await signIn(phoneNumber);

            if (error) {
                Alert.alert('Error', error.message);
            } else {
                // Navigate to OTP verification screen
                router.push({
                    pathname: '/auth/verify',
                    params: { phone: phoneNumber }
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.container,
                    isDark ? styles.darkBackground : styles.lightBackground
                ]}
            >
                <StatusBar style={isDark ? 'light' : 'dark'} />

                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#333333'} />
                </TouchableOpacity>

                <View style={styles.headerContainer}>
                    <Text style={[styles.headerText, isDark ? styles.darkText : styles.lightText]}>
                        Welcome Back
                    </Text>
                    <Text style={[styles.subHeaderText, isDark ? styles.darkSecondaryText : styles.lightSecondaryText]}>
                        Log in with your phone number
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={[styles.inputLabel, isDark ? styles.darkSecondaryText : styles.lightSecondaryText]}>
                        Phone Number
                    </Text>

                    <Controller
                        control={control}
                        name="phone"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[
                                    styles.input,
                                    isDark ? styles.darkInput : styles.lightInput,
                                    errors.phone && styles.errorInput
                                ]}
                                placeholder="Enter your phone number"
                                placeholderTextColor={isDark ? '#666666' : '#AAAAAA'}
                                keyboardType="phone-pad"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                            />
                        )}
                    />
                    {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

                    <TouchableOpacity
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        style={[
                            styles.loginButton,
                            isLoading ? styles.disabledButton : null
                        ]}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.loginButtonText}>Next</Text>
                        )}
                    </TouchableOpacity>

                    <Text style={[styles.orText, isDark ? styles.darkSecondaryText : styles.lightSecondaryText]}>
                        Don&apos;t have an account?
                    </Text>

                    <TouchableOpacity onPress={() => router.push('/auth/register')}>
                        <Text style={[styles.registerText, isDark ? styles.darkSecondaryText : styles.lightSecondaryText]}>
                            Register
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    backButton: {
        marginTop: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        marginTop: 20,
        marginBottom: 40,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subHeaderText: {
        fontSize: 16,
    },
    formContainer: {
        width: '100%',
    },
    inputLabel: {
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        marginTop: -10,
        marginBottom: 15,
    },
    loginButton: {
        backgroundColor: '#FF5722',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    orText: {
        fontSize: 14,
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    registerText: {
        fontSize: 14,
        textAlign: 'center',
    },
    keyboardView: {
        flex: 1
    },
    darkBackground: {
        backgroundColor: '#121212'
    },
    lightBackground: {
        backgroundColor: '#F5F5F5'
    },
    darkText: {
        color: '#FFFFFF'
    },
    lightText: {
        color: '#333333'
    },
    darkSecondaryText: {
        color: '#BBBBBB'
    },
    lightSecondaryText: {
        color: '#666666'
    },
    darkInput: {
        backgroundColor: '#333333',
        color: '#FFFFFF',
        borderColor: '#555555'
    },
    lightInput: {
        backgroundColor: '#FFFFFF',
        color: '#000000',
        borderColor: '#DDDDDD'
    },
    errorInput: {
        borderColor: '#FF3B30'
    },
    disabledButton: {
        opacity: 0.7
    }
}); 