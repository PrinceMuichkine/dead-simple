import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';

// Particle effect types
export enum EffectType {
    EXPLOSION = 'explosion',
    SPARKLE = 'sparkle',
    TRAIL = 'trail',
    COLLECT = 'collect'
}

// Particle colors presets
export enum ColorScheme {
    FIRE = 'fire',
    ICE = 'ice',
    TOXIC = 'toxic',
    RAINBOW = 'rainbow',
    GOLD = 'gold'
}

interface ParticleProps {
    effectType: EffectType;
    position: [number, number, number];
    colorScheme?: ColorScheme;
    scale?: number;
    duration?: number;
    onComplete?: () => void;
}

// Helper function to get colors based on scheme
const getColorScheme = (scheme: ColorScheme): THREE.Color[] => {
    switch (scheme) {
        case ColorScheme.FIRE:
            return [
                new THREE.Color('#ff4400'),
                new THREE.Color('#ff8800'),
                new THREE.Color('#ffaa00'),
                new THREE.Color('#ffdd00')
            ];
        case ColorScheme.ICE:
            return [
                new THREE.Color('#00ccff'),
                new THREE.Color('#88ddff'),
                new THREE.Color('#aaeeff'),
                new THREE.Color('#ffffff')
            ];
        case ColorScheme.TOXIC:
            return [
                new THREE.Color('#00ff44'),
                new THREE.Color('#88ff00'),
                new THREE.Color('#ccff00'),
                new THREE.Color('#ddff88')
            ];
        case ColorScheme.RAINBOW:
            return [
                new THREE.Color('#ff0000'),
                new THREE.Color('#ffaa00'),
                new THREE.Color('#ffff00'),
                new THREE.Color('#00ff00'),
                new THREE.Color('#0088ff'),
                new THREE.Color('#8800ff')
            ];
        case ColorScheme.GOLD:
            return [
                new THREE.Color('#ffcc00'),
                new THREE.Color('#ffdd44'),
                new THREE.Color('#ffee88'),
                new THREE.Color('#ffffff')
            ];
        default:
            return [
                new THREE.Color('#ff4400'),
                new THREE.Color('#ff8800'),
                new THREE.Color('#ffaa00'),
                new THREE.Color('#ffdd00')
            ];
    }
};

interface Particle {
    id: number;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    rotation: THREE.Euler;
    rotationSpeed: THREE.Vector3;
    scale: number;
    scaleSpeed: number;
    opacity: number;
    opacitySpeed: number;
    color: THREE.Color;
    lifespan: number;
}

