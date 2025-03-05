import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { NotificationProvider } from '@/lib/contexts/NotificationContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import 'react-native-reanimated';

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ThemeProvider>
                    <AuthProvider>
                        <NotificationProvider>
                            <StatusBar style="auto" />
                            <RootLayoutNav />
                        </NotificationProvider>
                    </AuthProvider>
                </ThemeProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
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
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
                name="auth/verify"
                options={{
                    headerTitle: 'Verify Phone Number',
                }}
            />
            <Stack.Screen
                name="auth/email"
                options={{
                    headerTitle: 'Email Sign In',
                }}
            />
            <Stack.Screen
                name="browse"
                options={{
                    headerTitle: 'Browse Products',
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