import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Platform, useColorScheme } from 'react-native';
import useRouter from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const { isDark } = useTheme();

    useEffect(() => {
        // Redirect if already authenticated
        if (!isLoading && user) {
            if (user.userType === 'merchant') {
                if (user.storeId) {
                    router.replace('/merchant/dashboard');
                } else {
                    router.replace('/merchant/onboarding');
                }
            } else if (user.userType === 'customer') {
                router.replace('/browse');
            }
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
                <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#333333' }]}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/images/logo-placeholder.png')}
                    style={styles.logo}
                    onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
                />
                <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#333333' }]}>Jumbo</Text>
                <Text style={[styles.subtitle, { color: isDark ? '#CCCCCC' : '#666666' }]}>
                    West Africa's Instant E-commerce Platform
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={[styles.description, { color: isDark ? '#BBBBBB' : '#555555' }]}>
                    Create your online store in minutes and start selling to customers across West Africa.
                </Text>

                <View style={styles.features}>
                    <FeatureItem
                        icon="phone-portrait-outline"
                        text="Mobile-First Experience"
                        isDark={isDark}
                    />
                    <FeatureItem
                        icon="cash-outline"
                        text="Mobile Money Integration"
                        isDark={isDark}
                    />
                    <FeatureItem
                        icon="shield-checkmark-outline"
                        text="Secure Transactions"
                        isDark={isDark}
                    />
                    <FeatureItem
                        icon="analytics-outline"
                        text="AI-Powered Insights"
                        isDark={isDark}
                    />
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.merchantButton]}
                    onPress={() => router.push('/auth/register?type=merchant')}
                >
                    <Text style={styles.buttonText}>I'm a Merchant</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.customerButton]}
                    onPress={() => router.push('/auth/register?type=customer')}
                >
                    <Text style={styles.buttonText}>I'm a Customer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => router.push('/auth/login')}
                >
                    <Text style={[styles.loginText, { color: isDark ? '#DDDDDD' : '#555555' }]}>
                        Already have an account? Log in
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

interface FeatureItemProps {
    icon: any;
    text: string;
    isDark: boolean;
}

function FeatureItem({ icon, text, isDark }: FeatureItemProps) {
    return (
        <View style={styles.featureItem}>
            <Ionicons name={icon} size={24} color={isDark ? '#FF7043' : '#FF5722'} />
            <Text style={[styles.featureText, { color: isDark ? '#DDDDDD' : '#333333' }]}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        marginTop: 8,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        marginTop: 40,
        alignItems: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    features: {
        width: '100%',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    featureText: {
        marginLeft: 10,
        fontSize: 16,
    },
    buttonContainer: {
        width: '100%',
        marginBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    button: {
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
    },
    merchantButton: {
        backgroundColor: '#FF5722',
    },
    customerButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginButton: {
        alignItems: 'center',
        padding: 10,
    },
    loginText: {
        fontSize: 14,
    },
}); 