import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.qssun.reports',
  appName: 'Qssun Reports Beta',
  webDir: 'dist',
  version: '1.0.0-beta',
  android: {
    versionCode: 1
  },
  ios: {
    scheme: 'App'
  },
  cordova: {}
};

export default config;
