import * as THREE from 'three';
import { JSX } from 'react';

// Accelerometer data interface
export interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

// 3D Game Block interface
export interface Block {
  id?: number;
  position?: { x: number; y: number; z: number };
  mesh: THREE.Mesh;
  direction: number;
  active: boolean;
}

// Game state interface
export interface GameState {
  gameStarted: boolean;
  gameOver: boolean;
  isPaused: boolean;
  score: number;
  bestScore: number;
}

// Burst state interface
export interface BurstState {
  active: boolean;
  blocksDropped: number;
  blocksInBurst: number;
  pauseFrames: number;
}

// Game component props interfaces
export interface GameProps {
  children?: JSX.Element | JSX.Element[];
  onExit?: () => void;
  onSwitchGame?: () => void;
}

// Player props
export interface PlayerProps {
  position: {
    x: number;
    y: number;
    z: number;
  };
  size: number;
}

// Scene objects/elements props
export interface SceneProps {
  colorScheme: string;
} 