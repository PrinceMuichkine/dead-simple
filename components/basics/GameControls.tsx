import { useState, useEffect, useRef } from 'react';
import { Platform, Dimensions, GestureResponderEvent } from 'react-native';
import { useFrame } from '@react-three/fiber';

// Define constants locally since the import path is invalid
const SENSITIVITY = 0.12;

// Jump physics constants
const JUMP_FORCE = 14; // Initial upward force
const GRAVITY = 25; // Downward force over time
const MAX_JUMP_HEIGHT = 3; // Maximum jump height in units
const JUMP_DURATION = 0.5; // Approximate time to reach max height in seconds

// Game controls hook for handling keyboard & touch input
export const useGameControls = () => {
    const [isMoving, setIsMoving] = useState(false);
    const [direction, setDirection] = useState({ x: 0, z: 0 });
    const [isJumping, setIsJumping] = useState(false);
    const jumpStartTime = useRef(0);
    const jumpHeight = useRef(0);

    // Handle on-screen touch controls
    const handleTouchStart = (e: GestureResponderEvent) => {
        setIsMoving(true);
    };

    const handleTouchMove = (e: GestureResponderEvent) => {
        if (!isMoving) return;

        const { width, height } = Dimensions.get('window');
        const centerX = width / 2;
        const centerY = height / 2;

        // Calculate direction based on touch position relative to center
        // of the bottom half of the screen
        const touchX = e.nativeEvent.pageX;
        const touchY = e.nativeEvent.pageY;

        // Only use touches in the bottom half of the screen for movement
        if (touchY < height / 2) return;

        const deltaX = (touchX - centerX) / (width / 2) * SENSITIVITY;
        const deltaZ = (touchY - centerY) / (height / 2) * SENSITIVITY;

        setDirection({
            x: Math.max(-1, Math.min(1, deltaX)),
            z: Math.max(-1, Math.min(1, deltaZ))
        });
    };

    const handleTouchEnd = () => {
        setIsMoving(false);
        setDirection({ x: 0, z: 0 });
    };

    // Trigger jump action
    const jump = () => {
        if (isJumping) return;

        setIsJumping(true);
        jumpStartTime.current = Date.now();
        jumpHeight.current = 0;
    };

    // Update jump state
    const updateJump = () => {
        if (!isJumping) return 0;

        const currentTime = Date.now();
        const jumpTime = (currentTime - jumpStartTime.current) / 1000; // Convert to seconds

        if (jumpTime >= JUMP_DURATION * 2) {
            // Jump completed
            setIsJumping(false);
            jumpHeight.current = 0;
            return 0;
        }

        // Simple physics for jump arc
        // Moving up for first half of jump duration, down for second half
        if (jumpTime < JUMP_DURATION) {
            // Rising phase
            const progress = jumpTime / JUMP_DURATION;
            jumpHeight.current = MAX_JUMP_HEIGHT * Math.sin(progress * (Math.PI / 2));
        } else {
            // Falling phase
            const fallProgress = (jumpTime - JUMP_DURATION) / JUMP_DURATION;
            jumpHeight.current = MAX_JUMP_HEIGHT * Math.cos(fallProgress * (Math.PI / 2));
        }

        return jumpHeight.current;
    };

    return {
        isMoving,
        direction,
        isJumping,
        jump,
        updateJump,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd
    };
};

// Game controls hook for pausing functionality
export const useGamePause = () => {
    const [isPaused, setIsPaused] = useState(false);

    const togglePause = () => {
        setIsPaused(prev => !prev);
    };

    // Handle pause with escape key on web
    useEffect(() => {
        if (Platform.OS !== 'web') return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                togglePause();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return { isPaused, togglePause };
};

export const useGameTimer = (startPaused = false) => {
    const [isPaused, setIsPaused] = useState(startPaused);
    const [totalTime, setTotalTime] = useState(0);
    const lastUpdate = useRef(Date.now());

    useFrame(() => {
        if (!isPaused) {
            const now = Date.now();
            const delta = (now - lastUpdate.current) / 1000;
            setTotalTime(prev => prev + delta);
            lastUpdate.current = now;
        }
    });

    const pauseTimer = () => setIsPaused(true);
    const resumeTimer = () => {
        lastUpdate.current = Date.now();
        setIsPaused(false);
    };
    const resetTimer = () => {
        setTotalTime(0);
        lastUpdate.current = Date.now();
    };

    return {
        totalTime,
        isPaused,
        pauseTimer,
        resumeTimer,
        resetTimer,
        toggleTimer: () => {
            if (isPaused) {
                resumeTimer();
            } else {
                pauseTimer();
            }
        }
    };
};

// Format time as MM:SS or HH:MM:SS
export const formatTime = (seconds: number, includeHours = false) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (includeHours || hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Hook for handling keyboard controls
export interface KeyboardControls {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    space: boolean;
    shift: boolean;
    ctrl: boolean;
}

export const useKeyboardControls = () => {
    const [controls, setControls] = useState<KeyboardControls>({
        up: false,
        down: false,
        left: false,
        right: false,
        space: false,
        shift: false,
        ctrl: false
    });

    useEffect(() => {
        if (Platform.OS !== 'web') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp' || e.key === 'w') {
                setControls(prev => ({ ...prev, up: true }));
            } else if (e.key === 'ArrowDown' || e.key === 's') {
                setControls(prev => ({ ...prev, down: true }));
            } else if (e.key === 'ArrowLeft' || e.key === 'a') {
                setControls(prev => ({ ...prev, left: true }));
            } else if (e.key === 'ArrowRight' || e.key === 'd') {
                setControls(prev => ({ ...prev, right: true }));
            } else if (e.key === ' ') {
                setControls(prev => ({ ...prev, space: true }));
            } else if (e.key === 'Shift') {
                setControls(prev => ({ ...prev, shift: true }));
            } else if (e.key === 'Control') {
                setControls(prev => ({ ...prev, ctrl: true }));
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp' || e.key === 'w') {
                setControls(prev => ({ ...prev, up: false }));
            } else if (e.key === 'ArrowDown' || e.key === 's') {
                setControls(prev => ({ ...prev, down: false }));
            } else if (e.key === 'ArrowLeft' || e.key === 'a') {
                setControls(prev => ({ ...prev, left: false }));
            } else if (e.key === 'ArrowRight' || e.key === 'd') {
                setControls(prev => ({ ...prev, right: false }));
            } else if (e.key === ' ') {
                setControls(prev => ({ ...prev, space: false }));
            } else if (e.key === 'Shift') {
                setControls(prev => ({ ...prev, shift: false }));
            } else if (e.key === 'Control') {
                setControls(prev => ({ ...prev, ctrl: false }));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return controls;
};

// Hook for handling touch controls (for mobile)
export const useTouchControls = () => {
    const [touchPosition, setTouchPosition] = useState<{ x: number, y: number } | null>(null);
    const [touchActive, setTouchActive] = useState(false);

    // Calculate a normalized direction vector from the center of the screen
    const direction = touchPosition ? {
        x: Math.max(-1, Math.min(1, touchPosition.x * 2)),
        y: Math.max(-1, Math.min(1, touchPosition.y * 2))
    } : { x: 0, y: 0 };

    return {
        touchActive,
        touchPosition,
        direction,
        setTouchPosition,
        setTouchActive
    };
};

export default {
    useGameControls,
    useGamePause,
    useGameTimer,
    formatTime,
    useKeyboardControls,
    useTouchControls
}; 