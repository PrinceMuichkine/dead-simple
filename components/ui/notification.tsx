import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Platform,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/lib/styles/globalStyles';
import { NotificationFeedbackType, ImpactFeedbackStyle } from 'expo-haptics';

// We'll use conditional import for Haptics to avoid errors on platforms where it's not available
interface HapticsInterface {
    notificationAsync: (type: NotificationFeedbackType) => Promise<void>;
    impactAsync: (style: ImpactFeedbackStyle) => Promise<void>;
    NotificationFeedbackType: {
        Success: NotificationFeedbackType;
        Error: NotificationFeedbackType;
        Warning: NotificationFeedbackType;
    };
    ImpactFeedbackStyle: {
        Light: ImpactFeedbackStyle;
    };
}

let Haptics: HapticsInterface;
try {
    Haptics = require('expo-haptics');
} catch (e) {
    // Create a mock object if expo-haptics is not available
    Haptics = {
        notificationAsync: () => Promise.resolve(),
        impactAsync: () => Promise.resolve(),
        NotificationFeedbackType: {
            Success: NotificationFeedbackType.Success,
            Error: NotificationFeedbackType.Error,
            Warning: NotificationFeedbackType.Warning,
        },
        ImpactFeedbackStyle: {
            Light: ImpactFeedbackStyle.Light,
        }
    };
}

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Map notification types to Ionicons names
type IconNameMap = {
    [key in NotificationType]: React.ComponentProps<typeof Ionicons>['name'];
};

const iconNames: IconNameMap = {
    success: 'checkmark-circle',
    error: 'alert-circle',
    info: 'information-circle',
    warning: 'warning',
};

interface NotificationProps {
    visible: boolean;
    type?: NotificationType;
    title: string;
    message?: string;
    duration?: number;
    onDismiss: () => void;
}

export default function Notification({
    visible,
    type = 'info',
    title,
    message,
    duration = 3000,
    onDismiss,
}: NotificationProps) {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    // Get appropriate colors and icon based on notification type
    const getTypeStyles = (): {
        backgroundColor: string;
        iconName: React.ComponentProps<typeof Ionicons>['name'];
        iconColor: string;
    } => {
        switch (type) {
            case 'success':
                return {
                    backgroundColor: COLORS.success,
                    iconName: iconNames.success,
                    iconColor: '#fff',
                };
            case 'error':
                return {
                    backgroundColor: COLORS.danger,
                    iconName: iconNames.error,
                    iconColor: '#fff',
                };
            case 'warning':
                return {
                    backgroundColor: COLORS.warning,
                    iconName: iconNames.warning,
                    iconColor: '#000',
                };
            case 'info':
            default:
                return {
                    backgroundColor: COLORS.primary,
                    iconName: iconNames.info,
                    iconColor: '#fff',
                };
        }
    };

    const { backgroundColor, iconName, iconColor } = getTypeStyles();

    // Show notification with animation
    const showNotification = () => {
        // Trigger haptic feedback based on notification type
        if (Platform.OS !== 'web') {
            try {
                switch (type) {
                    case 'success':
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        break;
                    case 'error':
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                        break;
                    case 'warning':
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        break;
                    default:
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
            } catch (e) {
                console.log('Haptics not available', e);
            }
        }

        // Reset position
        translateY.setValue(-100);
        opacity.setValue(0);

        // Animate in
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        // Auto dismiss after duration
        if (duration > 0) {
            const timer = setTimeout(() => {
                dismissNotification();
            }, duration);

            return () => clearTimeout(timer);
        }
    };

    // Dismiss notification with animation
    const dismissNotification = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onDismiss();
        });
    };

    // Handle visibility changes
    useEffect(() => {
        if (visible) {
            showNotification();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
            <Animated.View
                style={[
                    styles.container,
                    { backgroundColor },
                    { transform: [{ translateY }], opacity }
                ]}
            >
                <View style={styles.contentContainer}>
                    <Ionicons name={iconName} size={24} color={iconColor} style={styles.icon} />
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{title}</Text>
                        {message ? <Text style={styles.message}>{message}</Text> : null}
                    </View>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={dismissNotification}>
                    <Ionicons name="close" size={20} color={iconColor} />
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        pointerEvents: 'box-none',
    },
    container: {
        margin: 10,
        marginTop: Platform.OS === 'ios' ? 10 : 40,
        borderRadius: 6, // Following your style guidelines
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    message: {
        color: '#fff',
        fontSize: 14,
        marginTop: 2,
        opacity: 0.9,
    },
    closeButton: {
        padding: 5,
    },
}); 