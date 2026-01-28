import React from 'react';
import { View } from 'react-native';
import Mapbox from '@rnmapbox/maps';

interface TrailRouteOverlayProps {
  trail: any;
  isNavigating?: boolean;
}

export default function TrailRouteOverlay({ trail, isNavigating = false }: TrailRouteOverlayProps) {
  if (!trail || !trail.start_lat || !trail.start_lng) return null;

  const routeCoordinates = trail.end_lat && trail.end_lng
    ? [[trail.start_lng, trail.start_lat], [trail.end_lng, trail.end_lat]]
    : [[trail.start_lng, trail.start_lat]];

  // Light brown color for trail route (like AllTrails but slightly different)
  const routeColor = '#8B6F47';

  return (
    <>
      {/* Trail Route Line */}
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
            lineColor: routeColor,
            lineWidth: isNavigating ? 5 : 4,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      </Mapbox.ShapeSource>

      {/* Start Point Marker */}
      <Mapbox.PointAnnotation
        id="trailStartPoint"
        coordinate={[trail.start_lng, trail.start_lat]}
      >
        <View style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: '#2d5a3f',
          borderWidth: 3,
          borderColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }} />
      </Mapbox.PointAnnotation>

      {/* End Point Marker (if different from start) */}
      {trail.end_lat && trail.end_lng && 
       (trail.end_lat !== trail.start_lat || trail.end_lng !== trail.start_lng) && (
        <Mapbox.PointAnnotation
          id="trailEndPoint"
          coordinate={[trail.end_lng, trail.end_lat]}
        >
          <View style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: '#FF3B30',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          }}>
            <View style={{
              width: 12,
              height: 12,
              backgroundColor: '#fff',
              borderRadius: 6,
            }} />
          </View>
        </Mapbox.PointAnnotation>
      )}
    </>
  );
}