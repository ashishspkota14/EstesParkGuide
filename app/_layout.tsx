import { Slot } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import Mapbox from '@rnmapbox/maps';
import { useEffect, useState } from 'react';

// Initialize Mapbox outside
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
      <Slot />
    </AuthProvider>
  );
}