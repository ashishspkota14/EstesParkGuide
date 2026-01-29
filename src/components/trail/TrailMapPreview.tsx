import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Mapbox from '@rnmapbox/maps';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { trailMapPreviewStyles } from '../../styles/components/trailMapPreview.styles';

interface TrailMapPreviewProps {
  trail: any;
}

export default function TrailMapPreview({ trail }: TrailMapPreviewProps) {
  const router = useRouter();

  if (!trail) return null;

  const centerLat = trail.trailhead_lat || 40.3772;
  const centerLon = trail.trailhead_lon || -105.5217;

  const hasRouteCoordinates = trail.route_coordinates && 
                               trail.route_coordinates.coordinates && 
                               trail.route_coordinates.coordinates.length > 0;

  let routeCoordinates: number[][] = [];
  if (hasRouteCoordinates) {
    routeCoordinates = trail.route_coordinates.coordinates.map((coord: number[]) => {
      return [coord[0], coord[1]];
    });
  }

  const handleViewFullMap = () => {
    router.push({
      pathname: '/(screens)/trail-preview',
      params: { id: trail.id }
    });
  };

  const handlePreviewTrail = () => {
    router.push({
      pathname: '/(screens)/trail-preview',
      params: { id: trail.id }
    });
  };

  const trailColor = '#8B6F47';

  return (
    <View style={trailMapPreviewStyles.container}>
      <View style={trailMapPreviewStyles.header}>
        <Text style={trailMapPreviewStyles.title}>Trail Map</Text>
        <TouchableOpacity onPress={handleViewFullMap} style={trailMapPreviewStyles.viewFullButton}>
          <Text style={trailMapPreviewStyles.viewFullText}>View Full Map</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={trailMapPreviewStyles.mapContainer}>
        <Mapbox.MapView
          style={trailMapPreviewStyles.map}
          styleURL={Mapbox.StyleURL.Outdoors}
          scrollEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          zoomEnabled={false}
          attributionEnabled={true}
          logoEnabled={true}
        >
          <Mapbox.Camera
            zoomLevel={13}
            centerCoordinate={[centerLon, centerLat]}
            animationDuration={0}
          />

          {hasRouteCoordinates && routeCoordinates.length > 1 && (
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
                id="trailRouteShadow"
                style={{
                  lineColor: '#000',
                  lineWidth: 5,
                  lineCap: 'round',
                  lineJoin: 'round',
                  lineOpacity: 0.3,
                }}
              />
              <Mapbox.LineLayer
                id="trailRouteLine"
                style={{
                  lineColor: trailColor,
                  lineWidth: 3,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            </Mapbox.ShapeSource>
          )}

          {hasRouteCoordinates && routeCoordinates.length > 0 && (
            <Mapbox.ShapeSource
              id="startPointSource"
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
                id="startPointCircle"
                style={{
                  circleRadius: 8,
                  circleColor: COLORS.primary,
                  circleStrokeWidth: 2,
                  circleStrokeColor: '#fff',
                }}
              />
            </Mapbox.ShapeSource>
          )}

          {hasRouteCoordinates && routeCoordinates.length > 1 && (
            <Mapbox.ShapeSource
              id="endPointSource"
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
                id="endPointCircle"
                style={{
                  circleRadius: 6,
                  circleColor: '#FF3B30',
                  circleStrokeWidth: 2,
                  circleStrokeColor: '#fff',
                }}
              />
            </Mapbox.ShapeSource>
          )}
        </Mapbox.MapView>

        <TouchableOpacity style={trailMapPreviewStyles.toggle3D}>
          <Ionicons name="cube-outline" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={trailMapPreviewStyles.previewButton} onPress={handlePreviewTrail}>
          <Ionicons name="play" size={16} color="#333" />
          <Text style={trailMapPreviewStyles.previewText}>Preview Trail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}