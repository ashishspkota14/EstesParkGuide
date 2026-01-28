import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Mapbox from '@rnmapbox/maps';
import { trailMapPreviewStyles } from '../../styles/components/trailMapPreview.styles';
import { COLORS } from '../../constants/colors';

interface TrailMapPreviewProps {
  trail: any;
}

export default function TrailMapPreview({ trail }: TrailMapPreviewProps) {
  const [mapReady, setMapReady] = useState(false);

  const handleFullMap = () => {
    router.push({
      pathname: '/tabs/map',
      params: { 
        trailId: trail.id,
        mode: 'preview',
        lat: trail.start_lat,
        lng: trail.start_lng,
        name: trail.name
      }
    });
  };

  const centerCoords = trail.start_lat && trail.start_lng
    ? [trail.start_lng, trail.start_lat]
    : [-105.5217, 40.3772];

  // Create route line
  const routeCoordinates = trail.start_lat && trail.start_lng && trail.end_lat && trail.end_lng
    ? [[trail.start_lng, trail.start_lat], [trail.end_lng, trail.end_lat]]
    : null;

  return (
    <View style={trailMapPreviewStyles.container}>
      <View style={trailMapPreviewStyles.header}>
        <Text style={trailMapPreviewStyles.title}>Trail Map</Text>
        <TouchableOpacity 
          onPress={handleFullMap}
          style={trailMapPreviewStyles.viewButton}
          activeOpacity={0.7}
        >
          <Text style={trailMapPreviewStyles.viewButtonText}>View Full Map</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={trailMapPreviewStyles.mapContainer}>
        <Mapbox.MapView
          style={trailMapPreviewStyles.map}
          styleURL={Mapbox.StyleURL.Outdoors}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          onDidFinishLoadingMap={() => setMapReady(true)}
        >
          <Mapbox.Camera
            zoomLevel={13}
            centerCoordinate={centerCoords}
            animationDuration={0}
          />

          {/* Trail Route Line - Light Brown */}
          {mapReady && routeCoordinates && (
            <Mapbox.ShapeSource
              id="trailRouteSource"
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
                id="trailRouteLine"
                style={{
                  lineColor: '#8B6F47',
                  lineWidth: 4,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            </Mapbox.ShapeSource>
          )}

          {/* Start Point */}
          {trail.start_lat && trail.start_lng && (
            <Mapbox.PointAnnotation
              id="trailStart"
              coordinate={[trail.start_lng, trail.start_lat]}
            >
              <View style={trailMapPreviewStyles.startMarker}>
                <View style={trailMapPreviewStyles.startMarkerInner} />
              </View>
            </Mapbox.PointAnnotation>
          )}

          {/* End Point */}
          {trail.end_lat && trail.end_lng && 
           (trail.end_lat !== trail.start_lat || trail.end_lng !== trail.start_lng) && (
            <Mapbox.PointAnnotation
              id="trailEnd"
              coordinate={[trail.end_lng, trail.end_lat]}
            >
              <View style={trailMapPreviewStyles.endMarker}>
                <Ionicons name="flag" size={16} color="#fff" />
              </View>
            </Mapbox.PointAnnotation>
          )}
        </Mapbox.MapView>

        {/* Overlay Button */}
        <TouchableOpacity 
          style={trailMapPreviewStyles.overlayButton}
          onPress={handleFullMap}
          activeOpacity={0.9}
        >
          <View style={trailMapPreviewStyles.buttonContent}>
            <Ionicons name="map" size={22} color={COLORS.primary} />
            <Text style={trailMapPreviewStyles.buttonText}>Preview Trail</Text>
          </View>
        </TouchableOpacity>

        {/* 3D Hint */}
        <View style={trailMapPreviewStyles.hint3D}>
          <Ionicons name="cube-outline" size={16} color="#fff" />
          <Text style={trailMapPreviewStyles.hintText}>Tap for 3D view</Text>
        </View>
      </View>
    </View>
  );
}