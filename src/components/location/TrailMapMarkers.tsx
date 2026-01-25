import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView from '@rnmapbox/maps';
import { Trail } from '../../types/trail.types';

interface TrailMapMarkersProps {
  trails: Trail[];
  onMarkerPress?: (trail: Trail) => void;
}

export default function TrailMapMarkers({ trails, onMarkerPress }: TrailMapMarkersProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#4ade80';
      case 'moderate':
        return '#fbbf24';
      case 'hard':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <>
      {trails.map((trail) => (
        <MapView.PointAnnotation
          key={trail.id}
          id={trail.id}
          coordinate={[trail.trailhead_lon, trail.trailhead_lat]}
          onSelected={() => onMarkerPress?.(trail)}
        >
          <View
            style={[
              styles.marker,
              { backgroundColor: getDifficultyColor(trail.difficulty) },
            ]}
          >
            <View style={styles.markerInner} />
          </View>

          <MapView.Callout title={trail.name}>
            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>{trail.name}</Text>
              <Text style={styles.calloutText}>
                {trail.distance_miles} mi • {trail.difficulty}
              </Text>
            </View>
          </MapView.Callout>
        </MapView.PointAnnotation>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  callout: {
    padding: 8,
    minWidth: 150,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 12,
    color: '#6b7280',
  },
});