import React, { useRef, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import { Accelerometer, AccelerometerMeasurement } from 'expo-sensors';
import * as THREE from 'three';
import { useRouter } from 'expo-router';

// Import our custom components
import { usePhysics } from '../../components/basics/GamePhysics';
import { useObstacles, ObstaclesContainer, ObstacleType } from '../../components/basics/ObstaclesManager';
import { GameEnvironment, EnvironmentTheme } from '../../components/basics/GameEnvironment';
import { useParticleEffects, ParticleEffectsContainer, EffectType, ColorScheme } from '../../components/basics/ParticleEffects';
import { useGamePause } from '../../components/basics/GameControls';

// Game settings
const SETTINGS = {
    BALL_RADIUS: 1,
    BALL_SEGMENTS: 32,
    ACCELERATION_FACTOR: 2,
    MAX_TILT: 1.5,
    ARENA_SIZE: 40,
    WALL_HEIGHT: 1.2,
    OBSTACLE_LIMIT: 10,
    OBSTACLE_SPAWN_RATE: 2, // seconds
    COLLECTIBLE_CHANCE: 0.3,
    MAX_LEVEL: 5,
    LEVEL_UP_SCORE: 500,
    BALL_SPEED: 5,
    JUMP_FORCE: 5,
    TRAIL_INTERVAL: 0.5,
    MAX_OBSTACLES: 20,
    SPAWN_RATE: 2,
};

// Game difficulty progression
const getDifficultySettings = (level: number) => {
    return {
        obstacleSpeed: 1 + level * 0.5,
        obstacleSpawnRate: Math.max(0.5, SETTINGS.OBSTACLE_SPAWN_RATE - level * 0.5),
        obstacleTypes: level >= 3
            ? [ObstacleType.CUBE, ObstacleType.SPHERE, ObstacleType.CYLINDER, ObstacleType.RAMP]
            : [ObstacleType.CUBE, ObstacleType.SPHERE]
    };
};

// Ball component with physics
interface BallProps {
    position?: [number, number, number];
    onCollision?: (collisionData: any) => void;
    onCollect?: (collisionData: any) => void;
    accelerometerData: AccelerometerMeasurement | null;
    keyboardControls: {
        up: boolean;
        down: boolean;
        left: boolean;
        right: boolean;
        space: boolean;
    };
    isKeyboardControl?: boolean;
}

const Ball: React.FC<BallProps> = ({
    position,
    onCollision,
    onCollect,
    accelerometerData,
    keyboardControls,
    isKeyboardControl = false
}) => {
    // Physics hook for ball movement
    const physics = usePhysics({
        gravity: 9.8,
        friction: 0.98,
        bounceEnergy: 0.5
    });

    // Set initial position if provided
    useEffect(() => {
        if (position) {
            physics.resetPhysics({
                x: position[0],
                y: position[1],
                z: position[2]
            });
        }
    }, []);

    const { camera } = useThree();
    const ballRef = useRef<THREE.Mesh>(null);
    const trailTimer = useRef<number>(0);
    const collisionRef = useRef<boolean>(false);
    const collectibleRef = useRef<boolean>(false);
    const collisionDataRef = useRef<any>(null);

    // Get particle effects hook
    const { effects, createEffect, removeEffect } = useParticleEffects();

    // Handle collisions with obstacles
    useEffect(() => {
        if (collisionRef.current && onCollision) {
            onCollision(collisionDataRef.current);
            createEffect(
                EffectType.EXPLOSION,
                [
                    physics.position.current.x,
                    physics.position.current.y,
                    physics.position.current.z
                ],
                { colorScheme: ColorScheme.FIRE, scale: 1.2 }
            );
            collisionRef.current = false;
        }
    }, [collisionRef.current]);

    // Handle collectibles
    useEffect(() => {
        if (collectibleRef.current && onCollect) {
            onCollect(collisionDataRef.current);
            createEffect(
                EffectType.COLLECT,
                [
                    physics.position.current.x,
                    physics.position.current.y + 0.5,
                    physics.position.current.z
                ],
                { colorScheme: ColorScheme.GOLD, scale: 1 }
            );
            collectibleRef.current = false;
        }
    }, [collectibleRef.current]);

    // Movement control function
    useFrame((state, delta) => {
        if (ballRef.current) {
            // Move ball based on input (accelerometer or keyboard)
            if (isKeyboardControl) {
                // Keyboard controls
                if (keyboardControls.up) {
                    physics.applyForce("forward", SETTINGS.BALL_SPEED * delta);
                }
                if (keyboardControls.down) {
                    physics.applyForce("backward", SETTINGS.BALL_SPEED * delta);
                }
                if (keyboardControls.left) {
                    physics.applyForce("left", SETTINGS.BALL_SPEED * delta);
                }
                if (keyboardControls.right) {
                    physics.applyForce("right", SETTINGS.BALL_SPEED * delta);
                }
                if (keyboardControls.space && physics.grounded) {
                    physics.jump(SETTINGS.JUMP_FORCE);
                }
            } else {
                // Accelerometer controls
                const tiltX = accelerometerData?.x || 0;
                const tiltZ = accelerometerData?.y || 0;

                if (Math.abs(tiltX) > 0.1) {
                    physics.applyForce(tiltX > 0 ? "right" : "left",
                        Math.abs(tiltX) * SETTINGS.BALL_SPEED * delta);
                }

                if (Math.abs(tiltZ) > 0.1) {
                    physics.applyForce(tiltZ > 0 ? "backward" : "forward",
                        Math.abs(tiltZ) * SETTINGS.BALL_SPEED * delta);
                }
            }

            // Camera follows the ball with slight lag
            const cameraTargetPosition = new THREE.Vector3(
                physics.position.current.x * 0.5,
                physics.position.current.y + 5,
                physics.position.current.z + 8
            );

            camera.position.lerp(cameraTargetPosition, delta * 2);
            camera.lookAt(
                physics.position.current.x,
                physics.position.current.y,
                physics.position.current.z
            );

            // Create trail effect
            trailTimer.current += delta;
            if (trailTimer.current > SETTINGS.TRAIL_INTERVAL) {
                if (Math.sqrt(
                    physics.velocity.current.x * physics.velocity.current.x +
                    physics.velocity.current.z * physics.velocity.current.z
                ) > 0.1) {
                    createEffect(
                        EffectType.TRAIL,
                        [
                            physics.position.current.x,
                            physics.position.current.y - SETTINGS.BALL_RADIUS * 0.5,
                            physics.position.current.z
                        ],
                        {
                            colorScheme: ColorScheme.ICE,
                            scale: 0.5
                        }
                    );
                    trailTimer.current = 0;
                }
            }

            // Keep ball in bounds
            if (physics.position.current.x < -SETTINGS.ARENA_SIZE / 2 + SETTINGS.BALL_RADIUS) {
                physics.resetPhysics({
                    x: -SETTINGS.ARENA_SIZE / 2 + SETTINGS.BALL_RADIUS,
                    y: physics.position.current.y,
                    z: physics.position.current.z
                });
                // Reset velocity separately if needed
                physics.velocity.current.x = -physics.velocity.current.x * 0.8;
            }
            if (physics.position.current.x > SETTINGS.ARENA_SIZE / 2 - SETTINGS.BALL_RADIUS) {
                physics.resetPhysics({
                    x: SETTINGS.ARENA_SIZE / 2 - SETTINGS.BALL_RADIUS,
                    y: physics.position.current.y,
                    z: physics.position.current.z
                });
                // Reset velocity separately if needed
                physics.velocity.current.x = -physics.velocity.current.x * 0.8;
            }
            if (physics.position.current.z < -SETTINGS.ARENA_SIZE / 2 + SETTINGS.BALL_RADIUS) {
                physics.resetPhysics({
                    x: physics.position.current.x,
                    y: physics.position.current.y,
                    z: -SETTINGS.ARENA_SIZE / 2 + SETTINGS.BALL_RADIUS
                });
                // Reset velocity separately if needed
                physics.velocity.current.z = -physics.velocity.current.z * 0.8;
            }
            if (physics.position.current.z > SETTINGS.ARENA_SIZE / 2 - SETTINGS.BALL_RADIUS) {
                physics.resetPhysics({
                    x: physics.position.current.x,
                    y: physics.position.current.y,
                    z: SETTINGS.ARENA_SIZE / 2 - SETTINGS.BALL_RADIUS
                });
                // Reset velocity separately if needed
                physics.velocity.current.z = -physics.velocity.current.z * 0.8;
            }
        }
    });

    return (
        <>
            <mesh
                ref={ballRef}
                position={[physics.position.current.x, physics.position.current.y, physics.position.current.z]}
                castShadow
                receiveShadow
            >
                <sphereGeometry
                    args={[SETTINGS.BALL_RADIUS, SETTINGS.BALL_SEGMENTS, SETTINGS.BALL_SEGMENTS]}
                />
                <meshStandardMaterial
                    color="#1e88e5"
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#104577"
                    emissiveIntensity={0.2}
                />
            </mesh>

            <ParticleEffectsContainer
                effects={effects}
                onEffectComplete={(id) => removeEffect(id)}
            />
        </>
    );
};

// Game scene component with world setup
interface GameSceneProps {
    level: number;
    score: number;
    onScoreChange: (score: number) => void;
    theme?: EnvironmentTheme;
    accelerometerData: AccelerometerMeasurement | null;
    keyboardControls: {
        up: boolean;
        down: boolean;
        left: boolean;
        right: boolean;
        space: boolean;
    };
    isKeyboardControl?: boolean;
}

const GameScene: React.FC<GameSceneProps> = ({
    level,
    score,
    onScoreChange,
    theme = EnvironmentTheme.GRASS,
    accelerometerData,
    keyboardControls,
    isKeyboardControl = false
}) => {
    const { scene } = useThree();

    // Get difficulty settings for current level
    const difficulty = getDifficultySettings(level);

    // Use obstacles hook with correct parameter type
    const {
        obstacles,
        updateObstacles,
        createObstacle,
        checkCollisions,
        collectObstacle,
        clearObstacles
    } = useObstacles(SETTINGS.OBSTACLE_LIMIT);

    // Ball initial position
    const [ballPosition, setBallPosition] = useState<[number, number, number]>([0, SETTINGS.BALL_RADIUS, 0]);

    // Handle ball collision with obstacle
    const handleBallCollision = (collisionData: any) => {
        // Lose points for collisions
        onScoreChange(Math.max(0, score - 50));
    };

    // Handle ball collecting an item
    const handleBallCollect = (collisionData: any) => {
        // Gain points for collections
        onScoreChange(score + 100);
        collectObstacle(collisionData.obstacleId);
    };

    // Get environment theme based on level
    const getEnvironmentTheme = () => {
        switch (level % 5) {
            case 0: return EnvironmentTheme.GRASS;
            case 1: return EnvironmentTheme.DESERT;
            case 2: return EnvironmentTheme.SNOW;
            case 3: return EnvironmentTheme.SPACE;
            case 4: return EnvironmentTheme.NEON;
            default: return EnvironmentTheme.GRASS;
        }
    };

    // Spawn obstacles periodically
    useEffect(() => {
        const spawnInterval = setInterval(() => {
            // Pick a random obstacle type
            const types = difficulty.obstacleTypes;
            const type = types[Math.floor(Math.random() * types.length)];

            // Spawn the obstacle with random collectible chance
            createObstacle(type, Math.random() < SETTINGS.COLLECTIBLE_CHANCE);
        }, difficulty.obstacleSpawnRate * 1000);

        return () => {
            clearInterval(spawnInterval);
        };
    }, [level, difficulty]);

    // Update obstacle positions
    useFrame((state, delta) => {
        // Update all obstacles
        updateObstacles(delta);

        // Check collisions with the ball
        checkCollisions({
            x: ballPosition[0],
            y: ballPosition[1],
            z: ballPosition[2]
        }, SETTINGS.BALL_RADIUS);
    });

    return (
        <>
            {/* Environment */}
            <GameEnvironment
                floorSize={SETTINGS.ARENA_SIZE}
                theme={getEnvironmentTheme()}
                withWalls={true}
                wallHeight={SETTINGS.WALL_HEIGHT}
            />

            {/* Ball */}
            <Ball
                position={ballPosition}
                onCollision={handleBallCollision}
                onCollect={handleBallCollect}
                accelerometerData={accelerometerData}
                keyboardControls={keyboardControls}
                isKeyboardControl={!accelerometerData}
            />

            {/* Obstacles */}
            <ObstaclesContainer obstacles={obstacles} />
        </>
    );
};

// Main Game Component
export default function EnhancedBallRoller({ onExit, onSwitchGame }: { onExit?: () => void, onSwitchGame?: () => void }) {
    const router = useRouter();
    // Game state
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [accelerometerData, setAccelerometerData] = useState<AccelerometerMeasurement | null>(null);
    const [useKeyboard, setUseKeyboard] = useState(true);

    // Keyboard controls state
    const [keyboardControls, setKeyboardControls] = useState({
        up: false,
        down: false,
        left: false,
        right: false,
        space: false
    });

    // Game pause hook
    const { isPaused, togglePause } = useGamePause();

    // Setup accelerometer
    useEffect(() => {
        if (!useKeyboard) {
            // Start accelerometer when not using keyboard
            Accelerometer.setUpdateInterval(16);
            const subscription = Accelerometer.addListener(data => {
                setAccelerometerData(data);
            });

            return () => {
                subscription.remove();
            };
        } else {
            setAccelerometerData(null);
        }
    }, [useKeyboard]);

    // Setup keyboard controls
    useEffect(() => {
        if (useKeyboard) {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'ArrowUp' || e.key === 'w') {
                    setKeyboardControls(prev => ({ ...prev, up: true }));
                } else if (e.key === 'ArrowDown' || e.key === 's') {
                    setKeyboardControls(prev => ({ ...prev, down: true }));
                } else if (e.key === 'ArrowLeft' || e.key === 'a') {
                    setKeyboardControls(prev => ({ ...prev, left: true }));
                } else if (e.key === 'ArrowRight' || e.key === 'd') {
                    setKeyboardControls(prev => ({ ...prev, right: true }));
                } else if (e.key === ' ') {
                    setKeyboardControls(prev => ({ ...prev, space: true }));
                } else if (e.key === 'p') {
                    togglePause();
                }
            };

            const handleKeyUp = (e: KeyboardEvent) => {
                if (e.key === 'ArrowUp' || e.key === 'w') {
                    setKeyboardControls(prev => ({ ...prev, up: false }));
                } else if (e.key === 'ArrowDown' || e.key === 's') {
                    setKeyboardControls(prev => ({ ...prev, down: false }));
                } else if (e.key === 'ArrowLeft' || e.key === 'a') {
                    setKeyboardControls(prev => ({ ...prev, left: false }));
                } else if (e.key === 'ArrowRight' || e.key === 'd') {
                    setKeyboardControls(prev => ({ ...prev, right: false }));
                } else if (e.key === ' ') {
                    setKeyboardControls(prev => ({ ...prev, space: false }));
                }
            };

            // Add event listeners
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('keyup', handleKeyUp);
            };
        }
    }, [useKeyboard]);

    // Check for level up
    useEffect(() => {
        if (score >= SETTINGS.LEVEL_UP_SCORE * level && level < SETTINGS.MAX_LEVEL) {
            setLevel(prev => prev + 1);
        }
    }, [score, level]);

    // Handle score changes
    const handleScoreChange = (newScore: number) => {
        setScore(newScore);
    };

    // Handle exit if not provided
    const handleExit = () => {
        if (onExit) {
            onExit();
        } else {
            router.back();
        }
    };

    // Handle switch game if not provided
    const handleSwitchGame = () => {
        if (onSwitchGame) {
            onSwitchGame();
        } else {
            router.push('/');
        }
    };

    return (
        <View style={styles.container}>
            {/* Game stats UI */}
            <View style={styles.stats}>
                <Text style={styles.scoreText}>Score: {score}</Text>
                <Text style={styles.levelText}>Level: {level}</Text>
                <TouchableOpacity style={styles.button} onPress={togglePause}>
                    <Text style={styles.buttonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.controlButton]}
                    onPress={() => setUseKeyboard(!useKeyboard)}
                >
                    <Text style={styles.buttonText}>
                        {useKeyboard ? 'Use Tilt Controls' : 'Use Keyboard'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={handleExit}>
                    <Text style={styles.buttonText}>Exit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.switchButton]} onPress={handleSwitchGame}>
                    <Text style={styles.buttonText}>Home</Text>
                </TouchableOpacity>
            </View>

            {/* Game Canvas */}
            <Canvas
                style={styles.canvas}
                shadows
            >
                {!isPaused && (
                    <GameScene
                        level={level}
                        score={score}
                        onScoreChange={handleScoreChange}
                        accelerometerData={accelerometerData}
                        keyboardControls={keyboardControls}
                    />
                )}
            </Canvas>

            {/* Controls help */}
            <View style={styles.controls}>
                {useKeyboard ? (
                    <Text style={styles.controlsText}>
                        Use WASD or Arrow Keys to move. Spacebar to jump. P to pause.
                    </Text>
                ) : (
                    <Text style={styles.controlsText}>
                        Tilt your device to move the ball. Avoid obstacles and collect items!
                    </Text>
                )}
            </View>

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    canvas: {
        flex: 1,
    },
    stats: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 10,
        flexWrap: 'wrap',
    },
    scoreText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 5,
    },
    levelText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 5,
    },
    button: {
        backgroundColor: '#1e88e5',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 5,
        marginVertical: 4,
    },
    controlButton: {
        backgroundColor: '#2e7d32',
    },
    exitButton: {
        backgroundColor: '#e53935',
    },
    switchButton: {
        backgroundColor: '#3949ab',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    controls: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    controlsText: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: '#ffffff',
        padding: 10,
        borderRadius: 10,
        textAlign: 'center',
    },
}); 