const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Tell Metro to use the "react-native" conditional export when resolving packages.
// This makes firebase/auth resolve to @firebase/auth's React Native bundle,
// which correctly handles AsyncStorage persistence (fixes java.lang.String cast error).
config.resolver.unstable_conditionNames = [
  'react-native',
  'require',
  'default',
];

module.exports = config;
