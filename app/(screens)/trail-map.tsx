import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Mapbox from '@rnmapbox/maps';
import { useEffect } from 'react';
import { supabase } from '../../src/services/supabase/client';
import { COLORS } from '../../src/constants/colors';
import { trailMapStyles } from '../../src/styles/screens/trailMap.styles';

const TRAIL_COLOR = '#8B6F47';

// Map style options
const MAP_STYLES = [
  { id: 'outdoors', label: 'Outdoors', url: Mapbox.StyleURL.Outdoors, icon: 'trail-sign-outline' },
  { id: 'satellite', label: 'Satellite', url: Mapbox.StyleURL.SatelliteStreet, icon: 'earth-outline' },
  { id: 'streets', label: 'Streets', url: Mapbox.StyleURL.Street, icon: 'map-outline' },
];

export default function TrailMapScreen() {
  const router = useRouter();
  const { trailId } = useLocalSearchParams();
  
  const [trail, setTrail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [is3D, setIs3D] = useState(false);
  const [mapStyleIndex, setMapStyleIndex] = useState(0);
  const [showStylePicker, setShowStylePicker] = useState(false);

  useEffect(() => {
    if (trailId) {
      fetchTrail();
    }
  }, [trailId]);

  const fetchTrail = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  // Get trail coordinates
  const routeCoordinates = useMemo(() => {
    if (trail?.route_coordinates?.coordinates) {
      return trail.route_coordinates.coordinates.map((c: number[]) => [c[0], c[1]]);
    }
    return null;
  }, [trail]);

  // Calculate center and bounds of trail
  const { center, bounds } = useMemo(() => {
    if (!routeCoordinates || routeCoordinates.length === 0) {
      return {
        center: [trail?.trailhead_lon || -105.5217, trail?.trailhead_lat || 40.3772],
        bounds: null
      };
    }

    let minLon = Infinity, maxLon = -Infinity;
    let minLat = Infinity, maxLat = -Infinity;

    routeCoordinates.forEach((coord: number[]) => {
      minLon = Math.min(minLon, coord[0]);
      maxLon = Math.max(maxLon, coord[0]);
      minLat = Math.min(minLat, coord[1]);
      maxLat = Math.max(maxLat, coord[1]);
    });

    const centerLon = (minLon + maxLon) / 2;
    const centerLat = (minLat + maxLat) / 2;

    return {
      center: [centerLon, centerLat],
      bounds: { minLon, maxLon, minLat, maxLat }
    };
  }, [routeCoordinates, trail]);

  // Calculate appropriate zoom level
  const zoomLevel = useMemo(() => {
    if (!bounds) return 13;
    
    const lonDiff = bounds.maxLon - bounds.minLon;
    const latDiff = bounds.maxLat - bounds.minLat;
    const maxDiff = Math.max(lonDiff, latDiff);

    if (maxDiff > 0.1) return 11;
    if (maxDiff > 0.05) return 12;
    if (maxDiff > 0.02) return 13;
    if (maxDiff > 0.01) return 14;
    return 14;
  }, [bounds]);

  const handlePreviewTrail = () => {
    router.push({
      pathname: '/(screens)/trail-preview',
      params: { id: trailId }
    });
  };

  const currentMapStyle = MAP_STYLES[mapStyleIndex];

  if (loading) {
    return (
      <View style={trailMapStyles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={trailMapStyles.loadingText}>Loading trail map...</Text>
      </View>
    );
  }

  if (!trail) {
    return (
      <View style={trailMapStyles.loadingContainer}>
        <Text style={trailMapStyles.loadingText}>Trail not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={trailMapStyles.backButtonAlt}>
          <Text style={trailMapStyles.backButtonAltText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={trailMapStyles.container}>
      {/* Full Screen Map - Interactive */}
      <Mapbox.MapView
        style={trailMapStyles.map}
        styleURL={currentMapStyle.url}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
      >
        <Mapbox.Camera
          zoomLevel={zoomLevel}
          centerCoordinate={center}
          pitch={is3D ? 60 : 0}
          animationDuration={500}
        />

        {/* Trail Route Line */}
        {routeCoordinates && routeCoordinates.length > 1 && (
          <Mapbox.ShapeSource
            id="trailRouteFullMap"
            shape={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates,
              },
            }}
          >
            <Mapbox.LineLayer
              id="trailLineFullMap"
              style={{
                lineColor: TRAIL_COLOR,
                lineWidth: 5,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </Mapbox.ShapeSource>
        )}

        {/* Trail Start Marker */}
        {routeCoordinates && routeCoordinates.length > 0 && (
          <Mapbox.ShapeSource
            id="trailStartFullMap"
            shape={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: routeCoordinates[0],
              },
            }}
          >
            <Mapbox.CircleLayer
              id="startCircleOuter"
              style={{
                circleRadius: 10,
                circleColor: '#fff',
              }}
            />
            <Mapbox.CircleLayer
              id="startCircleInner"
              style={{
                circleRadius: 6,
                circleColor: COLORS.primary,
              }}
            />
          </Mapbox.ShapeSource>
        )}

        {/* Trail End Marker */}
        {routeCoordinates && routeCoordinates.length > 1 && (
          <Mapbox.ShapeSource
            id="trailEndFullMap"
            shape={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: routeCoordinates[routeCoordinates.length - 1],
              },
            }}
          >
            <Mapbox.CircleLayer
              id="endCircleOuter"
              style={{
                circleRadius: 10,
                circleColor: '#fff',
              }}
            />
            <Mapbox.CircleLayer
              id="endCircleInner"
              style={{
                circleRadius: 6,
                circleColor: '#E74C3C',
              }}
            />
          </Mapbox.ShapeSource>
        )}
      </Mapbox.MapView>

      {/* Header */}
      <View style={trailMapStyles.header}>
        <TouchableOpacity onPress={() => router.back()} style={trailMapStyles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={trailMapStyles.trailName} numberOfLines={1}>{trail.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Right Side Buttons */}
      <View style={trailMapStyles.rightButtons}>
        {/* 3D Toggle */}
        <TouchableOpacity 
          style={[trailMapStyles.controlButton, is3D && trailMapStyles.controlButtonActive]}
          onPress={() => setIs3D(!is3D)}
        >
          <Ionicons name="cube-outline" size={22} color={is3D ? '#fff' : '#333'} />
        </TouchableOpacity>

        {/* Map Style Toggle */}
        <TouchableOpacity 
          style={trailMapStyles.controlButton}
          onPress={() => setShowStylePicker(!showStylePicker)}
        >
          <Ionicons name={currentMapStyle.icon as any} size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Map Style Picker */}
      {showStylePicker && (
        <View style={trailMapStyles.stylePickerContainer}>
          {MAP_STYLES.map((style, index) => (
            // @ts-ignore
            <TouchableOpacity
              key={style.id}
              style={[
                trailMapStyles.styleOption,
                index === mapStyleIndex && trailMapStyles.styleOptionActive
              ]}
              onPress={() => {
                setMapStyleIndex(index);
                setShowStylePicker(false);
              }}
            >
              <Ionicons 
                name={style.icon as any} 
                size={18} 
                color={index === mapStyleIndex ? COLORS.primary : '#666'} 
              />
              <Text style={[
                trailMapStyles.styleOptionText,
                index === mapStyleIndex && trailMapStyles.styleOptionTextActive
              ]}>
                {style.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Bottom Info Card */}
      <View style={trailMapStyles.bottomCard}>
        <View style={trailMapStyles.trailInfo}>
          <View style={trailMapStyles.infoRow}>
            <View style={trailMapStyles.infoBadge}>
              <Ionicons name="resize-outline" size={16} color={COLORS.primary} />
              <Text style={trailMapStyles.infoText}>{trail.distance_miles?.toFixed(1)} mi</Text>
            </View>
            <View style={trailMapStyles.infoBadge}>
              <Ionicons name="trending-up" size={16} color={COLORS.primary} />
              <Text style={trailMapStyles.infoText}>{trail.elevation_gain_ft?.toLocaleString()} ft</Text>
            </View>
            <View style={trailMapStyles.infoBadge}>
              <Ionicons name="time-outline" size={16} color={COLORS.primary} />
              <Text style={trailMapStyles.infoText}>{trail.estimated_time_hours?.toFixed(1)}h</Text>
            </View>
          </View>
        </View>

        {/* Preview Trail Button */}
        <TouchableOpacity 
          style={trailMapStyles.previewButton}
          onPress={handlePreviewTrail}
          activeOpacity={0.8}
        >
          <Ionicons name="play" size={20} color="#fff" />
          <Text style={trailMapStyles.previewButtonText}>Preview Trail</Text>
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={trailMapStyles.legend}>
        <View style={trailMapStyles.legendItem}>
          <View style={[trailMapStyles.legendDot, { backgroundColor: COLORS.primary }]} />
          <Text style={trailMapStyles.legendText}>Start</Text>
        </View>
        <View style={trailMapStyles.legendItem}>
          <View style={[trailMapStyles.legendDot, { backgroundColor: '#E74C3C' }]} />
          <Text style={trailMapStyles.legendText}>End</Text>
        </View>
      </View>
    </View>
  );
}