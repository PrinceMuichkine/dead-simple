import React from 'react';
import * as THREE from 'three';
import { ExpoWebGLRenderingContext } from 'expo-gl';

// Define constants locally since the import path is invalid
const ROPE_HEIGHT = 1.5;

export const setupScene = (
    gl: ExpoWebGLRenderingContext,
    sceneRef: React.MutableRefObject<THREE.Scene | null>,
    cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>,
    rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>,
    colorScheme: string
): THREE.Scene => {
    // Create renderer
    const renderer = new THREE.WebGLRenderer({
        context: gl,
        antialias: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x000000, 1.0);

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.Fog(0x000000, 5, 15);

    // Create camera
    const camera = new THREE.PerspectiveCamera(
        75,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000
    );
    camera.position.set(0, 8, 10);
    camera.lookAt(0, ROPE_HEIGHT, -15);
    cameraRef.current = camera;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 5, 3);
    scene.add(directionalLight);

    return scene;
};

export default setupScene; 