export const ParticleEffect: React.FC<ParticleProps> = ({
    effectType,
    position,
    colorScheme = ColorScheme.FIRE,
    scale = 1,
    duration = 1.5,
    onComplete
}) => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [active, setActive] = useState(true);
    const groupRef = useRef<THREE.Group>(null);
    const timer = useRef<number>(0);
    const colors = getColorScheme(colorScheme);

    // Create particles based on effect type
    useEffect(() => {
        const newParticles: Particle[] = [];
        let count = 0;
        let speed = 0;
        let size = 0;

        switch (effectType) {
            case EffectType.EXPLOSION:
                count = 35;
                speed = 5;
                size = 0.2 * scale;
                break;
            case EffectType.SPARKLE:
                count = 15;
                speed = 2;
                size = 0.1 * scale;
                break;
            case EffectType.TRAIL:
                count = 8;
                speed = 1;
                size = 0.15 * scale;
                break;
            case EffectType.COLLECT:
                count = 20;
                speed = 3;
                size = 0.12 * scale;
                break;
        }

        for (let i = 0; i < count; i++) {
            // Create directional vectors based on effect type
            let velocity: THREE.Vector3;

            if (effectType === EffectType.EXPLOSION) {
                // Explosion: particles move away from center in all directions
                const phi = Math.random() * Math.PI * 2;
                const theta = Math.random() * Math.PI;
                const r = speed * (0.5 + Math.random() * 0.5);

                velocity = new THREE.Vector3(
                    r * Math.sin(theta) * Math.cos(phi),
                    r * Math.sin(theta) * Math.sin(phi),
                    r * Math.cos(theta)
                );
            } else if (effectType === EffectType.TRAIL) {
                // Trail: particles move upward with slight horizontal spread
                velocity = new THREE.Vector3(
                    (Math.random() - 0.5) * speed * 0.3,
                    speed * (0.5 + Math.random() * 0.5),
                    (Math.random() - 0.5) * speed * 0.3
                );
            } else if (effectType === EffectType.SPARKLE) {
                // Sparkle: gentle outward movement
                velocity = new THREE.Vector3(
                    (Math.random() - 0.5) * speed,
                    (Math.random() - 0.5) * speed,
                    (Math.random() - 0.5) * speed
                );
            } else {
                // Collect: particles rise and converge slightly
                velocity = new THREE.Vector3(
                    (Math.random() - 0.5) * speed,
                    speed * (0.8 + Math.random() * 0.4),
                    (Math.random() - 0.5) * speed
                );
            }

            // Small random offset based on effect type
            const offset = effectType === EffectType.TRAIL ? 0.1 : 0.2;

            newParticles.push({
                id: i,
                position: new THREE.Vector3(
                    position[0] + (Math.random() - 0.5) * offset * scale,
                    position[1] + (Math.random() - 0.5) * offset * scale,
                    position[2] + (Math.random() - 0.5) * offset * scale
                ),
                velocity,
                rotation: new THREE.Euler(
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2
                ),
                rotationSpeed: new THREE.Vector3(
                    (Math.random() - 0.5) * 5,
                    (Math.random() - 0.5) * 5,
                    (Math.random() - 0.5) * 5
                ),
                scale: size * (0.8 + Math.random() * 0.4),
                scaleSpeed: -size / duration,
                opacity: 1,
                opacitySpeed: -1 / duration,
                color: colors[Math.floor(Math.random() * colors.length)],
                lifespan: duration * (0.7 + Math.random() * 0.6) // Varied lifespans for more natural look
            });
        }

        setParticles(newParticles);
        timer.current = 0;

        return () => {
            setParticles([]);
        };
    }, [effectType, position, scale, colorScheme, duration]);

    // Update particles
    useFrame((state, delta) => {
        if (!active) return;

        timer.current += delta;

        if (timer.current >= duration) {
            // Effect complete
            setActive(false);
            if (onComplete) onComplete();
            return;
        }

        setParticles(prevParticles => {
            let allDead = true;

            const updatedParticles = prevParticles.map(particle => {
                // Skip update if particle is already "dead"
                if (particle.opacity <= 0 || particle.scale <= 0) return particle;

                allDead = false;

                // Apply gravity for certain effects
                const gravity = effectType === EffectType.EXPLOSION ?
                    new THREE.Vector3(0, -2.5 * delta, 0) :
                    new THREE.Vector3(0, 0, 0);

                // Create updated particle
                const updatedParticle = {
                    ...particle,
                    position: particle.position.clone().add(
                        particle.velocity.clone().multiplyScalar(delta)
                    ),
                    velocity: particle.velocity.clone().add(gravity),
                    rotation: new THREE.Euler(
                        particle.rotation.x + particle.rotationSpeed.x * delta,
                        particle.rotation.y + particle.rotationSpeed.y * delta,
                        particle.rotation.z + particle.rotationSpeed.z * delta
                    ),
                    scale: Math.max(0, particle.scale + particle.scaleSpeed * delta),
                    opacity: Math.max(0, particle.opacity + particle.opacitySpeed * delta)
                };

                return updatedParticle;
            });

            if (allDead) {
                setActive(false);
                if (onComplete) onComplete();
            }

            return updatedParticles;
        });
    });

    // Don't render if not active
    if (!active) return null;

    return (
        <group ref={groupRef}>
            <Instances limit={50}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial transparent />

                {particles.map((particle) => (
                    <Instance
                        key={particle.id}
                        position={[particle.position.x, particle.position.y, particle.position.z]}
                        rotation={[particle.rotation.x, particle.rotation.y, particle.rotation.z]}
                        scale={particle.scale}
                        color={particle.color}
                    >
                        <meshStandardMaterial
                            transparent
                            opacity={particle.opacity}
                            color={particle.color}
                        />
                    </Instance>
                ))}
            </Instances>
        </group>
    );
};

// Hook for managing multiple effects
interface ActiveEffect {
    id: number;
    effectType: EffectType;
    position: [number, number, number];
    colorScheme: ColorScheme;
    scale: number;
    duration: number;
}

export const useParticleEffects = () => {
    const [effects, setEffects] = useState<ActiveEffect[]>([]);
    const effectIdCounter = useRef(0);

    const createEffect = (
        effectType: EffectType,
        position: [number, number, number],
        options?: {
            colorScheme?: ColorScheme;
            scale?: number;
            duration?: number;
        }
    ) => {
        const id = effectIdCounter.current++;

        setEffects(prev => [...prev, {
            id,
            effectType,
            position,
            colorScheme: options?.colorScheme || ColorScheme.FIRE,
            scale: options?.scale || 1,
            duration: options?.duration || 1.5
        }]);

        return id;
    };

    const removeEffect = (id: number) => {
        setEffects(prev => prev.filter(effect => effect.id !== id));
    };

    const clearAllEffects = () => {
        setEffects([]);
    };

    return {
        effects,
        createEffect,
        removeEffect,
        clearAllEffects
    };
};

export const ParticleEffectsContainer: React.FC<{
    effects: ActiveEffect[];
    onEffectComplete: (id: number) => void;
}> = ({ effects, onEffectComplete }) => {
    return (
        <group>
            {effects.map(effect => (
                <ParticleEffect
                    key={effect.id}
                    effectType={effect.effectType}
                    position={effect.position}
                    colorScheme={effect.colorScheme}
                    scale={effect.scale}
                    duration={effect.duration}
                    onComplete={() => onEffectComplete(effect.id)}
                />
            ))}
        </group>
    );
};

export default { ParticleEffect, useParticleEffects, ParticleEffectsContainer }; 