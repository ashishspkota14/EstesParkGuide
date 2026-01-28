import { Slot } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import Mapbox from '@rnmapbox/maps';

export default function RootLayout() {
  Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || '');
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}


// import { Stack } from 'expo-router';

// export default function RootLayout() {
//   return <Stack />;
// }