
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
    WebView: {
      allowFileAccess: true,
    }
  },
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: ['*'],
    hostname: 'localhost',
    iosScheme: 'ionic'
  }
};

export default config;
