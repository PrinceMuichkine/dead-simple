import * as THREE from 'three';

// Create explosion effect when player collides with a block
export const createExplosion = (
    scene: THREE.Scene,
    position: THREE.Vector3,
    colorScheme: string
): THREE.Group => {
    const particleCount = 30;
    const explosionGroup = new THREE.Group();
    const particleSize = 0.1;

    // Set explosion position
    explosionGroup.position.copy(position);

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(particleSize, 8, 8);

        // Create the particle material with a bright color
        const material = new THREE.MeshBasicMaterial({
            color: colorScheme === 'dark' ? 0xff7700 : 0xff5500,
            transparent: true,
            opacity: 0.8
        });

        // Create the particle mesh
        const particle = new THREE.Mesh(geometry, material);

        // Set random direction for particle
        particle.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2
            ),
            rotationSpeed: {
                x: Math.random() * 0.1,
                y: Math.random() * 0.1,
                z: Math.random() * 0.1
            }
        };

        explosionGroup.add(particle);
    }

    // Add to scene
    scene.add(explosionGroup);

    return explosionGroup;
};

// Update explosion particles
export const updateExplosion = (
    explosionGroup: THREE.Group,
    deltaTime: number,
    lifetime: number
): boolean => {
    // Reduce opacity over time
    const lifeProgress = Math.min(1, lifetime / 1000);
    const opacity = 1 - lifeProgress;

    // Update each particle in the explosion
    explosionGroup.children.forEach((child: THREE.Object3D) => {
        const particle = child as THREE.Mesh;
        const userData = particle.userData;

        // Move particle based on velocity
        particle.position.x += userData.velocity.x * deltaTime;
        particle.position.y += userData.velocity.y * deltaTime;
        particle.position.z += userData.velocity.z * deltaTime;

        // Add gravity effect
        userData.velocity.y -= 0.001 * deltaTime;

        // Rotate particle
        particle.rotation.x += userData.rotationSpeed.x * deltaTime;
        particle.rotation.y += userData.rotationSpeed.y * deltaTime;
        particle.rotation.z += userData.rotationSpeed.z * deltaTime;

        // Update opacity
        if (particle.material instanceof THREE.MeshBasicMaterial) {
            particle.material.opacity = opacity;
        }
    });

    // Return true if explosion should be removed
    return lifetime >= 1000;
};

// Remove explosion from scene and dispose resources
export const removeExplosion = (
    scene: THREE.Scene,
    explosionGroup: THREE.Group
): void => {
    // Dispose geometry and materials for each particle
    explosionGroup.children.forEach((child: THREE.Object3D) => {
        const mesh = child as THREE.Mesh;

        if (mesh.geometry) {
            mesh.geometry.dispose();
        }

        if (mesh.material) {
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach(material => material.dispose());
            } else {
                mesh.material.dispose();
            }
        }
    });

    // Remove from scene
    scene.remove(explosionGroup);
};

export default {
    createExplosion,
    updateExplosion,
    removeExplosion
}; 