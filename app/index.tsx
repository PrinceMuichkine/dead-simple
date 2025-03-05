import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform,
    Dimensions,
    ActivityIndicator,
    FlatList,
    Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Ionicons as IoniconsType } from '@expo/vector-icons/build/Icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithOAuth } from '../lib/supabase/client';
import { getAsset } from '../lib/utils/assetUtils';

const { width } = Dimensions.get('window');

// Carousel images
const carouselItems = [
    {
        id: '1',
        image: getAsset('onboarding-1'),
        title: 'Welcome to JUMBO',
        description: 'The marketplace that connects you with local merchants',
    },
    {
        id: '2',
        image: getAsset('onboarding-2'),
        title: 'Set up your store in minutes',
        description: 'Start selling your products quickly and easily',
    },
    {
        id: '3',
        image: getAsset('onboarding-3'),
        title: 'Secure payments',
        description: 'Safe and reliable payment options for all transactions',
    },
];

export default function HomeScreen() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const { isDark } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(false);

    // Social auth feature flags
    const enableSocialAuth = process.env.EXPO_PUBLIC_ENABLE_SOCIAL_AUTH === 'true';
    const enableAppleAuth = process.env.EXPO_PUBLIC_ENABLE_APPLE_AUTH === 'true' && enableSocialAuth;
    const enableGoogleAuth = process.env.EXPO_PUBLIC_ENABLE_GOOGLE_AUTH === 'true' && enableSocialAuth;

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

    const handleSocialAuth = async (provider: 'google' | 'apple') => {
        try {
            setIsAuthLoading(true);
            const result = await signInWithOAuth(provider);

            if (result.success) {
                // User will be redirected to the app after authentication
                // The session will be handled by Supabase Auth
            } else {
                console.error('Authentication failed:', result.error);
            }
        } catch (error) {
            console.error('Auth error:', error);
        } finally {
            setIsAuthLoading(false);
        }
    };

    const handlePhoneAuth = () => {
        router.push('/auth/register');
    };

    const handleLogin = () => {
        router.push('/auth/login');
    };

    // Auto scroll for carousel
    useEffect(() => {
        const timer = setInterval(() => {
            if (currentIndex < carouselItems.length - 1) {
                flatListRef.current?.scrollToIndex({
                    index: currentIndex + 1,
                    animated: true,
                });
            } else {
                flatListRef.current?.scrollToIndex({
                    index: 0,
                    animated: true,
                });
            }
        }, 5000);

        return () => clearInterval(timer);
    }, [currentIndex]);

    if (isLoading) {
        return (
            <View style={[styles.container, isDark ? styles.darkBackground : styles.lightBackground]}>
                <ActivityIndicator size="large" color={isDark ? '#FFFFFF' : '#000000'} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, isDark ? styles.darkBackground : styles.lightBackground]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {/* Logo and Header */}
            <View style={styles.header}>
                <Image
                    source={getAsset('logo')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                    <Text style={[styles.loginText, isDark ? styles.darkText : styles.lightText]}>
                        Login
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Carousel */}
            <View style={styles.carouselContainer}>
                <FlatList
                    ref={flatListRef}
                    data={carouselItems}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    onMomentumScrollEnd={(event) => {
                        const index = Math.floor(
                            Math.floor(event.nativeEvent.contentOffset.x) /
                            Math.floor(event.nativeEvent.layoutMeasurement.width)
                        );
                        setCurrentIndex(index);
                    }}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.carouselItem}>
                            <Image source={item.image} style={styles.carouselImage} />
                            <View style={styles.carouselTextContainer}>
                                <Text style={[styles.carouselTitle, isDark ? styles.darkText : styles.lightText]}>
                                    {item.title}
                                </Text>
                                <Text style={[styles.carouselDescription, isDark ? styles.darkSecondaryText : styles.lightSecondaryText]}>
                                    {item.description}
                                </Text>
                            </View>
                        </View>
                    )}
                />

                {/* Pagination Dots */}
                <View style={styles.paginationContainer}>
                    {carouselItems.map((_, index) => {
                        const inputRange = [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width,
                        ];

                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [10, 20, 10],
                            extrapolate: 'clamp',
                        });

                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    isDark ? styles.darkDot : styles.lightDot,
                                    {
                                        width: dotWidth,
                                        opacity,
                                    },
                                ]}
                            />
                        );
                    })}
                </View>
            </View>

            {/* Authentication Options */}
            <View style={styles.authContainer}>
                <Text style={[styles.authTitle, isDark ? styles.darkText : styles.lightText]}>
                    Get Started
                </Text>

                <TouchableOpacity
                    style={[styles.authButton, styles.phoneButton]}
                    onPress={handlePhoneAuth}
                    disabled={isAuthLoading}
                >
                    {isAuthLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <>
                            <Ionicons name="phone-portrait-outline" size={24} color="#FFFFFF" />
                            <Text style={styles.authButtonText}>Continue with Phone</Text>
                        </>
                    )}
                </TouchableOpacity>

                {enableGoogleAuth && (
                    <TouchableOpacity
                        style={[styles.authButton, styles.googleButton]}
                        onPress={() => handleSocialAuth('google')}
                        disabled={isAuthLoading}
                    >
                        <FontAwesome name="google" size={24} color="#FFFFFF" />
                        <Text style={styles.authButtonText}>Continue with Google</Text>
                    </TouchableOpacity>
                )}

                {Platform.OS === 'ios' && enableAppleAuth && (
                    <TouchableOpacity
                        style={[styles.authButton, styles.appleButton]}
                        onPress={() => handleSocialAuth('apple')}
                        disabled={isAuthLoading}
                    >
                        <FontAwesome name="apple" size={24} color="#FFFFFF" />
                        <Text style={styles.authButtonText}>Continue with Apple</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.termsContainer}>
                    <Text style={[styles.termsText, isDark ? styles.darkText : styles.lightText]}>
                        By continuing, you agree to our{' '}
                        <Text style={[styles.termsLink, isDark ? styles.darkText : styles.lightText]}>Terms of Service</Text> and{' '}
                        <Text style={[styles.termsLink, isDark ? styles.darkText : styles.lightText]}>Privacy Policy</Text>
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

// Feature item component for highlighting key features
interface FeatureItemProps {
    icon: keyof typeof IoniconsType.glyphMap;
    text: string;
    isDark: boolean;
}

// Prefix with underscore to indicate it's not used currently but kept for future use
// eslint-disable-next-line no-unused-vars
function _FeatureItem({ icon, text, isDark }: FeatureItemProps) {
    return (
        <View style={[styles.featureItem, isDark ? styles.darkBackground : styles.lightBackground]}>
            <Ionicons name={icon} size={24} color="#FF9500" />
            <Text style={[styles.featureText, isDark ? styles.darkText : styles.lightText]}>
                {text}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    logo: {
        width: 100,
        height: 40,
    },
    loginButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    loginText: {
        fontSize: 16,
        fontWeight: '600',
    },
    carouselContainer: {
        height: 300,
        marginBottom: 20,
    },
    carouselItem: {
        width,
        height: 280,
        alignItems: 'center',
    },
    carouselImage: {
        width: width * 0.9,
        height: 200,
        borderRadius: 20,
    },
    carouselTextContainer: {
        marginTop: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    carouselTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    carouselDescription: {
        fontSize: 16,
        textAlign: 'center',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    paginationDot: {
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
    },
    authContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    authTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    authButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 10,
        marginBottom: 16,
    },
    phoneButton: {
        backgroundColor: '#FF9500',
    },
    googleButton: {
        backgroundColor: '#DB4437',
    },
    appleButton: {
        backgroundColor: '#000000',
    },
    authButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    termsContainer: {
        marginTop: 20,
    },
    termsText: {
        fontSize: 14,
        textAlign: 'center',
    },
    termsLink: {
        color: '#FF9500',
        fontWeight: '600',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    featureText: {
        fontSize: 16,
        marginLeft: 16,
    },
    darkBackground: {
        backgroundColor: '#121212',
    },
    lightBackground: {
        backgroundColor: '#F5F5F5',
    },
    darkText: {
        color: '#FFFFFF',
    },
    lightText: {
        color: '#333333',
    },
    darkSecondaryText: {
        color: '#CCCCCC',
    },
    lightSecondaryText: {
        color: '#666666',
    },
    darkDot: {
        backgroundColor: '#FFFFFF',
    },
    lightDot: {
        backgroundColor: '#333333',
    },
}); 