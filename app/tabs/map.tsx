import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Mapbox from '@rnmapbox/maps';
import { supabase } from '../../src/services/supabase/client';
import { COLORS } from '../../src/constants/colors';
import { mapStyles } from '../../src/styles/screens/map.styles';
import TrailRouteOverlay from '../../src/components/trail/TrailRouteOverlay';

export default function MapScreen() {
  const params = useLocalSearchParams();
  const [trail, setTrail] = useState<any>(null);
  const [is3DMode, setIs3DMode] = useState(false);
  const [mapStyle, setMapStyle] = useState<string>(Mapbox.StyleURL.Outdoors);
  
  const trailId = params.trailId as string;
  const mode = params.mode as string;

  useEffect(() => {
    if (trailId) {
      fetchTrailData();
    }
  }, [trailId]);

  const fetchTrailData = async () => {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select('*')
        .eq('id', trailId)
        .single();

      if (error) throw error;
      setTrail(data);
    } catch (error) {
      console.error('Error fetching trail:', error);
    }
  };

  const toggle3D = () => {
    setIs3DMode(!is3DMode);
  };

  const toggleMapStyle = () => {
    setMapStyle(prev => 
      prev === Mapbox.StyleURL.Outdoors 
        ? Mapbox.StyleURL.Satellite 
        : Mapbox.StyleURL.Outdoors
    );
  };

  const centerCoords = trail?.start_lat && trail?.start_lng
    ? [trail.start_lng, trail.start_lat]
    : [-105.5217, 40.3772];

  return (
    <View style={mapStyles.container}>
      <Mapbox.MapView
        style={mapStyles.map}
        styleURL={mapStyle}
      >
        <Mapbox.Camera
          zoomLevel={14}
          centerCoordinate={centerCoords}
          pitch={is3DMode ? 60 : 0}
          animationDuration={1000}
        />

        <Mapbox.LocationPuck
          pulsing={{ isEnabled: true }}
          puckBearingEnabled
          puckBearing="heading"
        />

        {trail && <TrailRouteOverlay trail={trail} isNavigating={mode === 'navigate'} />}
      </Mapbox.MapView>

      <TouchableOpacity
        style={mapStyles.button3D}
        onPress={toggle3D}
        activeOpacity={0.8}
      >
        <Ionicons name="cube-outline" size={24} color={is3DMode ? COLORS.primary : '#fff'} />
        <Text style={[mapStyles.buttonText, is3DMode && mapStyles.buttonTextActive]}>
          {is3DMode ? '2D' : '3D'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={mapStyles.buttonLayers}
        onPress={toggleMapStyle}
        activeOpacity={0.8}
      >
        <Ionicons name="layers-outline" size={24} color="#fff" />
      </TouchableOpacity>

      {trail && (
        <View style={mapStyles.trailInfoCard}>
          <View style={mapStyles.trailInfo}>
            <Text style={mapStyles.trailName} numberOfLines={1}>{trail.name}</Text>
            <View style={mapStyles.trailStats}>
              <Text style={mapStyles.trailStat}>
                {trail.distance_miles?.toFixed(1)} mi
              </Text>
              <Text style={mapStyles.trailStatDivider}>•</Text>
              <Text style={mapStyles.trailStat}>
                {trail.elevation_gain_ft?.toLocaleString()} ft gain
              </Text>
              <Text style={mapStyles.trailStatDivider}>•</Text>
              <Text style={mapStyles.trailStat}>
                Est. {Math.round(trail.distance_miles / 2)}h {Math.round((trail.distance_miles / 2 * 60) % 60)}m
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}