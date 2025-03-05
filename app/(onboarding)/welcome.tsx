import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    ScrollView,
    Animated,
    Platform
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

    // Fade in animation for the elements
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleGetStarted = () => {
        setIsLoading(true);
        // Navigate to the next onboarding screen after a brief delay
        setTimeout(() => {
            setIsLoading(false);
            router.push("/(onboarding)/profile");
        }, 1000);
    };

    return (
        <View style={globalStyles.container}>
            <ImageBackground
                source={require('../../assets/images/home.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
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
                                <Animated.Text style={[styles.welcomeTitle, { opacity: fadeAnim }]}>
                                    {t('onboarding.welcome.title', 'Welcome to Jumbo')}
                                </Animated.Text>
                            </View>

                            <Animated.View
                                style={[
                                    styles.contentContainer,
                                    { opacity: fadeAnim },
                                    isDark
                                        ? styles.contentContainerDark
                                        : styles.contentContainerLight
                                ]}
                            >
                                <View style={styles.featuresContainer}>
                                    <View style={styles.featureItem}>
                                        <View style={styles.featureIconContainer}>
                                            <Ionicons name="wallet-outline" size={24} color={COLORS.primary} />
                                        </View>
                                        <View style={styles.featureTextContainer}>
                                            <Text style={styles.featureTitle}>
                                                {t('onboarding.welcome.feature1.title', 'Easy Payments')}
                                            </Text>
                                            <Text style={styles.featureDescription}>
                                                {t('onboarding.welcome.feature1.description', 'Send and receive money quickly and securely')}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.featureItem}>
                                        <View style={styles.featureIconContainer}>
                                            <Ionicons name="people-outline" size={24} color={COLORS.primary} />
                                        </View>
                                        <View style={styles.featureTextContainer}>
                                            <Text style={styles.featureTitle}>
                                                {t('onboarding.welcome.feature2.title', 'Community')}
                                            </Text>
                                            <Text style={styles.featureDescription}>
                                                {t('onboarding.welcome.feature2.description', 'Connect with people and businesses around you')}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.featureItem}>
                                        <View style={styles.featureIconContainer}>
                                            <Ionicons name="shield-checkmark-outline" size={24} color={COLORS.primary} />
                                        </View>
                                        <View style={styles.featureTextContainer}>
                                            <Text style={styles.featureTitle}>
                                                {t('onboarding.welcome.feature3.title', 'Secure')}
                                            </Text>
                                            <Text style={styles.featureDescription}>
                                                {t('onboarding.welcome.feature3.description', 'Your data and transactions are always protected')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        isLoading && styles.buttonDisabled
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
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        zIndex: 10,
    },
    logo: {
        width: width * 0.6,
        height: 100,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        marginTop: 20,
        textAlign: 'center',
    },
    contentContainer: {
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
        marginBottom: 40,
        borderRadius: 6,
        paddingVertical: 25,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    contentContainerDark: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    contentContainerLight: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    featuresContainer: {
        width: '100%',
        marginBottom: 30,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    featureIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 5,
    },
    featureDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    button: {
        width: '100%',
        height: 54,
        backgroundColor: COLORS.primary,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
}); 