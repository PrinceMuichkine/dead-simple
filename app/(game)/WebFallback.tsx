import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface WebFallbackProps {
    onExit?: () => void;
    onSwitchGame?: () => void;
}

export default function WebFallback({ onExit, onSwitchGame }: WebFallbackProps) {
    const router = useRouter();

    const handleExit = () => {
        if (onExit) {
            onExit();
        } else {
            router.back();
        }
    };

    const handleSwitchGame = () => {
        if (onSwitchGame) {
            onSwitchGame();
        } else {
            router.push('/');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Enhanced Ball Roller</Text>
                <Text style={styles.message}>
                    The 3D game is currently only available on mobile devices.
                </Text>
                <Text style={styles.description}>
                    This game uses advanced 3D graphics and accelerometer controls that work best on iOS and Android.
                    Please try our game on a mobile device for the full experience.
                </Text>

                <TouchableOpacity style={styles.button} onPress={handleExit}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={handleSwitchGame}>
                    <Text style={styles.buttonText}>Return Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A1929',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '80%',
        maxWidth: 500,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    message: {
        fontSize: 18,
        color: '#90CAF9',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: '#BBDEFB',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    button: {
        backgroundColor: '#1E88E5',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 30,
        marginBottom: 16,
        minWidth: 200,
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: '#455A64',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 30,
        minWidth: 200,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 