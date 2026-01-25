import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { COLORS } from '../src/constants/colors';

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Always show welcome screen on app start
      // User can choose to login or skip
      router.replace('/(auth)/welcome');
    }
  }, [loading]);

  // Show loading while checking auth
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}




// import { Redirect } from "expo-router";

// export default function RootIndex() {
//   return <Redirect href="/tabs" />;
// }



