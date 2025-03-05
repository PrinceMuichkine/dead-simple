// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add asset extensions for handling images
config.resolver.assetExts.push("png", "jpg", "jpeg", "gif", "svg", "json");

module.exports = config; 