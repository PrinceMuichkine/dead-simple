module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // Optional: for React Native Reanimated
            'react-native-reanimated/plugin',
            // Add module resolver for clean imports
            [
                'module-resolver',
                {
                    root: ['.'],
                    extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
                    alias: {
                        '@': './',
                        'app': './app',
                    },
                },
            ],
        ],
    };
}; 