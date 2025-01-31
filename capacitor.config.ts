import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.footballteamgenerator',
  appName: 'Football Team Generator',
  webDir: 'dist',
  server: {
    url: 'http://localhost:5173',
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  },
  android: {
    backgroundColor: '#ffffff'
  }
};

export default config;