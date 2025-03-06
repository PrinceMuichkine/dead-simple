import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane, Box, Sky, Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';

// Environment theme types
export enum EnvironmentTheme {
    GRASS = 'grass',
    DESERT = 'desert',
    SNOW = 'snow',
    SPACE = 'space',
    NEON = 'neon'
}

// Environment props
interface EnvironmentProps {
    floorSize?: number;
    theme?: EnvironmentTheme;
    withWalls?: boolean;
    wallHeight?: number;
}

export const GameEnvironment: React.FC<EnvironmentProps> = ({
    floorSize = 20,
    theme = EnvironmentTheme.GRASS,
    withWalls = true,
    wallHeight = 1
}) => {
    // Get the appropriate textures based on theme
    const getEnvironmentColors = () => {
        switch (theme) {
            case EnvironmentTheme.GRASS:
                return {
                    floor: '#44aa44',
                    wall: '#aa8866',
                    ambient: '#a0d8ff',
                    fog: '#c4e0ff'
                };
            case EnvironmentTheme.DESERT:
                return {
                    floor: '#e0c080',
                    wall: '#d4a060',
                    ambient: '#ffe0a0',
                    fog: '#ffedcc'
                };
            case EnvironmentTheme.SNOW:
                return {
                    floor: '#f0f0f0',
                    wall: '#e0e0e0',
                    ambient: '#e8f0ff',
                    fog: '#ffffff'
                };
            case EnvironmentTheme.SPACE:
                return {
                    floor: '#111122',
                    wall: '#221133',
                    ambient: '#000011',
                    fog: '#000022'
                };
            case EnvironmentTheme.NEON:
                return {
                    floor: '#111111',
                    wall: '#222222',
                    ambient: '#000000',
                    fog: '#222244'
                };
            default:
                return {
                    floor: '#44aa44',
                    wall: '#aa8866',
                    ambient: '#a0d8ff',
                    fog: '#c4e0ff'
                };
        }
    };

    const colors = getEnvironmentColors();

    // Clouds for certain themes
    const showClouds = theme === EnvironmentTheme.GRASS || theme === EnvironmentTheme.DESERT;
    const showStars = theme === EnvironmentTheme.SPACE || theme === EnvironmentTheme.NEON;

    // Animation for moving clouds or stars
    const skyElementsRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (skyElementsRef.current) {
            if (showClouds) {
                skyElementsRef.current.rotation.y += delta * 0.01;
            } else if (showStars) {
                skyElementsRef.current.rotation.y += delta * 0.002;
            }
        }
    });

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={theme === EnvironmentTheme.SPACE ? 0.1 : 0.4} color={colors.ambient} />

            {theme !== EnvironmentTheme.SPACE && (
                <directionalLight
                    position={[10, 10, 10]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                />
            )}

            {theme === EnvironmentTheme.NEON && (
                <>
                    <pointLight position={[5, 5, 0]} intensity={0.8} color="#ff00ff" />
                    <pointLight position={[-5, 5, 0]} intensity={0.8} color="#00ffff" />
                    <pointLight position={[0, 5, 5]} intensity={0.8} color="#ffff00" />
                </>
            )}

            {/* Floor */}
            <Plane
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
                args={[floorSize, floorSize, 32, 32]}
                receiveShadow
            >
                <meshStandardMaterial
                    color={colors.floor}
                    roughness={theme === EnvironmentTheme.NEON ? 0.2 : 0.8}
                    metalness={theme === EnvironmentTheme.NEON ? 0.5 : 0.1}
                    emissive={theme === EnvironmentTheme.NEON ? colors.floor : undefined}
                    emissiveIntensity={theme === EnvironmentTheme.NEON ? 0.2 : 0}
                />
            </Plane>

            {/* Walls */}
            {withWalls && (
                <Walls
                    floorSize={floorSize}
                    wallHeight={wallHeight}
                    wallColor={colors.wall}
                    theme={theme}
                />
            )}

            {/* Sky elements */}
            <group ref={skyElementsRef}>
                {/* Clouds for grass and desert themes */}
                {showClouds && (
                    <>
                        <Cloud position={[-10, 15, -10]} speed={0.2} opacity={0.5} />
                        <Cloud position={[10, 12, -15]} speed={0.1} opacity={0.4} />
                        <Cloud position={[0, 10, 10]} speed={0.3} opacity={0.6} />
                    </>
                )}

                {/* Stars for space theme */}
                {showStars && (
                    <Stars
                        radius={50}
                        depth={50}
                        count={theme === EnvironmentTheme.SPACE ? 5000 : 2000}
                        factor={4}
                        saturation={theme === EnvironmentTheme.NEON ? 1 : 0}
                    />
                )}
            </group>

            {/* Sky background for non-space themes */}
            {theme !== EnvironmentTheme.SPACE && theme !== EnvironmentTheme.NEON && (
                <Sky
                    distance={450000}
                    sunPosition={[1, 0.5, 1]}
                    inclination={0.5}
                    azimuth={0.25}
                    rayleigh={theme === EnvironmentTheme.SNOW ? 0.1 : 1}
                />
            )}

            {/* Fog */}
            <fog attach="fog" args={[
                colors.fog,
                theme === EnvironmentTheme.SPACE ? 10 : 20,
                theme === EnvironmentTheme.SPACE ? 30 : 50
            ]} />
        </>
    );
};

