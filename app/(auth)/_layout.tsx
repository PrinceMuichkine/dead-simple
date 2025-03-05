import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/lib/contexts/ThemeContext';

export default function AuthLayout() {
    const { isDark } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: isDark ? '#121212' : '#FF5722',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                contentStyle: {
                    backgroundColor: isDark ? '#121212' : '#F5F5F5',
                },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="verify"
                options={{
                    headerTitle: 'Verify Phone Number',
                }}
            />
            <Stack.Screen
                name="email"
                options={{
                    headerTitle: 'Sign In using SSO',
                }}
            />
            <Stack.Screen
                name="callback"
                options={{
                    headerTitle: 'Authentication',
                }}
            />
        </Stack>
    );
} 