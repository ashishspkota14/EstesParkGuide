import { Platform, Linking, Alert } from 'react-native';

interface NavigationOptions {
  latitude: number;
  longitude: number;
  trailName: string;
}

/**
 * Opens navigation to trailhead in user's preferred map app
 */
export const openExternalNavigation = async ({
  latitude,
  longitude,
  trailName,
}: NavigationOptions): Promise<void> => {
  const label = encodeURIComponent(trailName);
  
  // Platform-specific deep links
  const googleMapsUrl = Platform.select({
    ios: `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`,
    android: `google.navigation:q=${latitude},${longitude}`,
  });

  const appleMapsUrl = `maps://app?daddr=${latitude},${longitude}&dirflg=d`;
  
  const wazeUrl = `waze://?ll=${latitude},${longitude}&navigate=yes`;
  
  // Web fallbacks
  const googleMapsWeb = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  try {
    if (Platform.OS === 'ios') {
      // Try Apple Maps first (native on iOS)
      const canOpenAppleMaps = await Linking.canOpenURL(appleMapsUrl);
      if (canOpenAppleMaps) {
        await Linking.openURL(appleMapsUrl);
        return;
      }

      // Try Google Maps
      const canOpenGoogleMaps = await Linking.canOpenURL(googleMapsUrl!);
      if (canOpenGoogleMaps) {
        await Linking.openURL(googleMapsUrl!);
        return;
      }

      // Fallback to web
      await Linking.openURL(googleMapsWeb);
    } else {
      // Android: Try Google Maps first
      const canOpenGoogleMaps = await Linking.canOpenURL(googleMapsUrl!);
      if (canOpenGoogleMaps) {
        await Linking.openURL(googleMapsUrl!);
        return;
      }

      // Fallback to web
      await Linking.openURL(googleMapsWeb);
    }
  } catch (error) {
    console.error('Navigation error:', error);
    Alert.alert(
      'Navigation Error',
      'Could not open maps app. Please ensure you have a maps app installed.',
      [{ text: 'OK' }]
    );
  }
};

/**
 * Show navigation confirmation dialog
 */
export const confirmAndNavigate = ({
  latitude,
  longitude,
  trailName,
}: NavigationOptions): void => {
  Alert.alert(
    'Navigate to Trailhead',
    `Open maps to get directions to ${trailName}?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Navigate',
        onPress: () => openExternalNavigation({ latitude, longitude, trailName }),
      },
    ]
  );
};