import React from 'react';
import * as THREE from 'three';

// Define constants locally since the import path is invalid
const TRACK_WIDTH = 5;
const TRACK_LENGTH = 20;
const ROPE_HEIGHT = 1.5;

export const createEnvironment = (
    scene: THREE.Scene,
    trackRef: React.MutableRefObject<THREE.Group | null>,
    colorScheme: string
): void => {
    // Create the track group
    const trackGroup = new THREE.Group();
    trackRef.current = trackGroup;
    scene.add(trackGroup);

    // Create floor
    const floorGeometry = new THREE.BoxGeometry(TRACK_WIDTH, 0.1, TRACK_LENGTH);
    const floorMaterial = new THREE.MeshPhongMaterial({
        color: colorScheme === 'dark' ? 0x222222 : 0x444444,
        shininess: 50
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    trackGroup.add(floor);

    // Create rope
    const ropeGeometry = new THREE.CylinderGeometry(0.05, 0.05, TRACK_LENGTH, 8);
    const ropeMaterial = new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        shininess: 30
    });
    const rope = new THREE.Mesh(ropeGeometry, ropeMaterial);
    rope.rotation.x = Math.PI / 2;
    rope.position.y = ROPE_HEIGHT;
    trackGroup.add(rope);

    // Add rope supports
    addRopeSupports(trackGroup);

    // Add environment pillars
    addEnvironmentPillars(scene, colorScheme);
};

// Helper function to add rope supports
const addRopeSupports = (trackGroup: THREE.Group): void => {
    for (let i = 0; i < 5; i++) {
        const supportGeometry = new THREE.CylinderGeometry(0.03, 0.03, ROPE_HEIGHT, 8);
        const supportMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
        const support = new THREE.Mesh(supportGeometry, supportMaterial);
        support.position.set(0, ROPE_HEIGHT / 2, -TRACK_LENGTH / 2 + i * (TRACK_LENGTH / 4));
        trackGroup.add(support);
    }
};

// Helper function to add environment pillars
const addEnvironmentPillars = (scene: THREE.Scene, colorScheme: string): void => {
    for (let i = 0; i < 8; i++) {
        const pillarGeometry = new THREE.BoxGeometry(0.2, 3, 0.2);
        const pillarMaterial = new THREE.MeshPhongMaterial({
            color: colorScheme === 'dark' ? 0x333333 : 0x777777
        });

        // Left side pillar
        const leftPillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
        leftPillar.position.set(-TRACK_WIDTH / 2 - 1, 1, -TRACK_LENGTH / 2 + i * (TRACK_LENGTH / 7));
        scene.add(leftPillar);

        // Right side pillar
        const rightPillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
        rightPillar.position.set(TRACK_WIDTH / 2 + 1, 1, -TRACK_LENGTH / 2 + i * (TRACK_LENGTH / 7));
        scene.add(rightPillar);
    }
};

export default createEnvironment; 