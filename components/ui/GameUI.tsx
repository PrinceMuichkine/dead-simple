import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface GameUIProps {
    score: number;
    bestScore: number;
    isGameActive: boolean;
    isPaused: boolean;
    onStart: () => void;
    onRestart: () => void;
    onPause: () => void;
    onResume: () => void;
    onExit: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({
    score,
    bestScore,
    isGameActive,
    isPaused,
    onStart,
    onRestart,
    onPause,
    onResume,
    onExit
}) => {
    return (
        <View style={styles.container}>
            {/* Score display - always visible */}
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>Score: {score}</Text>
                <Text style={styles.bestScoreText}>Best: {bestScore}</Text>
            </View>

            {/* Start menu - shown when game is not active */}
            {!isGameActive && (
                <View style={styles.menuContainer}>
                    <Text style={styles.titleText}>Ball Roller 3D</Text>
                    <TouchableOpacity style={styles.button} onPress={onStart}>
                        <Text style={styles.buttonText}>Start Game</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onExit}>
                        <Text style={styles.buttonText}>Exit</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Pause menu - shown when game is paused */}
            {isGameActive && isPaused && (
                <View style={styles.menuContainer}>
                    <Text style={styles.titleText}>Game Paused</Text>
                    <TouchableOpacity style={styles.button} onPress={onResume}>
                        <Text style={styles.buttonText}>Resume</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onRestart}>
                        <Text style={styles.buttonText}>Restart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onExit}>
                        <Text style={styles.buttonText}>Exit</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Pause button - shown during gameplay */}
            {isGameActive && !isPaused && (
                <TouchableOpacity style={styles.pauseButton} onPress={onPause}>
                    <Text style={styles.pauseButtonText}>| |</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreContainer: {
        position: 'absolute',
        top: 10,
        right: 20,
        alignItems: 'flex-end',
    },
    scoreText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    bestScoreText: {
        color: 'white',
        fontSize: 14,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    menuContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        minWidth: 200,
    },
    titleText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#2194ce',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 5,
        minWidth: 150,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    pauseButton: {
        position: 'absolute',
        top: 10,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pauseButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default GameUI; 