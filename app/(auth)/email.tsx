import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router/build/hooks';

export default function EmailAuthScreen() {
    const { isDark } = useTheme();
    const router = useRouter();
    const [email, setEmail] = useState('');

    const handleEmailSubmit = () => {
        // Here you would implement your email authentication logic
        if (!email || !email.includes('@')) {
            Alert.alert('Invalid Email', 'Please enter a valid email address');
            return;
        }

        // Redirect to a verification page or continue with authentication flow
        Alert.alert('Email Sent', 'Please check your email for verification link');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <View style={styles.content}>
                <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    Email SSO
                </Text>
                <Text style={[styles.subtitle, { color: isDark ? '#CCCCCC' : '#666666' }]}>
                    Enter your email to receive a sign in link
                </Text>

                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: isDark ? '#333333' : '#FFFFFF',
                            color: isDark ? '#FFFFFF' : '#000000',
                            borderColor: isDark ? '#555555' : '#DDDDDD'
                        }
                    ]}
                    placeholder="Email address"
                    placeholderTextColor={isDark ? '#999999' : '#999999'}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#FF5722' }]}
                    onPress={handleEmailSubmit}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    button: {
        height: 50,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 