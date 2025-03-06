import React from 'react';
import * as THREE from 'three';

// Define constants locally since the import path is invalid
const PLAYER_SIZE = 0.5;
const ROPE_HEIGHT = 1.5;
const BLOCK_SIZE = 0.8;

export const createPlayer = (
    scene: THREE.Scene,
    playerRef: React.MutableRefObject<THREE.Mesh | null>
): void => {
    // Create the player (ball) with a more distinctive appearance
    const geometry = new THREE.SphereGeometry(PLAYER_SIZE, 32, 32);

    // Use a glowing material for better visibility
    const material = new THREE.MeshPhongMaterial({
        color: 0x00ff00, // Bright green for better visibility
        emissive: 0x00ff00, // Strong glow
        emissiveIntensity: 0.8, // Increased glow
        shininess: 100,
        specular: 0xffffff
    });

    const player = new THREE.Mesh(geometry, material);
    player.position.set(0, ROPE_HEIGHT + PLAYER_SIZE / 2, 0);
    player.castShadow = true;
    player.receiveShadow = true;

    scene.add(player);
    playerRef.current = player;

    // Add a trail effect for the player
    addPlayerTrail(scene, player);
};

// Add a trail effect to make player movement more visible
const addPlayerTrail = (scene: THREE.Scene, player: THREE.Mesh): void => {
    // Create a trail of smaller spheres
    for (let i = 0; i < 5; i++) {
        const trailSize = (PLAYER_SIZE / 2) * (0.8 - i * 0.15);
        const trailGeometry = new THREE.SphereGeometry(trailSize, 16, 16);
        const trailMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.5 - i * 0.1
        });

        const trailSphere = new THREE.Mesh(trailGeometry, trailMaterial);
        trailSphere.position.copy(player.position);
        trailSphere.userData = { isTrail: true, index: i };
        scene.add(trailSphere);
    }
};

// Update the trail position based on player's position
const updatePlayerTrail = (scene: THREE.Scene, player: THREE.Mesh): void => {
    // Find all trail parts
    scene.children.forEach(child => {
        if (child.userData && child.userData.isTrail) {
            const index = child.userData.index;
            // Position with lag based on index
            const targetPos = player.position.clone();
            targetPos.x -= player.position.x * (index * 0.2);
            targetPos.y -= index * 0.1;
            targetPos.z += index * 0.1;

            // Smooth movement toward target
            child.position.lerp(targetPos, 0.3);
        }
    });
};

export const updatePlayerPosition = (
    playerRef: React.MutableRefObject<THREE.Mesh | null>,
    position: {
        x: number,
        z: number,
        jumping: boolean,
        jumpVelocity: number,
        jumpHeight: number
    },
    trackWidth: number,
    trackLength: number,
    deltaTime: number
): void => {
    if (!playerRef.current) return;

    const player = playerRef.current;
    const scene = player.parent;

    // Keep the player within the track bounds
    const maxX = trackWidth / 2 - PLAYER_SIZE / 2;
    const maxZ = trackLength / 2 - PLAYER_SIZE / 2;

    // Calculate base height (with jump)
    const baseHeight = ROPE_HEIGHT + PLAYER_SIZE / 2;

    // HORIZONTAL MOVEMENT (X-AXIS)
    const targetX = position.x * maxX;
    player.position.x = targetX;

    // FORWARD/BACKWARD MOVEMENT (Z-AXIS)
    const targetZ = position.z * maxZ;
    player.position.z = targetZ;

    // JUMPING MOTION (Y-AXIS) - replace falling with jumping
    if (position.jumping) {
        // Apply jump height
        player.position.y = baseHeight + position.jumpHeight;

        // Add spin during jump
        player.rotation.x += 0.1 * deltaTime;
        player.rotation.z += 0.1 * deltaTime;
    } else {
        // Return to base height if not jumping
        player.position.y = baseHeight;
    }

    // Add dynamic rotation based on movement
    if (Math.abs(position.x) > 0.1) {
        player.rotation.z -= position.x * 0.1 * deltaTime; // Roll based on left/right movement
    }

    if (Math.abs(position.z) > 0.1) {
        player.rotation.x += position.z * 0.1 * deltaTime; // Pitch based on forward/backward movement
    }

    // Always add some rotation for visual feedback
    player.rotation.y += 0.02 * deltaTime;

    // Update the trail effect
    if (scene) {
        updatePlayerTrail(scene as THREE.Scene, player);
    }
};

export const checkPlayerCollision = (
    playerRef: React.MutableRefObject<THREE.Mesh | null>,
    blocks: THREE.Mesh[]
): boolean => {
    if (!playerRef.current) return false;

    const playerPosition = playerRef.current.position;
    const playerRadius = PLAYER_SIZE / 2;

    for (const block of blocks) {
        if (!block) continue;

        const blockPosition = block.position;
        const distance = new THREE.Vector3()
            .subVectors(playerPosition, blockPosition)
            .length();

        // Use a more accurate collision detection with a larger hit area
        if (distance < playerRadius + BLOCK_SIZE / 1.5) {
            return true;
        }
    }

    return false;
};

export default createPlayer; 