import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useColorScheme } from 'react-native';

interface GameUIProps {
    score: number;
    bestScore: number;
    isGameActive: boolean;
    isPaused: boolean;
    onStart: () => void;
    onRestart: () => void;
    onPause: () => void;
    onResume: () => void;
    onExit?: () => void;
}

export default function GameUI({
    score,
    bestScore,
    isGameActive,
    isPaused,
    onStart,
    onRestart,
    onPause,
    onResume,
    onExit
}: GameUIProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const textColor = isDark ? '#ffffff' : '#000000';
    const backgroundColor = isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)';
    const buttonColor = isDark ? '#3498db' : '#2980b9';

    return (
        <View style={styles.container}>
            {/* Score display */}
            {isGameActive && !isPaused && (
                <View style={[styles.scoreContainer, { backgroundColor }]}>
                    <Text style={[styles.scoreText, { color: textColor }]}>
                        Score: {score}
                    </Text>
                    <Text style={[styles.bestScoreText, { color: textColor }]}>
                        Best: {bestScore}
                    </Text>
                </View>
            )}

            {/* Start screen */}
            {!isGameActive && (
                <View style={styles.menuContainer}>
                    <View style={[styles.menu, { backgroundColor }]}>
                        <Text style={[styles.title, { color: textColor }]}>
                            Rope Dodger 3D
                        </Text>

                        {score > 0 && (
                            <View style={styles.scoreResults}>
                                <Text style={[styles.scoreResultText, { color: textColor }]}>
                                    Score: {score}
                                </Text>
                                <Text style={[styles.scoreResultText, { color: textColor }]}>
                                    Best: {bestScore}
                                </Text>
                            </View>
                        )}

                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                { backgroundColor: buttonColor, opacity: pressed ? 0.8 : 1 }
                            ]}
                            onPress={score > 0 ? onRestart : onStart}
                        >
                            <Text style={styles.buttonText}>
                                {score > 0 ? 'Play Again' : 'Start Game'}
                            </Text>
                        </Pressable>

                        {onExit && (
                            <Pressable
                                style={({ pressed }) => [
                                    styles.button,
                                    styles.exitButton,
                                    { opacity: pressed ? 0.8 : 1 }
                                ]}
                                onPress={onExit}
                            >
                                <Text style={styles.buttonText}>Exit</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            )}

            {/* Pause menu */}
            {isGameActive && isPaused && (
                <View style={styles.menuContainer}>
                    <View style={[styles.menu, { backgroundColor }]}>
                        <Text style={[styles.title, { color: textColor }]}>
                            Game Paused
                        </Text>

                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                { backgroundColor: buttonColor, opacity: pressed ? 0.8 : 1 }
                            ]}
                            onPress={onResume}
                        >
                            <Text style={styles.buttonText}>Resume</Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                { backgroundColor: buttonColor, opacity: pressed ? 0.8 : 1 }
                            ]}
                            onPress={onRestart}
                        >
                            <Text style={styles.buttonText}>Restart</Text>
                        </Pressable>

                        {onExit && (
                            <Pressable
                                style={({ pressed }) => [
                                    styles.button,
                                    styles.exitButton,
                                    { opacity: pressed ? 0.8 : 1 }
                                ]}
                                onPress={onExit}
                            >
                                <Text style={styles.buttonText}>Exit</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            )}

            {/* Pause button */}
            {isGameActive && !isPaused && (
                <Pressable
                    style={[styles.pauseButton, { backgroundColor }]}
                    onPress={onPause}
                >
                    <Text style={[styles.pauseButtonText, { color: textColor }]}>II</Text>
                </Pressable>
            )}

            {/* Mobile controls help text */}
            {isGameActive && !isPaused && Platform.OS !== 'web' && (
                <View style={[styles.controlsHelp, { backgroundColor }]}>
                    <Text style={[styles.controlsHelpText, { color: textColor }]}>
                        Tilt your device to move
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        pointerEvents: 'box-none',
    },
    scoreContainer: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
        borderRadius: 8,
    },
    scoreText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    bestScoreText: {
        fontSize: 14,
        marginTop: 5,
    },
    menuContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    menu: {
        width: 300,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    scoreResults: {
        marginBottom: 20,
        alignItems: 'center',
    },
    scoreResultText: {
        fontSize: 16,
        marginBottom: 5,
    },
    button: {
        width: '100%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    exitButton: {
        backgroundColor: '#e74c3c',
    },
    pauseButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pauseButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    controlsHelp: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        padding: 10,
        borderRadius: 8,
    },
    controlsHelpText: {
        fontSize: 14,
    },
}); 