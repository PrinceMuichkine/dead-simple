import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function RootLayout() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <RootLayoutNav />
            </AuthProvider>
        </ThemeProvider>
    );
}

function RootLayoutNav() {
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
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
                name="auth/login"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="auth/register"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="auth/verify"
                options={{
                    headerTitle: 'Verify Phone Number',
                }}
            />
            <Stack.Screen
                name="merchant/dashboard"
                options={{
                    headerTitle: 'Dashboard',
                }}
            />
            <Stack.Screen
                name="merchant/onboarding"
                options={{
                    headerTitle: 'Create Your Store',
                    headerBackVisible: false,
                }}
            />
            <Stack.Screen
                name="store/[id]"
                options={{
                    headerTitle: 'Store',
                }}
            />
            <Stack.Screen
                name="product/[id]"
                options={{
                    headerTitle: 'Product Details',
                }}
            />
        </Stack>
    );
} 