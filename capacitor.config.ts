
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.footballteamgenerator',
  appName: 'Football Team Generator',
  webDir: 'dist',
  ios: {
    contentInset: 'always'
  },
  android: {
    backgroundColor: '#ffffff'
  },
  plugins: {
    // Enable local assets to be loaded when offline
    WebView: {
      allowFileAccess: true,
    }
  },
  server: {
    androidScheme: 'https',
    // Enable asset caching
    cleartext: true,
    // Enable local path access
    allowNavigation: ['*']
  }
};

export default config;
