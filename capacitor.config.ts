
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8be2996cd1ad406a8ae0192e306792ff',
  appName: 'ballancer',
  webDir: 'dist',
  ios: {
    contentInset: 'always'
  },
  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: true,
    captureInput: true
  },
  plugins: {
    WebView: {
      allowFileAccess: true,
    },
    StatusBar: {
      style: 'dark'
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      spinnerColor: '#999999',
      splashFullScreen: true,
      splashImmersive: true
    }
  },
  server: {
    url: "https://8be2996c-d1ad-406a-8ae0-192e306792ff.lovableproject.com?forceHideBadge=true",
    cleartext: true,
    androidScheme: 'https',
    allowNavigation: ['*'],
    hostname: 'localhost',
    iosScheme: 'ionic'
  }
};

export default config;
