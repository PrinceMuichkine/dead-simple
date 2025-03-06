import * as THREE from 'three';

// Define constants locally since the import path is invalid
const BLOCK_SIZE = 0.8;
const TRACK_WIDTH = 5;
const TRACK_LENGTH = 14;
const ROPE_HEIGHT = 1.5;
const BLOCK_DIRECTION_LEFT = 0.1;
const BLOCK_DIRECTION_RIGHT = -0.1;

export interface Block {
    mesh: THREE.Mesh;
    direction: number;
    active: boolean;
}

// Create a block at a specific position
export const createBlock = (
    scene: THREE.Scene,
    z: number,
    direction: number = Math.random() > 0.5 ? BLOCK_DIRECTION_LEFT : BLOCK_DIRECTION_RIGHT
): Block => {
    // Create block geometry with a more distinctive shape
    const geometry = new THREE.BoxGeometry(BLOCK_SIZE * 2, BLOCK_SIZE * 2, BLOCK_SIZE * 2);

    // Create a more visually distinctive material
    const material = new THREE.MeshPhongMaterial({
        color: 0xff0000, // Pure red
        emissive: 0xff0000, // Glowing red
        emissiveIntensity: 0.8, // Stronger glow
        shininess: 50,
        transparent: true,
        opacity: 0.9
    });

    // Create the mesh
    const mesh = new THREE.Mesh(geometry, material);

    // Position the block
    // Randomly position blocks across the track width for variety
    const startX = direction !== 0 ?
        (direction === BLOCK_DIRECTION_LEFT ? -TRACK_WIDTH / 2 - BLOCK_SIZE : TRACK_WIDTH / 2 + BLOCK_SIZE) :
        (Math.random() * TRACK_WIDTH - TRACK_WIDTH / 2);

    mesh.position.set(startX, ROPE_HEIGHT, z);
    mesh.castShadow = true;

    // Add visual effects to the block
    addBlockEffects(scene, mesh);

    // Add to scene
    scene.add(mesh);

    // Return the block object
    return {
        mesh,
        direction,
        active: true
    };
};

// Add visual effects to make blocks more distinctive
const addBlockEffects = (scene: THREE.Scene, blockMesh: THREE.Mesh): void => {
    // Add a glowing wireframe overlay
    const wireGeometry = new THREE.BoxGeometry(BLOCK_SIZE * 1.6, BLOCK_SIZE * 1.6, BLOCK_SIZE * 1.6);
    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });

    const wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
    wireframe.position.copy(blockMesh.position);
    wireframe.userData = { isBlockEffect: true, parentId: blockMesh.id };
    scene.add(wireframe);
};

// Update block positions based on speed
export const updateBlocks = (
    blocks: Block[],
    blockSpeed: number,
    removeBlock: (block: Block) => void
): void => {
    blocks.forEach(block => {
        if (!block.active || !block.mesh) return;

        // Move the block based on its direction and speed (increased speed for more noticeable movement)
        const speedMultiplier = 8.0; // Much faster movement for obvious visual feedback

        // Move horizontally if the block has a direction
        if (block.direction !== 0) {
            block.mesh.position.x += block.direction * blockSpeed * speedMultiplier;
        }

        // Always move forward (down the track)
        block.mesh.position.z += blockSpeed * speedMultiplier;

        // Add rotation for better visual feedback
        block.mesh.rotation.x += 0.03;
        block.mesh.rotation.y += 0.03;

        // Update any attached effects
        updateBlockEffects(block.mesh);

        // Check if block is out of bounds
        if (
            block.mesh.position.z > TRACK_LENGTH / 2 ||
            Math.abs(block.mesh.position.x) > TRACK_WIDTH + BLOCK_SIZE
        ) {
            // Mark block for removal
            removeBlock(block);
        }
    });
};

// Update the visual effects attached to blocks
const updateBlockEffects = (blockMesh: THREE.Mesh): void => {
    const scene = blockMesh.parent;
    if (!scene) return;

    // Find and update all effects associated with this block
    scene.children.forEach(child => {
        if (child.userData && child.userData.isBlockEffect && child.userData.parentId === blockMesh.id) {
            // Update position to match parent
            child.position.copy(blockMesh.position);

            // Add unique rotation
            child.rotation.x = -blockMesh.rotation.x * 0.5;
            child.rotation.y = -blockMesh.rotation.y * 0.5;

            // Pulsate size
            const scale = 1.0 + Math.sin(Date.now() * 0.005) * 0.1;
            child.scale.set(scale, scale, scale);
        }
    });
};

// Remove blocks from the scene
export const removeBlockFromScene = (
    scene: THREE.Scene,
    block: Block
): void => {
    if (!block.active || !block.mesh) return;

    // Also remove any effects associated with this block
    scene.children.forEach(child => {
        if (child.userData && child.userData.isBlockEffect && child.userData.parentId === block.mesh.id) {
            scene.remove(child);

            // Cast to Mesh to access geometry and material
            const meshChild = child as THREE.Mesh;
            if (meshChild.geometry) {
                meshChild.geometry.dispose();
            }

            if (meshChild.material) {
                if (Array.isArray(meshChild.material)) {
                    meshChild.material.forEach(mat => mat.dispose());
                } else {
                    meshChild.material.dispose();
                }
            }
        }
    });

    scene.remove(block.mesh);
    block.active = false;

    // Dispose of geometries and materials
    if (block.mesh.geometry) {
        block.mesh.geometry.dispose();
    }

    if (block.mesh.material) {
        if (Array.isArray(block.mesh.material)) {
            block.mesh.material.forEach(material => material.dispose());
        } else {
            block.mesh.material.dispose();
        }
    }
};

export default {
    createBlock,
    updateBlocks,
    removeBlockFromScene
}; 