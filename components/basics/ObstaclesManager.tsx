import React, { useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Box, useTexture } from '@react-three/drei';

// Define obstacle types
export enum ObstacleType {
    CUBE = 'cube',
    SPHERE = 'sphere',
    CYLINDER = 'cylinder',
    RAMP = 'ramp'
}

// Obstacle interface
export interface Obstacle {
    id: number;
    type: ObstacleType;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    size: number;
    rotation: THREE.Euler;
    color: string;
    collected: boolean;
    isCollectible: boolean;
}

// Hook for managing obstacles
export const useObstacles = (
    maxObstacles = 10,
    spawnRate = 0.02,
    worldBounds = { width: 20, length: 20 }
) => {
    const [obstacles, setObstacles] = useState<Obstacle[]>([]);
    const nextId = useRef(1);
    const spawnTimer = useRef(0);

    // Create a new obstacle
    const createObstacle = useCallback((
        type: ObstacleType = ObstacleType.CUBE,
        isCollectible = false
    ): Obstacle => {
        // Generate random position at the edges of the play area
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        const size = Math.random() * 0.3 + 0.3; // Random size between 0.3 and 0.6

        let x = 0, z = 0;
        let velocityX = 0, velocityZ = 0;
        const speed = Math.random() * 0.03 + 0.01;

        switch (side) {
            case 0: // Top
                x = Math.random() * worldBounds.width - worldBounds.width / 2;
                z = -worldBounds.length / 2 - size;
                velocityZ = speed;
                break;
            case 1: // Right
                x = worldBounds.width / 2 + size;
                z = Math.random() * worldBounds.length - worldBounds.length / 2;
                velocityX = -speed;
                break;
            case 2: // Bottom
                x = Math.random() * worldBounds.width - worldBounds.width / 2;
                z = worldBounds.length / 2 + size;
                velocityZ = -speed;
                break;
            case 3: // Left
                x = -worldBounds.width / 2 - size;
                z = Math.random() * worldBounds.length - worldBounds.length / 2;
                velocityX = speed;
                break;
        }

        // Choose color based on whether it's a collectible
        const color = isCollectible ? '#ffcc00' : ['#ff5555', '#55ff55', '#5555ff'][Math.floor(Math.random() * 3)];

        return {
            id: nextId.current++,
            type,
            position: new THREE.Vector3(x, size, z),
            velocity: new THREE.Vector3(velocityX, 0, velocityZ),
            size,
            rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
            color,
            collected: false,
            isCollectible
        };
    }, [worldBounds]);

    // Update obstacles positions and check for out-of-bounds
    const updateObstacles = useCallback((delta: number) => {
        // Spawn new obstacles based on spawnRate
        spawnTimer.current += delta;
        if (spawnTimer.current > 1 / spawnRate && obstacles.length < maxObstacles) {
            spawnTimer.current = 0;

            // 20% chance to spawn a collectible
            const isCollectible = Math.random() < 0.2;
            const newObstacle = createObstacle(ObstacleType.CUBE, isCollectible);

            setObstacles(prev => [...prev, newObstacle]);
        }

        // Update positions and remove out-of-bounds obstacles
        setObstacles(prev =>
            prev
                .map(obstacle => {
                    // Skip update if collected
                    if (obstacle.collected) return obstacle;

                    // Update position
                    const newPosition = obstacle.position.clone().add(
                        obstacle.velocity.clone().multiplyScalar(delta * 60)
                    );

                    // Update rotation
                    const newRotation = new THREE.Euler(
                        obstacle.rotation.x + 0.01 * delta * 60,
                        obstacle.rotation.y + 0.02 * delta * 60,
                        obstacle.rotation.z + 0.01 * delta * 60
                    );

                    return {
                        ...obstacle,
                        position: newPosition,
                        rotation: newRotation
                    };
                })
                .filter(obstacle => {
                    // Keep if collected (for animation purposes) or within bounds (with margin)
                    if (obstacle.collected) return true;

                    const margin = obstacle.size * 2;
                    return (
                        obstacle.position.x > -worldBounds.width / 2 - margin &&
                        obstacle.position.x < worldBounds.width / 2 + margin &&
                        obstacle.position.z > -worldBounds.length / 2 - margin &&
                        obstacle.position.z < worldBounds.length / 2 + margin
                    );
                })
        );
    }, [obstacles.length, createObstacle, maxObstacles, spawnRate, worldBounds]);

    // Mark obstacle as collected
    const collectObstacle = useCallback((id: number) => {
        setObstacles(prev =>
            prev.map(obstacle =>
                obstacle.id === id ? { ...obstacle, collected: true } : obstacle
            )
        );
    }, []);

    // Check collision with a ball
    const checkCollisions = useCallback((
        ballPosition: { x: number, y: number, z: number },
        ballRadius: number
    ) => {
        let collectedItems = 0;
        let collisions = 0;

        // Check each obstacle
        obstacles.forEach(obstacle => {
            if (obstacle.collected) return;

            const dx = ballPosition.x - obstacle.position.x;
            const dy = ballPosition.y - obstacle.position.y;
            const dz = ballPosition.z - obstacle.position.z;

            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const collisionDistance = ballRadius + obstacle.size;

            if (distance < collisionDistance) {
                if (obstacle.isCollectible) {
                    collectObstacle(obstacle.id);
                    collectedItems++;
                } else {
                    collisions++;
                }
            }
        });

        return { collectedItems, collisions };
    }, [obstacles, collectObstacle]);

    // Clear all obstacles
    const clearObstacles = useCallback(() => {
        setObstacles([]);
    }, []);

    // Get active obstacles count (not collected)
    const activeObstaclesCount = obstacles.filter(o => !o.collected).length;

    return {
        obstacles,
        updateObstacles,
        createObstacle,
        collectObstacle,
        checkCollisions,
        clearObstacles,
        activeObstaclesCount
    };
};

// Obstacle component for rendering
interface ObstacleProps {
    obstacle: Obstacle;
}

export const ObstacleObject: React.FC<ObstacleProps> = ({ obstacle }) => {
    // Apply a floating effect for collectibles
    const collectibleYOffset = useRef(0);

    useFrame((state, delta) => {
        if (obstacle.isCollectible) {
            collectibleYOffset.current = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
    });

    // Handle different obstacle types
    switch (obstacle.type) {
        case ObstacleType.CUBE:
            return (
                <Box
                    position={[
                        obstacle.position.x,
                        obstacle.position.y + (obstacle.isCollectible ? collectibleYOffset.current : 0),
                        obstacle.position.z
                    ]}
                    rotation={[obstacle.rotation.x, obstacle.rotation.y, obstacle.rotation.z]}
                    args={[obstacle.size, obstacle.size, obstacle.size]}
                    visible={!obstacle.collected}
                >
                    <meshStandardMaterial
                        color={obstacle.color}
                        emissive={obstacle.isCollectible ? obstacle.color : undefined}
                        emissiveIntensity={obstacle.isCollectible ? 0.5 : 0}
                        metalness={obstacle.isCollectible ? 0.8 : 0.1}
                        roughness={obstacle.isCollectible ? 0.2 : 0.8}
                    />
                </Box>
            );
        default:
            return null;
    }
};

// Container component for all obstacles
interface ObstaclesContainerProps {
    obstacles: Obstacle[];
}

export const ObstaclesContainer: React.FC<ObstaclesContainerProps> = ({ obstacles }) => {
    return (
        <group>
            {obstacles.map(obstacle => (
                <ObstacleObject key={obstacle.id} obstacle={obstacle} />
            ))}
        </group>
    );
};

export default useObstacles; 