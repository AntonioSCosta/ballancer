
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.footballteamgenerator',
  appName: 'Football Team Generator',
  webDir: 'dist',
  server: {
    url: 'https://8be2996c-d1ad-406a-8ae0-192e306792ff.lovableproject.com?forceHideBadge=true',
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
