import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '@/lib/styles/globalStyles';

interface LdrHatchProps {
    size?: number;
    color?: string;
    speed?: number;
    stroke?: number;
}

export function LdrHatch({
    size = 20,
    color = COLORS.white,
    speed = 3.5,
    stroke = 3
}: LdrHatchProps) {
    const centerLineAnimation = useRef(new Animated.Value(0)).current;
    const exploreAnimation1 = useRef(new Animated.Value(0)).current;
    const exploreAnimation2 = useRef(new Animated.Value(0.33)).current;
    const exploreAnimation3 = useRef(new Animated.Value(0.66)).current;

    useEffect(() => {
        // Animation loop for center line
        Animated.loop(
            Animated.timing(centerLineAnimation, {
                toValue: 1,
                duration: speed * 1000,
                useNativeDriver: true,
            })
        ).start();

        // Animation loops for the three explorer dots with different phases
        Animated.loop(
            Animated.timing(exploreAnimation1, {
                toValue: 1,
                duration: speed * 1000,
                useNativeDriver: true,
            })
        ).start();

        Animated.loop(
            Animated.timing(exploreAnimation2, {
                toValue: 1.33,
                duration: speed * 1000,
                useNativeDriver: true,
            })
        ).start();

        Animated.loop(
            Animated.timing(exploreAnimation3, {
                toValue: 1.66,
                duration: speed * 1000,
                useNativeDriver: true,
            })
        ).start();

        return () => {
            centerLineAnimation.stopAnimation();
            exploreAnimation1.stopAnimation();
            exploreAnimation2.stopAnimation();
            exploreAnimation3.stopAnimation();
        };
    }, [speed]);

    // Interpolations for center line
    const centerLineScaleX = centerLineAnimation.interpolate({
        inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
        outputRange: [1, size / stroke, 1, 1, 1, size / stroke, 1, 1, 1],
    });

    const centerLineScaleY = centerLineAnimation.interpolate({
        inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
        outputRange: [1, 1, 1, size / stroke, 1, 1, 1, size / stroke, 1],
    });

    // Interpolations for the three explorer dots
    // Explorer 1
    const createExplorerInterpolations = (animation: Animated.Value, startPoint = 0, endPoint = 1) => {
        const inputRange = [
            startPoint,
            startPoint + 0.125,
            startPoint + 0.25,
            startPoint + 0.375,
            startPoint + 0.5,
            startPoint + 0.625,
            startPoint + 0.75,
            startPoint + 0.875,
            endPoint
        ];

        return {
            x: animation.interpolate({
                inputRange,
                outputRange: [0, 0, size - stroke, size - stroke, size - stroke, size - stroke, 0, 0, 0],
            }),
            y: animation.interpolate({
                inputRange,
                outputRange: [0, 0, 0, 0, size - stroke, size - stroke, size - stroke, size - stroke, 0],
            }),
            scaleX: animation.interpolate({
                inputRange,
                outputRange: [1, size / stroke, 1, 1, 1, size / stroke, 1, 1, 1],
            }),
            scaleY: animation.interpolate({
                inputRange,
                outputRange: [1, 1, 1, size / stroke, 1, 1, 1, size / stroke, 1],
            })
        };
    };

    const explorer1 = createExplorerInterpolations(exploreAnimation1, 0, 1);
    const explorer2 = createExplorerInterpolations(exploreAnimation2, 0.33, 1.33);
    const explorer3 = createExplorerInterpolations(exploreAnimation3, 0.66, 1.66);

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {/* Center line */}
            <Animated.View
                style={[
                    styles.line,
                    {
                        width: stroke,
                        height: stroke,
                        backgroundColor: color,
                        transform: [
                            { scaleX: centerLineScaleX },
                            { scaleY: centerLineScaleY }
                        ]
                    }
                ]}
            />

            {/* Three explorer dots with different phases */}
            <Animated.View
                style={[
                    styles.explorerDot,
                    {
                        width: stroke,
                        height: stroke,
                        backgroundColor: color,
                        transform: [
                            { translateX: explorer1.x },
                            { translateY: explorer1.y },
                            { scaleX: explorer1.scaleX },
                            { scaleY: explorer1.scaleY }
                        ]
                    }
                ]}
            />

            <Animated.View
                style={[
                    styles.explorerDot,
                    {
                        width: stroke,
                        height: stroke,
                        backgroundColor: color,
                        transform: [
                            { translateX: explorer2.x },
                            { translateY: explorer2.y },
                            { scaleX: explorer2.scaleX },
                            { scaleY: explorer2.scaleY }
                        ]
                    }
                ]}
            />

            <Animated.View
                style={[
                    styles.explorerDot,
                    {
                        width: stroke,
                        height: stroke,
                        backgroundColor: color,
                        transform: [
                            { translateX: explorer3.x },
                            { translateY: explorer3.y },
                            { scaleX: explorer3.scaleX },
                            { scaleY: explorer3.scaleY }
                        ]
                    }
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    line: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -1.5,
        marginLeft: -1.5,
    },
    explorerDot: {
        position: 'absolute',
        top: 0,
        left: 0,
    }
});