// Helper component for walls
interface WallsProps {
    floorSize: number;
    wallHeight: number;
    wallColor: string;
    theme: EnvironmentTheme;
}

const Walls: React.FC<WallsProps> = ({ floorSize, wallHeight, wallColor, theme }) => {
    const wallThickness = 0.5;
    const halfFloor = floorSize / 2;

    // Neon glow for neon theme
    const neonEffect = theme === EnvironmentTheme.NEON;

    return (
        <group>
            {/* North wall */}
            <Box
                position={[0, wallHeight / 2, -halfFloor - wallThickness / 2]}
                args={[floorSize + wallThickness * 2, wallHeight, wallThickness]}
                castShadow
                receiveShadow
            >
                <meshStandardMaterial
                    color={wallColor}
                    roughness={neonEffect ? 0.2 : 0.7}
                    metalness={neonEffect ? 0.5 : 0.1}
                    emissive={neonEffect ? "#0044ff" : undefined}
                    emissiveIntensity={neonEffect ? 0.5 : 0}
                />
            </Box>

            {/* South wall */}
            <Box
                position={[0, wallHeight / 2, halfFloor + wallThickness / 2]}
                args={[floorSize + wallThickness * 2, wallHeight, wallThickness]}
                castShadow
                receiveShadow
            >
                <meshStandardMaterial
                    color={wallColor}
                    roughness={neonEffect ? 0.2 : 0.7}
                    metalness={neonEffect ? 0.5 : 0.1}
                    emissive={neonEffect ? "#ff4400" : undefined}
                    emissiveIntensity={neonEffect ? 0.5 : 0}
                />
            </Box>

            {/* East wall */}
            <Box
                position={[halfFloor + wallThickness / 2, wallHeight / 2, 0]}
                args={[wallThickness, wallHeight, floorSize]}
                castShadow
                receiveShadow
            >
                <meshStandardMaterial
                    color={wallColor}
                    roughness={neonEffect ? 0.2 : 0.7}
                    metalness={neonEffect ? 0.5 : 0.1}
                    emissive={neonEffect ? "#00ff44" : undefined}
                    emissiveIntensity={neonEffect ? 0.5 : 0}
                />
            </Box>

            {/* West wall */}
            <Box
                position={[-halfFloor - wallThickness / 2, wallHeight / 2, 0]}
                args={[wallThickness, wallHeight, floorSize]}
                castShadow
                receiveShadow
            >
                <meshStandardMaterial
                    color={wallColor}
                    roughness={neonEffect ? 0.2 : 0.7}
                    metalness={neonEffect ? 0.5 : 0.1}
                    emissive={neonEffect ? "#ff00ff" : undefined}
                    emissiveIntensity={neonEffect ? 0.5 : 0}
                />
            </Box>
        </group>
    );
};

export default GameEnvironment; 