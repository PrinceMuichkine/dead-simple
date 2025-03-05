import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'fade',
                headerTitle: '',
                contentStyle: { backgroundColor: 'transparent' }
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="store" />
            <Stack.Screen name="preferences" />
        </Stack>
    );
} 