import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Mapbox from '@rnmapbox/maps';
import { useColors } from '../../context/ThemeContext';
import { trailMapPreviewStyles } from '../../styles/components/trailMapPreview.styles';

const TRAIL_COLOR = '#8B6F47';

interface TrailMapPreviewProps {
  trail: any;
}

export default function TrailMapPreview({ trail }: TrailMapPreviewProps) {
  const COLORS = useColors();
  const [is3D, setIs3D] = useState(false);

  const handlePreview = () => {
    router.push({
      pathname: '/(screens)/trail-preview',
      params: { id: trail.id }
    });
  };

  const handleFullMap = () => {
    router.push({
      pathname: '/(screens)/trail-map',
      params: { trailId: trail.id }
    });
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

  // Calculate appropriate zoom level based on trail bounds
  const zoomLevel = useMemo(() => {
    if (!bounds) return 13;
    
    const lonDiff = bounds.maxLon - bounds.minLon;
    const latDiff = bounds.maxLat - bounds.minLat;
    const maxDiff = Math.max(lonDiff, latDiff);

    if (maxDiff > 0.1) return 11;
    if (maxDiff > 0.05) return 12;
    if (maxDiff > 0.02) return 13;
    if (maxDiff > 0.01) return 14;
    return 14.5;
  }, [bounds]);

  return (
    <View style={[trailMapPreviewStyles.container, { backgroundColor: COLORS.white }]}>
      {/* Header */}
      <View style={trailMapPreviewStyles.header}>
        <Text style={[trailMapPreviewStyles.title, { color: COLORS.text }]}>Trail Map</Text>
        <TouchableOpacity onPress={handleFullMap} style={trailMapPreviewStyles.fullMapButton}>
          <Text style={[trailMapPreviewStyles.fullMapText, { color: COLORS.primary }]}>
            View Full Map
          </Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Map Container */}
      <View style={trailMapPreviewStyles.mapContainer}>
        <Mapbox.MapView
          style={trailMapPreviewStyles.map}
          styleURL={Mapbox.StyleURL.Outdoors}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
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
              id="trailRoutePreview"
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
                id="trailLinePreview"
                style={{
                  lineColor: TRAIL_COLOR,
                  lineWidth: 4,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            </Mapbox.ShapeSource>
          )}

          {/* Trail Start Marker */}
          {routeCoordinates && routeCoordinates.length > 0 && (
            <Mapbox.ShapeSource
              id="trailStartPreview"
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
                id="trailStartCircleOuter"
                style={{
                  circleRadius: 8,
                  circleColor: '#fff',
                }}
              />
              <Mapbox.CircleLayer
                id="trailStartCircleInner"
                style={{
                  circleRadius: 5,
                  circleColor: COLORS.primary,
                }}
              />
            </Mapbox.ShapeSource>
          )}
        </Mapbox.MapView>

        {/* 3D Toggle Button */}
        <TouchableOpacity 
          style={[
            trailMapPreviewStyles.toggleButton,
            is3D && [trailMapPreviewStyles.toggleButtonActive, { backgroundColor: COLORS.primary }]
          ]}
          onPress={() => setIs3D(!is3D)}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="cube-outline" 
            size={20} 
            color={is3D ? '#fff' : '#666'} 
          />
        </TouchableOpacity>

        {/* Preview Trail Button */}
        <TouchableOpacity 
          style={[trailMapPreviewStyles.previewButton, { backgroundColor: COLORS.primary }]}
          onPress={handlePreview}
          activeOpacity={0.9}
        >
          <Ionicons name="play" size={18} color="#fff" />
          <Text style={trailMapPreviewStyles.previewText}>Preview Trail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}