import { Platform, ImageSourcePropType } from 'react-native';

// Define a specific type for assets
type AssetType = ImageSourcePropType;

/**
 * Utility function to get assets in a way that works across platforms
 * @param name The name of the asset
 * @returns The asset reference or null if not found
 */
export function getAsset(name: string): ImageSourcePropType {
  if (!name) {
    console.warn('Asset name is required');
    return require('@/assets/app.svg');
  }

  // Assets maps for web and native platforms
  // This is a static object with all assets we need in the app
  const assetMap: Record<string, AssetType> = {
    // Use placeholders for missing assets
    'onboarding-1': require('@/assets/app.svg'),
    'onboarding-2': require('@/assets/app.svg'),
    'onboarding-3': require('@/assets/app.svg'),
    'logo': require('@/assets/app.svg'),
    // Add actual assets that exist
    'icon': require('@/assets/app.svg'),
    // Add new assets for the updated UI
    'home-bg': require('@/assets/images/home.webp'),
    'dead-simple-white': require('@/assets/app.svg'),
    'dead-simple-black': require('@/assets/app.svg'),
    'dead-simple-app': require('@/assets/app.svg'),
  };

  // Get the asset from the map
  const asset = assetMap[name];
  
  if (!asset) {
    console.warn(`Asset '${name}' not found`);
    return assetMap['dead-simple-app']; // Return default asset as fallback
  }
  
  return asset;
} 