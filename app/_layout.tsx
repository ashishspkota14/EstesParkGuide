import { Slot } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
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