import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase/client';

export default function AuthCallbackScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { refreshSession } = useAuth();
    const { isDark } = useTheme();

    useEffect(() => {
        async function handleAuthRedirect() {
            try {
                // Handle any query params from the redirect
                // This would typically happen automatically if using Supabase's built-in auth flow
                // but we'll implement it for completeness
                if (params.access_token || params.refresh_token) {
                    // Manually set the session if needed
                    // We would typically not need this as Supabase handles session management
                    await refreshSession();

                    // After verifying the session, redirect to the appropriate screen
                    router.replace('/');
                } else {
                    // If there are no tokens, something went wrong, or we're using another auth method
                    console.log('No access tokens found in redirect');
                    setTimeout(() => {
                        router.replace('/');
                    }, 2000);
                }
            } catch (error) {
                console.error('Error in auth callback:', error);
                setTimeout(() => {
                    router.replace('/');
                }, 2000);
            }
        }

        handleAuthRedirect();
    }, [params, router, refreshSession]);

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <ActivityIndicator size="large" color={isDark ? '#FFFFFF' : '#000000'} />
            <Text style={[styles.text, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                Completing authentication...
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
    },
}); 