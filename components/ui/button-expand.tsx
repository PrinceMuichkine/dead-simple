import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/lib/styles/globalStyles';

interface ButtonExpandProps {
    text: string;
    onPress: () => void;
    icon?: keyof typeof Ionicons.glyphMap;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderWidth?: number;
    iconPlacement?: 'left' | 'right';
}

export function ButtonExpand({
    text,
    onPress,
    icon = 'chevron-back',
    backgroundColor = 'transparent',
    textColor = COLORS.white,
    borderColor = 'rgba(255, 255, 255, 0.3)',
    borderWidth = 1,
    iconPlacement = 'left'
}: ButtonExpandProps) {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor,
                    borderColor,
                    borderWidth
                }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
        >
            {iconPlacement === 'left' && isPressed && (
                <Ionicons name={icon} size={20} color={textColor} style={styles.leftIcon} />
            )}
            <Text style={[styles.text, { color: textColor }]}>{text}</Text>
            {iconPlacement === 'right' && isPressed && (
                <Ionicons name={icon} size={20} color={textColor} style={styles.rightIcon} />
            )}
        </TouchableOpacity>
    );
}

export function BackButton({ onPress, text = 'Go Back' }: { onPress: () => void; text?: string }) {
    return (
        <ButtonExpand
            text={text}
            onPress={onPress}
            icon="chevron-back"
            iconPlacement="left"
            backgroundColor="transparent"
            textColor={COLORS.white}
            borderColor="rgba(255, 255, 255, 0.3)"
            borderWidth={1}
        />
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 6,
        height: 54,
        width: '100%',
        marginVertical: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    leftIcon: {
        marginRight: 10,
    },
    rightIcon: {
        marginLeft: 10,
    }
}); 