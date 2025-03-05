import { Platform } from 'react-native';

// Default placeholder images
const placeholderImage = require('../../assets/icon.png');

// Assets maps for web and native platforms
// This is a static object with all assets we need in the app
const assetMap = {
  // Use placeholder for missing images
  'onboarding-1': placeholderImage,
  'onboarding-2': placeholderImage,
  'onboarding-3': placeholderImage,
  'logo': placeholderImage,
  // Add actual assets as they become available
  'icon': require('../../assets/icon.png'),
  'favicon': require('../../assets/favicon.png'),
  'adaptive-icon': require('../../assets/adaptive-icon.png'),
  'splash-icon': require('../../assets/splash-icon.png'),
};

/**
 * Get asset source in a cross-platform compatible way
 * @param name Asset name without path or extension
 * @returns Asset source that can be used in Image component
 */
export function getAsset(name: string) {
  // For all platforms, use the pre-defined map
  if (!assetMap[name as keyof typeof assetMap]) {
    console.warn(`Asset "${name}" not found in assets map, using placeholder`);
    return placeholderImage;
  }
  
  return assetMap[name as keyof typeof assetMap];
} 