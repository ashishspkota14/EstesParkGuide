import { useEffect } from 'react';
import { router, useRootNavigationState } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { COLORS } from '../src/constants/colors';

export default function Index() {
  const { loading } = useAuth();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    // Check if navigation is ready AND auth has finished loading
    if (navigationState?.key && !loading) {
      const timeout = setTimeout(() => {
        // Use a relative path to avoid "group" naming conflicts
        router.replace('/welcome'); 
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [loading, navigationState?.key]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS?.background || '#fff' }}>
      <ActivityIndicator size="large" color={COLORS?.primary || '#000'} />
    </View>
  );
}