import { Platform } from 'react-native';

// Define a specific type for assets
type AssetType = string | number | { uri: string } | ReturnType<typeof require>;

/**
 * Utility function to get assets in a way that works across platforms
 * @param name The name of the asset
 * @returns The asset reference or null if not found
 */
export function getAsset(name: string) {
  if (!name) {
    console.warn('Asset name is required');
    return null;
  }

  // Assets maps for web and native platforms
  // This is a static object with all assets we need in the app
  const assetMap: Record<string, AssetType> = {
    // Use placeholders for missing assets
    'onboarding-1': require('@/assets/jumbo_app.svg'),
    'onboarding-2': require('@/assets/jumbo_app.svg'),
    'onboarding-3': require('@/assets/jumbo_app.svg'),
    'logo': require('@/assets/jumbo_app.svg'),
    // Add actual assets that exist
    'icon': require('@/assets/jumbo_app.svg'),
    // Add new assets for the updated UI
    'home-bg': require('@/assets/images/home.png'),
    'jumbo-white': require('@/assets/jumbo_white.svg'),
    'jumbo-black': require('@/assets/jumbo_black.svg'),
    'jumbo-app': require('@/assets/jumbo_app.svg'),
  };

  // Get the asset from the map
  const asset = assetMap[name];
  
  if (!asset) {
    console.warn(`Asset '${name}' not found`);
    return assetMap['jumbo-app']; // Return default asset as fallback
  }
  
  return asset;
} 