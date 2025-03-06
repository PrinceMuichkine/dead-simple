import { useRef } from 'react';

// Physics constants
export interface PhysicsSettings {
    gravity: number;
    friction: number;
    acceleration: number;
    maxSpeed: number;
    bounceEnergy: number;
}

export const DEFAULT_PHYSICS: PhysicsSettings = {
    gravity: 0.02,
    friction: 0.98,
    acceleration: 0.01,
    maxSpeed: 0.2,
    bounceEnergy: 0.5
};

// Generic physics hook for 3D objects with gravity and collisions
export const usePhysics = (settings: Partial<PhysicsSettings> = {}) => {
    // Merge default settings with provided settings
    const physicsSettings = {
        ...DEFAULT_PHYSICS,
        ...settings
    };

    // Physics state
    const position = useRef({ x: 0, y: 0, z: 0 });
    const velocity = useRef({ x: 0, y: 0, z: 0 });
    const rotation = useRef({ x: 0, y: 0, z: 0 });
    const grounded = useRef(false);

    // Apply forces to the object
    const applyForce = (direction: 'left' | 'right' | 'forward' | 'backward', force: number = 1) => {
        const { acceleration, maxSpeed } = physicsSettings;

        switch (direction) {
            case 'left':
                velocity.current.x -= acceleration * force;
                break;
            case 'right':
                velocity.current.x += acceleration * force;
                break;
            case 'forward':
                velocity.current.z -= acceleration * force;
                break;
            case 'backward':
                velocity.current.z += acceleration * force;
                break;
        }

        // Clamp velocity
        velocity.current.x = Math.max(-maxSpeed, Math.min(maxSpeed, velocity.current.x));
        velocity.current.z = Math.max(-maxSpeed, Math.min(maxSpeed, velocity.current.z));
    };

    // Jump function
    const jump = (jumpForce: number = 0.2) => {
        if (grounded.current) {
            velocity.current.y = jumpForce;
            grounded.current = false;
        }
    };

    // Update physics
    const updatePhysics = (delta: number, boundaries?: {
        minX: number;
        maxX: number;
        minZ: number;
        maxZ: number;
        groundY: number;
    }) => {
        const { gravity, friction, bounceEnergy } = physicsSettings;

        // Apply friction
        velocity.current.x *= friction;
        velocity.current.z *= friction;

        // Apply gravity if not grounded
        if (position.current.y > (boundaries?.groundY || 0)) {
            velocity.current.y -= gravity * delta;
            grounded.current = false;
        } else {
            // Object is on the ground
            position.current.y = boundaries?.groundY || 0;
            velocity.current.y = 0;
            grounded.current = true;
        }

        // Update position
        position.current.x += velocity.current.x * delta;
        position.current.y += velocity.current.y * delta;
        position.current.z += velocity.current.z * delta;

        // Check boundaries if provided
        if (boundaries) {
            if (position.current.x < boundaries.minX) {
                position.current.x = boundaries.minX;
                velocity.current.x = -velocity.current.x * bounceEnergy;
            } else if (position.current.x > boundaries.maxX) {
                position.current.x = boundaries.maxX;
                velocity.current.x = -velocity.current.x * bounceEnergy;
            }

            if (position.current.z < boundaries.minZ) {
                position.current.z = boundaries.minZ;
                velocity.current.z = -velocity.current.z * bounceEnergy;
            } else if (position.current.z > boundaries.maxZ) {
                position.current.z = boundaries.maxZ;
                velocity.current.z = -velocity.current.z * bounceEnergy;
            }
        }

        // Update rotation based on velocity for rolling objects
        rotation.current.z -= velocity.current.x * 2 * delta;
        rotation.current.x += velocity.current.z * 2 * delta;

        return {
            position: { ...position.current },
            velocity: { ...velocity.current },
            rotation: { ...rotation.current },
            grounded: grounded.current
        };
    };

    // Check collision with other objects
    const checkCollision = (
        otherPosition: { x: number; y: number; z: number },
        radius: number,
        otherRadius: number
    ): boolean => {
        const dx = position.current.x - otherPosition.x;
        const dy = position.current.y - otherPosition.y;
        const dz = position.current.z - otherPosition.z;

        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        return distance < (radius + otherRadius);
    };

    // Reset physics
    const resetPhysics = (newPosition = { x: 0, y: 0, z: 0 }) => {
        position.current = { ...newPosition };
        velocity.current = { x: 0, y: 0, z: 0 };
        rotation.current = { x: 0, y: 0, z: 0 };
        grounded.current = false;
    };

    return {
        position,
        velocity,
        rotation,
        grounded,
        applyForce,
        jump,
        updatePhysics,
        checkCollision,
        resetPhysics
    };
};

export default usePhysics; 