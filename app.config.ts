import type { ExpoConfig } from 'expo/config';

const isProduction = process.env.APP_VARIANT === 'production';
const variant = isProduction ? 'production' : 'development';
const projectId = '32fe2931-9fb2-4321-ad00-8482d80732c7';

const config: ExpoConfig = {
  name: isProduction ? 'BockMath' : 'BockMath Dev',
  slug: 'bockmath',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: isProduction ? 'bockmath' : 'bockmath-dev',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: isProduction ? 'com.bsteinbk.bockmath' : 'com.bsteinbk.bockmath.dev',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: isProduction ? 'com.bsteinbk.bockmath' : 'com.bsteinbk.bockmath.dev',
    adaptiveIcon: {
      backgroundColor: '#F8F4E8',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: ['expo-router', 'expo-dev-client', 'expo-system-ui', 'react-native-legal'],
  experiments: {
    typedRoutes: true,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  updates: projectId
    ? {
        url: `https://u.expo.dev/${projectId}`,
        checkAutomatically: 'ON_LOAD',
        fallbackToCacheTimeout: 3000,
      }
    : undefined,
  extra: {
    appVariant: variant,
    eas: projectId ? { projectId } : undefined,
  },
};

export default config;
