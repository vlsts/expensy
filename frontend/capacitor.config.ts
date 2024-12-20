import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ro.expensy',
  appName: 'Expensy',
  webDir: 'build',
  android: {
    path: "../android"
  }
};

export default config;
