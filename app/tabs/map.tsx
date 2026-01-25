import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { mapStyles } from '../../src/styles/screens/map.styles';
import { COLORS } from '../../src/constants/colors';
import TrailMapMarkers from '../../src/components/location/TrailMapMarkers';
import MapControls from '../../src/components/location/MapControls';
import { Trail } from '../../src/types/trail.types';
import { MapStyleType } from '../../src/types/map.types';

// Set Mapbox access token
Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '');

export default function MapScreen() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapStyle, setMapStyle] = useState<MapStyleType>('outdoors');

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchTrails();
  }, []);

  const fetchTrails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/trails`);
      const data = await response.json();
      
      if (data.success) {
        const realTrails = data.data.filter(
          (trail: Trail) => trail.slug !== 'test-trail' && trail.slug !== 'test-trail-2'
        );
        setTrails(realTrails);
      }
    } catch (err) {
      console.error('Error fetching trails:', err);
      Alert.alert('Error', 'Failed to load trail locations');
    } finally {
      setLoading(false);
    }
  };

  const toggleMapStyle = () => {
    setMapStyle(prev => prev === 'outdoors' ? 'satellite' : 'outdoors');
  };

  const getMapStyleURL = () => {
    return mapStyle === 'outdoors'
      ? 'mapbox://styles/mapbox/outdoors-v12'
      : 'mapbox://styles/mapbox/satellite-streets-v12';
  };

  if (loading) {
    return (
      <View style={mapStyles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={mapStyles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={mapStyles.container}>
      <Mapbox.MapView
        style={mapStyles.map}
        styleURL={getMapStyleURL()}
      >
        <Mapbox.Camera
          zoomLevel={11}
          centerCoordinate={[-105.5217, 40.3772]} // Estes Park center
          animationMode="flyTo"
          animationDuration={2000}
        />

        {/* Trail Markers */}
        <TrailMapMarkers trails={trails} />

        {/* User Location */}
        <Mapbox.LocationPuck
          visible={true}
          pulsing={{ isEnabled: true }}
        />
      </Mapbox.MapView>

      {/* Map Controls */}
      <MapControls
        mapStyle={mapStyle}
        onToggleStyle={toggleMapStyle}
      />

      {/* Header */}
      <View style={mapStyles.header}>
        <Text style={mapStyles.headerTitle}>🗺️ Trail Map</Text>
        <Text style={mapStyles.headerSubtitle}>{trails.length} trails</Text>
      </View>
    </View>
  );
}