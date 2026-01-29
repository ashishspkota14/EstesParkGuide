import React from 'react';
import Mapbox from '@rnmapbox/maps';
import { COLORS } from '../../constants/colors';

interface TrailRouteOverlayProps {
  trail: any;
  isNavigating?: boolean;
}

export default function TrailRouteOverlay({ trail, isNavigating = false }: TrailRouteOverlayProps) {
  if (!trail) return null;

  // Check if we have route coordinates from GPX
  const hasRouteCoordinates = trail.route_coordinates && 
                               trail.route_coordinates.coordinates && 
                               trail.route_coordinates.coordinates.length > 0;

  // Use GPX coordinates if available, otherwise fallback to trailhead
  let routeCoordinates: number[][] = [];
  
  if (hasRouteCoordinates) {
    routeCoordinates = trail.route_coordinates.coordinates.map((coord: number[]) => {
      return [coord[0], coord[1]];
    });
  } else if (trail.trailhead_lon && trail.trailhead_lat) {
    routeCoordinates = [[trail.trailhead_lon, trail.trailhead_lat]];
  } else {
    return null;
  }

  // Light brown color for trail
  const routeColor = '#8B6F47';

  // Start and end points for markers
  const startPoint = routeCoordinates[0];
  const endPoint = routeCoordinates[routeCoordinates.length - 1];

  return (
    <>
      {/* Trail Route Line */}
      {routeCoordinates.length > 1 && (
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
          {/* Shadow/outline */}
          <Mapbox.LineLayer
            id="trailRouteShadow"
            style={{
              lineColor: '#000',
              lineWidth: isNavigating ? 7 : 6,
              lineCap: 'round',
              lineJoin: 'round',
              lineOpacity: 0.3,
            }}
          />
          
          {/* Main trail line */}
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
      )}

      {/* Start Point Marker */}
      {routeCoordinates.length > 0 && (
        <Mapbox.ShapeSource
          id="startPointSource"
          shape={{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: startPoint,
            },
          }}
        >
          <Mapbox.CircleLayer
            id="startPointCircle"
            style={{
              circleRadius: 12,
              circleColor: COLORS.primary,
              circleStrokeWidth: 3,
              circleStrokeColor: '#fff',
            }}
          />
        </Mapbox.ShapeSource>
      )}

      {/* End Point Marker */}
      {routeCoordinates.length > 1 && (
        <Mapbox.ShapeSource
          id="endPointSource"
          shape={{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: endPoint,
            },
          }}
        >
          <Mapbox.CircleLayer
            id="endPointCircle"
            style={{
              circleRadius: 10,
              circleColor: '#FF3B30',
              circleStrokeWidth: 2,
              circleStrokeColor: '#fff',
            }}
          />
        </Mapbox.ShapeSource>
      )}
    </>
  );
}