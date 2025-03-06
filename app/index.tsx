import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
    const router = useRouter();

    const navigateToGame = () => {
        router.push('/game-test');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.header}>
                <Text style={styles.title}>Just A Game</Text>
                <Text style={styles.subtitle}>Enhanced Ball Roller Game</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.description}>
                    Roll a ball through a course with enhanced graphics, physics, and obstacles.
                    Collect items and avoid hazards as you progress through levels!
                </Text>

                <TouchableOpacity style={styles.playButton} onPress={navigateToGame}>
                    <Text style={styles.playButtonText}>PLAY NOW</Text>
                </TouchableOpacity>

                <Text style={styles.features}>
                    ✓ Realistic Physics{'\n'}
                    ✓ Dynamic Obstacles{'\n'}
                    ✓ Multiple Environments{'\n'}
                    ✓ Tilt & Keyboard Controls{'\n'}
                    ✓ Progressive Difficulty
                </Text>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Made with React Three Fiber and Expo</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A1929',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#90CAF9',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    description: {
        fontSize: 16,
        color: '#BBDEFB',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    playButton: {
        backgroundColor: '#1E88E5',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 30,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    playButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    features: {
        fontSize: 14,
        color: '#64B5F6',
        textAlign: 'left',
        lineHeight: 24,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        color: '#64B5F6',
        fontSize: 12,
    },
}); 