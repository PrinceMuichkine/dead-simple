import React, { useState, useEffect } from 'react';
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
import useRouter from 'expo-router';
import useLocalSearchParams from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Controller from 'react-hook-form';
import useForm from 'react-hook-form';
import { z } from 'zod';

const phoneSchema = z.string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9+\s]+$/, 'Please enter a valid phone number');

type FormData = {
    phone: string;
};

export default function RegisterScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { signIn } = useAuth();
    const { isDark } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [userType, setUserType] = useState<'merchant' | 'customer'>(
        params.type === 'merchant' ? 'merchant' : 'customer'
    );

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
                // Assuming West African numbers
                phoneNumber = '+' + phoneNumber;
            }

            const { error } = await signIn(phoneNumber);

            if (error) {
                Alert.alert('Error', error.message);
            } else {
                // Navigate to OTP verification screen with type parameter
                router.push({
                    pathname: '/auth/verify',
                    params: { phone: phoneNumber, type: userType }
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
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

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={isDark ? '#FFFFFF' : '#000000'}
                    />
                </TouchableOpacity>

                <View style={styles.headerContainer}>
                    <Text style={[styles.headerText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                        Create Account
                    </Text>
                    <Text style={[styles.subHeaderText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                        Register as a {userType}
                    </Text>
                </View>

                <View style={styles.userTypeContainer}>
                    <TouchableOpacity
                        style={[
                            styles.userTypeButton,
                            userType === 'merchant' ?
                                { backgroundColor: '#FF5722', borderColor: '#FF5722' } :
                                {
                                    backgroundColor: isDark ? '#333333' : '#FFFFFF',
                                    borderColor: isDark ? '#555555' : '#DDDDDD'
                                }
                        ]}
                        onPress={() => setUserType('merchant')}
                    >
                        <Ionicons
                            name="storefront-outline"
                            size={24}
                            color={userType === 'merchant' ? '#FFFFFF' : isDark ? '#BBBBBB' : '#666666'}
                        />
                        <Text style={[
                            styles.userTypeText,
                            { color: userType === 'merchant' ? '#FFFFFF' : isDark ? '#BBBBBB' : '#666666' }
                        ]}>
                            Merchant
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.userTypeButton,
                            userType === 'customer' ?
                                { backgroundColor: '#4CAF50', borderColor: '#4CAF50' } :
                                {
                                    backgroundColor: isDark ? '#333333' : '#FFFFFF',
                                    borderColor: isDark ? '#555555' : '#DDDDDD'
                                }
                        ]}
                        onPress={() => setUserType('customer')}
                    >
                        <Ionicons
                            name="person-outline"
                            size={24}
                            color={userType === 'customer' ? '#FFFFFF' : isDark ? '#BBBBBB' : '#666666'}
                        />
                        <Text style={[
                            styles.userTypeText,
                            { color: userType === 'customer' ? '#FFFFFF' : isDark ? '#BBBBBB' : '#666666' }
                        ]}>
                            Customer
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.formContainer}>
                    <Text style={[styles.inputLabel, { color: isDark ? '#BBBBBB' : '#555555' }]}>
                        Phone Number
                    </Text>

                    <Controller
                        control={control}
                        rules={{
                            required: 'Phone number is required',
                            pattern: {
                                value: /^[0-9+\s]+$/,
                                message: 'Please enter a valid phone number'
                            }
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: isDark ? '#333333' : '#FFFFFF',
                                        color: isDark ? '#FFFFFF' : '#000000',
                                        borderColor: errors.phone ? '#FF3B30' : isDark ? '#555555' : '#DDDDDD'
                                    }
                                ]}
                                placeholder="Enter your phone number"
                                placeholderTextColor={isDark ? '#777777' : '#999999'}
                                keyboardType="phone-pad"
                                autoCapitalize="none"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="phone"
                    />

                    {errors.phone && (
                        <Text style={styles.errorText}>
                            {errors.phone.message}
                        </Text>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.button,
                            {
                                backgroundColor: userType === 'merchant' ? '#FF5722' : '#4CAF50',
                                opacity: isLoading ? 0.7 : 1
                            }
                        ]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>Continue</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => router.push('/auth/login')}
                    >
                        <Text style={[styles.loginText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                            Already have an account? Log in
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
        marginBottom: 30,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subHeaderText: {
        fontSize: 16,
    },
    userTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    userTypeButton: {
        flex: 1,
        height: 80,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        marginHorizontal: 5,
    },
    userTypeText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
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
    button: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginButton: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    loginText: {
        fontSize: 14,
    },
}); 