import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/lib/contexts/ThemeContext';

export default function AuthLayout() {
    const { isDark } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: isDark ? '#121212' : '#F5F5F5',
                },
            }}
        >
            <Stack.Screen name="verify" />
            <Stack.Screen name="email" />
            <Stack.Screen name="callback" />
        </Stack>
    );
} 