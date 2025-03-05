import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    ScrollView,
    Animated,
    Platform,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { COLORS, globalStyles } from '@/lib/styles/globalStyles';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LdrHatch } from '@/components/ui/ldrs';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const { t } = useTranslation();
    const { isDark } = useTheme();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    // Shimmer animation sequence
    const startShimmerAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                })
            ])
        ).start();
    };

    // Fade in animation for the elements
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Start shimmer effect
        startShimmerAnimation();
    }, []);

    const handleGetStarted = () => {
        setIsLoading(true);
        setTimeout(() => {
            router.push('/(onboarding)/profile');
        }, 1500);
    };

    // Interpolate shimmer animation
    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-width * 0.5, width * 1.5]
    });

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground
                source={require('@/assets/images/home.webp')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={[styles.overlay, isDark ? null : { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                    <SafeAreaView style={styles.safeArea}>
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.headerContainer}>
                                <Animated.Image
                                    source={require('@/assets/jumbo_white.svg')}
                                    style={[styles.logo, { opacity: fadeAnim }]}
                                    resizeMode="contain"
                                />
                            </View>

                            <Animated.View
                                style={[
                                    styles.contentContainer,
                                    isDark ? styles.contentContainerDark : styles.contentContainerLight,
                                    {
                                        opacity: fadeAnim, transform: [{
                                            translateY: fadeAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [50, 0]
                                            })
                                        }]
                                    }
                                ]}
                            >
                                <View style={styles.logoContainer}>
                                    <Text style={[styles.logoText, isDark ? { color: COLORS.white } : { color: COLORS.primary }]}>
                                        {t('onboarding.welcome.title', 'Welcome to Dead Simple')}
                                    </Text>
                                    <Animated.View style={[styles.shimmerOverlay, { transform: [{ translateX: shimmerTranslate }] }]} />
                                </View>

                                <View style={styles.featuresContainer}>
                                    <View style={styles.featureItem}>
                                        <View style={styles.featureIconContainer}>
                                            <Ionicons
                                                name="rocket-outline"
                                                size={28}
                                                color={isDark ? COLORS.white : COLORS.primary}
                                            />
                                        </View>
                                        <View style={styles.featureTextContainer}>
                                            <Text style={[styles.featureTitle, isDark ? { color: COLORS.white } : { color: COLORS.primary }]}>
                                                {t('onboarding.welcome.feature1.title', 'Grow your business')}
                                            </Text>
                                            <Text style={[styles.featureDescription, isDark ? { color: COLORS.lightGray } : { color: COLORS.gray }]}>
                                                {t('onboarding.welcome.feature1.description', 'Set up a store in minutes and start accepting payments')}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.featureItem}>
                                        <View style={styles.featureIconContainer}>
                                            <Ionicons
                                                name="people-outline"
                                                size={28}
                                                color={isDark ? COLORS.white : COLORS.primary}
                                            />
                                        </View>
                                        <View style={styles.featureTextContainer}>
                                            <Text style={[styles.featureTitle, isDark ? { color: COLORS.white } : { color: COLORS.primary }]}>
                                                {t('onboarding.welcome.feature2.title', 'Discover new products')}
                                            </Text>
                                            <Text style={[styles.featureDescription, isDark ? { color: COLORS.lightGray } : { color: COLORS.gray }]}>
                                                {t('onboarding.welcome.feature2.description', 'Connect with people and businesses around you')}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.featureItem}>
                                        <View style={styles.featureIconContainer}>
                                            <Ionicons
                                                name="shield-checkmark-outline"
                                                size={28}
                                                color={isDark ? COLORS.white : COLORS.primary}
                                            />
                                        </View>
                                        <View style={styles.featureTextContainer}>
                                            <Text style={[styles.featureTitle, isDark ? { color: COLORS.white } : { color: COLORS.primary }]}>
                                                {t('onboarding.welcome.feature3.title', 'Dont you worry about anything')}
                                            </Text>
                                            <Text style={[styles.featureDescription, isDark ? { color: COLORS.lightGray } : { color: COLORS.gray }]}>
                                                {t('onboarding.welcome.feature3.description', 'Fast, responsive, and reliable platform')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        isLoading && { opacity: 0.7 }
                                    ]}
                                    onPress={handleGetStarted}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <LdrHatch />
                                    ) : (
                                        <Text style={styles.buttonText}>
                                            {t('onboarding.welcome.getStarted', 'Get Started')}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </Animated.View>
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 20,
        minHeight: height - 100,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    logo: {
        width: width * 0.6,
        height: 100,
    },
    contentContainer: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 50,
        borderRadius: 6,
        paddingVertical: 25,
        paddingHorizontal: 20,
    },
    contentContainerDark: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    contentContainerLight: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
        overflow: 'hidden',
        position: 'relative',
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    shimmerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        transform: [{ skewX: '-20deg' }],
    },
    featuresContainer: {
        width: '100%',
        marginBottom: 30,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    featureIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        opacity: 0.8,
    },
    button: {
        width: '100%',
        height: 54,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
        borderWidth: 6,
        borderColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    }
}); 