import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Mapbox from '@rnmapbox/maps';
import { supabase } from '../../src/services/supabase/client';
import { COLORS } from '../../src/constants/colors';
import { trailPreviewStyles } from '../../src/styles/screens/trailPreview.styles';

const { width } = Dimensions.get('window');

const TRAIL_COLOR = '#8B6F47';

export default function TrailPreviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [trail, setTrail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchTrail();
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [id]);

  useEffect(() => {
    if (trail?.route_coordinates?.coordinates && isPlaying) {
      startAnimation();
    } else {
      stopAnimation();
    }
    return () => stopAnimation();
  }, [trail, isPlaying, speed]);

  const fetchTrail = async () => {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setTrail(data);
    } catch (error) {
      console.error('Error fetching trail:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAnimation = () => {
    stopAnimation();
    const coords = trail.route_coordinates.coordinates;
    const interval = 100 / speed;

    animationRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        if (next >= coords.length) {
          setIsPlaying(false);
          return coords.length - 1;
        }
        
        const progress = next / (coords.length - 1);
        progressAnim.setValue(progress);
        
        return next;
      });
    }, interval);
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
  };

  const togglePlayPause = () => {
    if (currentIndex >= (trail?.route_coordinates?.coordinates?.length || 1) - 1) {
      setCurrentIndex(0);
      progressAnim.setValue(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    progressAnim.setValue(0);
    setIsPlaying(true);
  };

  const cycleSpeed = () => {
    const speeds = [0.5, 1, 2, 3];
    const currentSpeedIndex = speeds.indexOf(speed);
    const nextSpeed = speeds[(currentSpeedIndex + 1) % speeds.length];
    setSpeed(nextSpeed);
  };

  if (loading || !trail) {
    return (
      <View style={trailPreviewStyles.loadingContainer}>
        <Text style={trailPreviewStyles.loadingText}>Loading trail...</Text>
      </View>
    );
  }

  const coords = trail.route_coordinates?.coordinates || [];
  const hasCoords = coords.length > 0;
  
  if (!hasCoords) {
    return (
      <View style={trailPreviewStyles.loadingContainer}>
        <Text style={trailPreviewStyles.loadingText}>No route data available</Text>
        <TouchableOpacity onPress={() => router.back()} style={trailPreviewStyles.backButtonAlt}>
          <Text style={trailPreviewStyles.backButtonAltText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentCoord = coords[currentIndex] || coords[0];
  const currentLon = currentCoord[0];
  const currentLat = currentCoord[1];
  const currentElevation = currentCoord[2] || 0;
  const currentElevationFt = Math.round(currentElevation * 3.28084);

  const elevations = coords.map((c: number[]) => c[2] || 0);
  const minEle = Math.min(...elevations);
  const maxEle = Math.max(...elevations);
  const startEleFt = Math.round(elevations[0] * 3.28084);
  const endEleFt = Math.round(elevations[elevations.length - 1] * 3.28084);
  const elevationGain = Math.round((maxEle - elevations[0]) * 3.28084);

  const routeCoordinates = coords.map((c: number[]) => [c[0], c[1]]);
  const traveledCoordinates = coords.slice(0, currentIndex + 1).map((c: number[]) => [c[0], c[1]]);

  const distanceTraveled = ((currentIndex / (coords.length - 1)) * (trail.distance_miles || 0)).toFixed(1);
  const progress = currentIndex / (coords.length - 1);

  return (
    <View style={trailPreviewStyles.container}>
      {/* Map */}
      <Mapbox.MapView
        style={trailPreviewStyles.map}
        styleURL={Mapbox.StyleURL.Outdoors}
      >
        <Mapbox.Camera
          zoomLevel={15}
          centerCoordinate={[currentLon, currentLat]}
          pitch={60}
          heading={calculateBearing(coords, currentIndex)}
          animationDuration={300}
        />

        {/* Full trail line (gray) */}
        <Mapbox.ShapeSource
          id="fullTrailSource"
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
            id="fullTrailLine"
            style={{
              lineColor: '#ccc',
              lineWidth: 4,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        </Mapbox.ShapeSource>

        {/* Traveled trail line (LIGHT BROWN) */}
        {traveledCoordinates.length > 1 && (
          <Mapbox.ShapeSource
            id="traveledTrailSource"
            shape={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: traveledCoordinates,
              },
            }}
          >
            <Mapbox.LineLayer
              id="traveledTrailLine"
              style={{
                lineColor: TRAIL_COLOR,
                lineWidth: 5,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </Mapbox.ShapeSource>
        )}

        {/* Current position marker */}
        <Mapbox.ShapeSource
          id="currentPositionSource"
          shape={{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [currentLon, currentLat],
            },
          }}
        >
          <Mapbox.CircleLayer
            id="currentPositionOuter"
            style={{
              circleRadius: 12,
              circleColor: '#fff',
            }}
          />
          <Mapbox.CircleLayer
            id="currentPositionInner"
            style={{
              circleRadius: 8,
              circleColor: TRAIL_COLOR,
            }}
          />
        </Mapbox.ShapeSource>
      </Mapbox.MapView>

      {/* Header */}
      <View style={trailPreviewStyles.header}>
        <TouchableOpacity onPress={() => router.back()} style={trailPreviewStyles.backButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={trailPreviewStyles.trailName} numberOfLines={1}>{trail.name}</Text>
        <TouchableOpacity onPress={cycleSpeed} style={trailPreviewStyles.speedButton}>
          <Text style={trailPreviewStyles.speedText}>{speed}x</Text>
        </TouchableOpacity>
      </View>

      {/* Elevation Info Card */}
      <View style={trailPreviewStyles.elevationCard}>
        <View style={trailPreviewStyles.elevationMain}>
          <Ionicons name="trending-up" size={20} color={COLORS.primary} />
          <Text style={trailPreviewStyles.elevationValue}>{currentElevationFt.toLocaleString()}'</Text>
        </View>
        <Text style={trailPreviewStyles.elevationLabel}>Current Elevation</Text>
      </View>

      {/* Bottom Panel */}
      <View style={trailPreviewStyles.bottomPanel}>
        {/* Elevation Profile */}
        <View style={trailPreviewStyles.elevationProfile}>
          <ElevationProfileChart 
            elevations={elevations} 
            progress={progress}
            minEle={minEle}
            maxEle={maxEle}
          />
        </View>

        {/* Stats Row */}
        <View style={trailPreviewStyles.statsRow}>
          <View style={trailPreviewStyles.stat}>
            <Text style={trailPreviewStyles.statValue}>{distanceTraveled} mi</Text>
            <Text style={trailPreviewStyles.statLabel}>Distance</Text>
          </View>
          <View style={trailPreviewStyles.stat}>
            <Text style={trailPreviewStyles.statValue}>{startEleFt.toLocaleString()}'</Text>
            <Text style={trailPreviewStyles.statLabel}>Start</Text>
          </View>
          <View style={trailPreviewStyles.stat}>
            <Text style={trailPreviewStyles.statValue}>{endEleFt.toLocaleString()}'</Text>
            <Text style={trailPreviewStyles.statLabel}>End</Text>
          </View>
          <View style={trailPreviewStyles.stat}>
            <Text style={trailPreviewStyles.statValue}>+{elevationGain}'</Text>
            <Text style={trailPreviewStyles.statLabel}>Gain</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={trailPreviewStyles.controls}>
          <TouchableOpacity onPress={handleRestart} style={trailPreviewStyles.controlButton}>
            <Ionicons name="refresh" size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={togglePlayPause} style={trailPreviewStyles.playButton}>
            <Ionicons 
              name={isPlaying ? 'pause' : 'play'} 
              size={32} 
              color="#fff" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.back()} style={trailPreviewStyles.controlButton}>
            <Ionicons name="exit-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Look further ahead for smoother camera (10 instead of 5)
function calculateBearing(coords: number[][], currentIndex: number): number {
  if (currentIndex >= coords.length - 1) return 0;
  
  const current = coords[currentIndex];
  const next = coords[Math.min(currentIndex + 10, coords.length - 1)];
  
  const lon1 = (current[0] * Math.PI) / 180;
  const lat1 = (current[1] * Math.PI) / 180;
  const lon2 = (next[0] * Math.PI) / 180;
  const lat2 = (next[1] * Math.PI) / 180;
  
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  
  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

function ElevationProfileChart({ elevations, progress, minEle, maxEle }: {
  elevations: number[];
  progress: number;
  minEle: number;
  maxEle: number;
}) {
  const chartWidth = width - 40;
  const chartHeight = 60;
  const eleRange = maxEle - minEle || 1;

  const sampleSize = Math.min(50, elevations.length);
  const step = Math.max(1, Math.floor(elevations.length / sampleSize));
  const sampledElevations: number[] = [];
  
  for (let i = 0; i < elevations.length; i += step) {
    sampledElevations.push(elevations[i]);
  }

  const barWidth = (chartWidth - 20) / sampledElevations.length;
  const progressIndex = Math.floor(progress * sampledElevations.length);

  return (
    <View style={{ height: chartHeight, flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 10 }}>
      {sampledElevations.map((ele, index) => {
        const normalized = (ele - minEle) / eleRange;
        const height = Math.max(4, normalized * (chartHeight - 10));
        const isPassed = index <= progressIndex;
        
        return (
          // @ts-ignore
          <View
            key={`elebar-${index}`}
            style={{
              width: barWidth - 1,
              height: height,
              backgroundColor: isPassed ? TRAIL_COLOR : '#ddd',
              borderRadius: 2,
              marginRight: 1,
            }}
          />
        );
      })}
    </View>
  );
}