import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    ScrollView,
    Animated,
    Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router/build/hooks';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, globalStyles } from '@/lib/styles/globalStyles';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@/components/ui/button-expand';
import { LdrHatch } from '@/components/ui/ldrs';

const { width, height } = Dimensions.get('window');

// Temporary color constants until we fully integrate the global styles
const LOCAL_COLORS = {
    danger: '#DB4437',
    warning: '#F4B400',
    black: '#121212',
    transparentOverlay: 'rgba(0, 0, 0, 0.3)',
};

export default function EmailAuthScreen() {
    const { t } = useTranslation();
    const { isDark } = useTheme();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Fade in animation for the logo
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start animation when component mounts
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleEmailSubmit = () => {
        if (!email || !email.includes('@')) {
            Alert.alert(
                t('auth.emailScreen.invalidEmail'),
                t('auth.emailScreen.enterValidEmail')
            );
            return;
        }

        setIsLoading(true);
        // Simulating API call
        setTimeout(() => {
            setIsLoading(false);
            Alert.alert(
                t('auth.emailScreen.emailSent'),
                t('auth.emailScreen.checkEmail'),
                [{ text: t('auth.emailScreen.ok'), onPress: () => router.back() }]
            );
        }, 1500);
    };

    const handleGoBack = () => {
        router.back();
    };

    return (
        <KeyboardAvoidingView
            style={globalStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar style="light" />

            <ImageBackground
                source={require('../../assets/images/home.webp')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <SafeAreaView style={styles.container}>
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.logoContainer}>
                                <Animated.Image
                                    source={require('@/assets/jumbo_white.svg')}
                                    style={[styles.logo, { opacity: fadeAnim }]}
                                    resizeMode="contain"
                                />
                            </View>

                            <View style={[
                                styles.contentContainer,
                                isDark
                                    ? styles.contentContainerDark
                                    : styles.contentContainerLight
                            ]}>
                                <View style={styles.headerContainer}>
                                    <Text style={styles.title}>{t('auth.emailScreen.title')}</Text>
                                    <Text style={styles.subtitle}>
                                        {t('auth.emailScreen.subtitle')}
                                    </Text>
                                </View>

                                {/* Email Input */}
                                <View style={styles.inputContainer}>
                                    <View style={styles.inputWrapper}>
                                        <FontAwesome
                                            name="envelope"
                                            size={18}
                                            color="white"
                                            style={styles.inputIcon}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder={t('auth.emailScreen.placeholder')}
                                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                </View>

                                {/* Submit Button */}
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        isLoading && styles.buttonDisabled
                                    ]}
                                    onPress={handleEmailSubmit}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <LdrHatch />
                                    ) : (
                                        <Text style={styles.buttonText}>{t('auth.emailScreen.sendTheLink')}</Text>
                                    )}
                                </TouchableOpacity>

                                {/* Go Back Button */}
                                <View style={[styles.backButtonContainer, { marginTop: -5 }]}>
                                    <BackButton
                                        onPress={handleGoBack}
                                        text={t('auth.emailScreen.goBack')}
                                    />
                                </View>

                                {/* Footer */}
                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>
                                        {t('home.byContinnuing')}
                                    </Text>
                                    <View style={styles.footerLinks}>
                                        <TouchableOpacity onPress={() => Linking.openURL('https://lomi.africa/terms')}>
                                            <Text style={styles.footerLink}>{t('home.termsOfService')}</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.footerText}> {t('home.and')} </Text>
                                        <TouchableOpacity onPress={() => Linking.openURL('https://lomi.africa/privacy')}>
                                            <Text style={styles.footerLink}>{t('home.privacyPolicy')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
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
        backgroundColor: LOCAL_COLORS.transparentOverlay,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        padding: 20,
        paddingTop: 90,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 20,
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
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 15,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 6,
        paddingHorizontal: 15,
        height: 54,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 54,
        color: '#FFFFFF',
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 54,
        backgroundColor: COLORS.primary,
        borderRadius: 6,
        borderWidth: 6, // Added for style consistency
        borderColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    backButtonContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        alignItems: 'center',
        marginTop: 15,
    },
    footerText: {
        color: COLORS.white,
        fontSize: 12,
    },
    footerLinks: {
        flexDirection: 'row',
        marginTop: 5,
    },
    footerLink: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '600',
        marginHorizontal: 5,
    },
}); 