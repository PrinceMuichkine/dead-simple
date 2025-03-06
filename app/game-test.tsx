import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { EnhancedBallRoller } from './(game)';
import { Stack, useRouter } from 'expo-router';

export default function GameTestPage() {
    const [showGame, setShowGame] = useState(false);
    const router = useRouter();

    const handleExit = () => {
        setShowGame(false);
    };

    const navigateHome = () => {
        router.push('/');
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Enhanced Ball Roller',
                    headerShown: !showGame,
                }}
            />

            {!showGame ? (
                <View style={styles.startScreen}>
                    <Text style={styles.title}>Enhanced Ball Roller</Text>
                    <Text style={styles.description}>
                        Play our enhanced game with improved physics and graphics
                    </Text>

                    <Pressable style={styles.button} onPress={() => setShowGame(true)}>
                        <Text style={styles.buttonText}>Start Game</Text>
                    </Pressable>

                    <Pressable style={[styles.button, styles.homeButton]} onPress={navigateHome}>
                        <Text style={styles.buttonText}>Back to Home</Text>
                    </Pressable>

                    <Text style={styles.instructions}>
                        How to play:{'\n\n'}
                        • Use WASD or arrow keys to move the ball{'\n'}
                        • Spacebar to jump when on ground{'\n'}
                        • Collect items to increase your score{'\n'}
                        • Avoid obstacles to prevent losing points{'\n'}
                        • Press P to pause the game
                    </Text>
                </View>
            ) : (
                <EnhancedBallRoller onExit={handleExit} onSwitchGame={navigateHome} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    startScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: '#aaa',
        textAlign: 'center',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#2194ce',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
        marginBottom: 16,
        minWidth: 200,
        alignItems: 'center',
    },
    homeButton: {
        backgroundColor: '#f44336',
        marginBottom: 40,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    instructions: {
        color: '#ddd',
        fontSize: 14,
        textAlign: 'left',
        width: '100%',
        maxWidth: 400,
        lineHeight: 22,
    },
}); 