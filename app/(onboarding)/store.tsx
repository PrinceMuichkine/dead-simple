import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    ScrollView,
    Animated,
    TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { COLORS, globalStyles } from '@/lib/styles/globalStyles';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LdrHatch } from '@/components/ui/ldrs';
import LogoUploader from '@/components/ui/logo-uploader';

const { width, height } = Dimensions.get('window');

export default function StoreSetupScreen() {
    const { t } = useTranslation();
    const { isDark } = useTheme();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];

    // Form state
    const [storeName, setStoreName] = useState('');
    const [storeDescription, setStoreDescription] = useState('');
    const [logo, setLogo] = useState<string | null>(null);

    // Fade in animation for the elements
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleContinue = () => {
        if (!storeName) {
            // Show error message (would use proper validation in production)
            alert(t('onboarding.store.fillRequiredFields', 'Please fill in all required fields'));
            return;
        }

        setIsLoading(true);
        // Navigate to the preferences screen after a brief delay
        setTimeout(() => {
            setIsLoading(false);
            router.push("/(onboarding)/preferences");
        }, 1000);
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <KeyboardAvoidingView
            style={globalStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
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
                                <TouchableOpacity
                                    style={styles.backButton}
                                    onPress={handleBack}
                                >
                                    <Ionicons name="chevron-back" size={24} color={COLORS.white} />
                                </TouchableOpacity>

                                <Text style={styles.headerTitle}>
                                    {t('onboarding.store.title', 'Set Up Your Store')}
                                </Text>
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
                                <LogoUploader
                                    currentLogo={logo}
                                    onLogoUpdate={(newLogoUrl) => setLogo(newLogoUrl)}
                                    companyName={storeName || t('onboarding.store.defaultName', 'My Store')}
                                />

                                <View style={styles.formContainer}>
                                    {/* Store Name Input */}
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>
                                            {t('onboarding.store.storeName', 'Store Name')} *
                                        </Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder={t('onboarding.store.storeNamePlaceholder', 'Your store name')}
                                                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                                value={storeName}
                                                onChangeText={setStoreName}
                                            />
                                        </View>
                                    </View>

                                    {/* Store Description Input */}
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>
                                            {t('onboarding.store.storeDescription', 'Store Description')}
                                        </Text>
                                        <View style={[styles.inputWrapper, styles.descriptionInputWrapper]}>
                                            <TextInput
                                                style={[styles.input, styles.descriptionInput]}
                                                placeholder={t('onboarding.store.storeDescriptionPlaceholder', 'Tell us about your store')}
                                                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                                value={storeDescription}
                                                onChangeText={setStoreDescription}
                                                multiline
                                                numberOfLines={4}
                                                textAlignVertical="top"
                                            />
                                        </View>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        isLoading && styles.buttonDisabled
                                    ]}
                                    onPress={handleContinue}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <LdrHatch />
                                    ) : (
                                        <Text style={styles.buttonText}>
                                            {t('onboarding.store.continue', 'Continue')}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </Animated.View>
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
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
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
    formContainer: {
        width: '100%',
        marginBottom: 25,
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.white,
        marginBottom: 8,
    },
    inputWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 6,
        paddingHorizontal: 15,
        height: 50,
    },
    input: {
        flex: 1,
        height: '100%',
        color: COLORS.white,
        fontSize: 16,
    },
    descriptionInputWrapper: {
        height: 120,
        paddingVertical: 10,
    },
    descriptionInput: {
        height: 100,
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