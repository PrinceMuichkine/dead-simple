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
    Switch,
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

export default function PreferencesScreen() {
    const { t } = useTranslation();
    const { isDark, toggleTheme } = useTheme();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];

    // Preferences state
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [dataUsage, setDataUsage] = useState(false);
    const [darkMode, setDarkMode] = useState(isDark);

    // Fade in animation for the elements
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleFinish = () => {
        setIsLoading(true);
        // In a real app, this would save preferences to the user's account
        setTimeout(() => {
            setIsLoading(false);
            router.replace('/');
        }, 1000);
    };

    const handleBack = () => {
        router.back();
    };

    const handleToggleDarkMode = (value: boolean) => {
        setDarkMode(value);
        toggleTheme();
    };

    return (
        <View style={globalStyles.container}>
            <ImageBackground
                source={require('@//assets/images/home.webp')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <SafeAreaView style={styles.safeArea}>
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <Animated.View
                                style={[
                                    styles.contentContainer,
                                    { opacity: fadeAnim },
                                    isDark
                                        ? styles.contentContainerDark
                                        : styles.contentContainerLight
                                ]}
                            >
                                <Text style={[styles.sectionTitle, isDark ? null : { color: COLORS.black }]}>
                                    {t('onboarding.preferences.customizeExperience', 'Customize Your Experience')}
                                </Text>
                                <Text style={[styles.sectionDescription, isDark ? null : { color: COLORS.black }]}>
                                    {t('onboarding.preferences.settingsInfo', 'You can change these settings anytime in your profile')}
                                </Text>

                                <View style={styles.preferencesContainer}>
                                    {/* Push Notifications */}
                                    <View style={styles.preferenceItem}>
                                        <View style={styles.preferenceInfo}>
                                            <Ionicons
                                                name="notifications-outline"
                                                size={24}
                                                color={isDark ? COLORS.white : COLORS.primary}
                                                style={styles.preferenceIcon}
                                            />
                                            <View>
                                                <Text style={[styles.preferenceTitle, isDark ? null : { color: COLORS.black }]}>
                                                    {t('onboarding.preferences.pushNotifications', 'Push Notifications')}
                                                </Text>
                                                <Text style={[styles.preferenceDescription, isDark ? null : { color: 'rgba(0, 0, 0, 0.7)' }]}>
                                                    {t('onboarding.preferences.pushNotificationsDesc', 'Receive alerts about transactions and activities')}
                                                </Text>
                                            </View>
                                        </View>
                                        <Switch
                                            value={pushNotifications}
                                            onValueChange={setPushNotifications}
                                            trackColor={{ false: 'rgba(255, 255, 255, 0.3)', true: COLORS.primary }}
                                            thumbColor={Platform.OS === 'ios' ? '#fff' : pushNotifications ? COLORS.white : '#f4f3f4'}
                                            ios_backgroundColor="rgba(255, 255, 255, 0.3)"
                                        />
                                    </View>

                                    {/* Email Notifications */}
                                    <View style={styles.preferenceItem}>
                                        <View style={styles.preferenceInfo}>
                                            <Ionicons
                                                name="mail-outline"
                                                size={24}
                                                color={isDark ? COLORS.white : COLORS.primary}
                                                style={styles.preferenceIcon}
                                            />
                                            <View>
                                                <Text style={[styles.preferenceTitle, isDark ? null : { color: COLORS.black }]}>
                                                    {t('onboarding.preferences.emailNotifications', 'Email Notifications')}
                                                </Text>
                                                <Text style={[styles.preferenceDescription, isDark ? null : { color: 'rgba(0, 0, 0, 0.7)' }]}>
                                                    {t('onboarding.preferences.emailNotificationsDesc', 'Receive email updates about your account')}
                                                </Text>
                                            </View>
                                        </View>
                                        <Switch
                                            value={emailNotifications}
                                            onValueChange={setEmailNotifications}
                                            trackColor={{ false: 'rgba(255, 255, 255, 0.3)', true: COLORS.primary }}
                                            thumbColor={Platform.OS === 'ios' ? '#fff' : emailNotifications ? COLORS.white : '#f4f3f4'}
                                            ios_backgroundColor="rgba(255, 255, 255, 0.3)"
                                        />
                                    </View>

                                    {/* Data Usage */}
                                    <View style={styles.preferenceItem}>
                                        <View style={styles.preferenceInfo}>
                                            <Ionicons name="cellular-outline" size={24} color={COLORS.white} style={styles.preferenceIcon} />
                                            <View>
                                                <Text style={styles.preferenceTitle}>
                                                    {t('onboarding.preferences.dataUsage', 'Optimize Data Usage')}
                                                </Text>
                                                <Text style={styles.preferenceDescription}>
                                                    {t('onboarding.preferences.dataUsageDesc', 'Reduce data consumption when on cellular networks')}
                                                </Text>
                                            </View>
                                        </View>
                                        <Switch
                                            value={dataUsage}
                                            onValueChange={setDataUsage}
                                            trackColor={{ false: 'rgba(255, 255, 255, 0.3)', true: COLORS.primary }}
                                            thumbColor={Platform.OS === 'ios' ? '#fff' : dataUsage ? COLORS.white : '#f4f3f4'}
                                            ios_backgroundColor="rgba(255, 255, 255, 0.3)"
                                        />
                                    </View>

                                    {/* Dark Mode */}
                                    <View style={styles.preferenceItem}>
                                        <View style={styles.preferenceInfo}>
                                            <Ionicons
                                                name="moon-outline"
                                                size={24}
                                                color={isDark ? COLORS.white : COLORS.primary}
                                                style={styles.preferenceIcon}
                                            />
                                            <View>
                                                <Text style={[styles.preferenceTitle, isDark ? null : { color: COLORS.black }]}>
                                                    {t('onboarding.preferences.darkMode', 'Dark Mode')}
                                                </Text>
                                                <Text style={[styles.preferenceDescription, isDark ? null : { color: 'rgba(0, 0, 0, 0.7)' }]}>
                                                    {t('onboarding.preferences.darkModeDesc', 'Switch between light and dark theme')}
                                                </Text>
                                            </View>
                                        </View>
                                        <Switch
                                            value={darkMode}
                                            onValueChange={handleToggleDarkMode}
                                            trackColor={{ false: 'rgba(255, 255, 255, 0.3)', true: COLORS.primary }}
                                            thumbColor={Platform.OS === 'ios' ? '#fff' : darkMode ? COLORS.white : '#f4f3f4'}
                                            ios_backgroundColor="rgba(255, 255, 255, 0.3)"
                                        />
                                    </View>

                                    {/* Language */}
                                    <View style={styles.preferenceItem}>
                                        <View style={styles.preferenceInfo}>
                                            <Ionicons
                                                name="language-outline"
                                                size={24}
                                                color={isDark ? COLORS.white : COLORS.primary}
                                                style={styles.preferenceIcon}
                                            />
                                            <View>
                                                <Text style={[styles.preferenceTitle, isDark ? null : { color: COLORS.black }]}>
                                                    {t('onboarding.preferences.language', 'Language')}
                                                </Text>
                                                <Text style={[styles.preferenceDescription, isDark ? null : { color: 'rgba(0, 0, 0, 0.7)' }]}>
                                                    {t('onboarding.preferences.languageDesc', 'Choose your preferred language')}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        isLoading && styles.buttonDisabled
                                    ]}
                                    onPress={handleFinish}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <LdrHatch />
                                    ) : (
                                        <Text style={styles.buttonText}>
                                            {t('onboarding.preferences.finish', 'Finish Setup')}
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 8,
        textAlign: 'center',
    },
    sectionDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginBottom: 30,
    },
    preferencesContainer: {
        width: '100%',
        marginBottom: 20,
    },
    preferenceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    },
    preferenceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    preferenceIcon: {
        marginRight: 15,
    },
    preferenceTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.white,
        marginBottom: 4,
    },
    preferenceDescription: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        maxWidth: '90%',
    },
    button: {
        width: '100%',
        height: 54,
        backgroundColor: COLORS.primary,
        borderRadius: 6,
        borderWidth: 6,
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