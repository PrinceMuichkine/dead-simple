import React from 'react';
import { Platform } from 'react-native';
import WebFallback from './WebFallback';

// For web, we'll use our fallback. For native, we'll import the actual game.
let GameComponent: any = WebFallback;

// Only import the game on the client side and only for native platforms
if (typeof window !== 'undefined' && Platform.OS !== 'web') {
    // This import happens at runtime, not during SSR
    import('./EnhancedBallRoller').then(module => {
        GameComponent = module.default;
    });
}

// Create a component that chooses the right implementation
function GameWrapper(props: any) {
    // Always use WebFallback on web
    if (Platform.OS === 'web') {
        return <WebFallback {...props} />;
    }

    // Use the dynamically loaded component for native
    return <GameComponent {...props} />;
}

// Export for named imports
export { GameWrapper as EnhancedBallRoller };

// Export for default import
export default GameWrapper; 