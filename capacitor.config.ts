
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f17bb7a1677e48f9978857f3494140be',
  appName: 'tilt-parallax-magic',
  webDir: 'dist',
  server: {
    url: 'https://f17bb7a1-677e-48f9-9788-57f3494140be.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Motion: {
      enable: true
    }
  }
};

export default config;
