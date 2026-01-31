import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import Mapbox from '@rnmapbox/maps';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import { UnitsProvider } from '../src/context/UnitsContext';

// Initialize Mapbox outside component
const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
if (MAPBOX_TOKEN) {
  Mapbox.setAccessToken(MAPBOX_TOKEN);
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) return null;

  return (
    <AuthProvider>
      <ThemeProvider>
        <UnitsProvider>
          <StatusBar style="dark" />
          <Slot />
        </UnitsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}