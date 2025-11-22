module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@core': './src/core',
            '@data': './src/data',
            '@presentation': './src/presentation',
            '@infrastructure': './src/infrastructure',
            '@shared': './src/shared',
            '@config': './src/config',
          },
        },
      ],
      'react-native-reanimated/plugin', // Must be listed last
    ],
  };
};

