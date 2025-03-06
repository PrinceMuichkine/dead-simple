# JUMBO

A modern marketplace platform designed to connect merchants and customers with a focus on simplicity, speed, and seamless onboarding.

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- Supabase

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/princemuichkien/dead-simple.git
   cd dead-simple
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Copy `.env.example` to `.env` and update with your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   bun expo start
   ```

5. Follow the instructions in the terminal to open the app on your device or emulator.

## Features

- Phone number authentication with OTP verification
- Social authentication (Google, Apple)
- Dark mode support
- Merchant and customer dashboards
- Product management
- Order processing
- Secure payments

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Ball Roller Game with React Three Fiber

A 3D ball rolling game built with React Native, Expo, and React Three Fiber.

## Features

- 3D ball rolling physics
- React Three Fiber for 3D rendering
- Mobile touch controls and keyboard controls
- Score tracking
- Game state management
- Beautiful 3D environment

## Running the Game

1. Start the Expo development server:
   ```
   npx expo start
   ```

2. Navigate to `/game-test` to play the ball roller game.

## Technology Stack

### React Three Fiber

This game uses React Three Fiber, a React renderer for Three.js that provides a more ergonomic way to build 3D graphics with React's component model. This makes it perfect for mobile game development.

### Expo

The game is built with Expo, which provides a framework for React Native that makes it easy to build, deploy, and iterate on mobile apps.

## Publishing to App Stores

To publish this game to the App Store (iOS) and Google Play Store:

### 1. Prepare your app

```bash
npx expo prebuild
```

### 2. iOS (App Store)

1. Build for iOS:
   ```bash
   npx expo build:ios
   ```

2. Follow the Expo documentation to submit to the App Store:
   https://docs.expo.dev/distribution/app-stores/

### 3. Android (Google Play)

1. Build for Android:
   ```bash
   npx expo build:android
   ```

2. Follow the Expo documentation to submit to Google Play:
   https://docs.expo.dev/distribution/app-stores/

## Game Development with React Native

React Native with React Three Fiber is a great choice for mobile game development when:

1. You want to leverage React and JavaScript/TypeScript knowledge
2. You need cross-platform (iOS and Android) support
3. You're building games with 3D graphics that don't require AAA performance
4. You want to use a familiar component-based architecture

For more complex games, consider dedicated game engines like Unity or Unreal Engine.

## Future Improvements

- Add game levels
- Implement obstacles and collectibles
- Add sound effects and music
- Implement local high score leaderboard

## License

MIT

# Just A Game

A collection of 3D mobile-first games built with React Native, Expo, and React Three Fiber.

## Games Included

### Enhanced Ball Roller

An improved version of the ball roller game with advanced physics, particle effects, obstacles, and multiple environment themes. Features include:

- Realistic ball physics with rotation and momentum
- Dynamic obstacles that move around the playing field
- Collectible items that award points
- Multiple environment themes that change as you level up
- Particle effects for trails, collisions, and item collection
- Support for both tilt (accelerometer) and keyboard controls

### Ball Roller (Original)

The original implementation of the ball rolling game.

### Rope Dodger

Dodge moving ropes and obstacles in this challenging game.

## Technical Features

- Built with React Native and Expo for cross-platform compatibility
- 3D rendering with React Three Fiber
- Reusable game components:
  - GamePhysics: Physics system for game objects
  - ObstaclesManager: System for creating and managing obstacles
  - GameEnvironment: Customizable game environments with different themes
  - ParticleEffects: Particle system for visual effects
  - GameControls: Input handling for keyboard, touch, and motion controls

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the Expo development server:
   ```
   npx expo start
   ```
4. Run on your desired platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan the QR code with Expo Go app on your mobile device

## Controls

### Mobile (Tilt Controls)
- Tilt your device to move the ball
- Tap the "Use Keyboard" button when testing on a computer

### Desktop/Web (Keyboard Controls)
- WASD or Arrow Keys to move the ball
- Spacebar to jump
- P to pause the game

## Publishing to App Stores

The game can be built for app stores using Expo's build service:

1. Configure app.json with your app details
2. Run `eas build` to create native builds
3. Submit to app stores through the EAS dashboard

## License

MIT 