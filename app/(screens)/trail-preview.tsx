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

// Map style options
const MAP_STYLES = [
  { id: 'outdoors', label: 'Outdoors', url: Mapbox.StyleURL.Outdoors, icon: 'trail-sign-outline' },
  { id: 'satellite', label: 'Satellite', url: Mapbox.StyleURL.SatelliteStreet, icon: 'earth-outline' },
  { id: 'streets', label: 'Streets', url: Mapbox.StyleURL.Street, icon: 'map-outline' },
];

export default function TrailPreviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [trail, setTrail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [currentBearing, setCurrentBearing] = useState(0);
  const [processedCoords, setProcessedCoords] = useState<number[][]>([]);
  const [mapStyleIndex, setMapStyleIndex] = useState(0); // NEW: Map style state
  const [showStylePicker, setShowStylePicker] = useState(false); // NEW: Style picker visibility
  
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const bearingUpdateCounter = useRef(0);
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
    if (trail?.route_coordinates?.coordinates && isMapReady && processedCoords.length > 0) {
      // REDUCED: Wait only 1 second after map is ready (was 2 seconds)
      const timer = setTimeout(() => {
        const initialBearing = calculateBearing(processedCoords, 0);
        setCurrentBearing(initialBearing);
        setIsPlaying(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [trail, isMapReady, processedCoords]);

  useEffect(() => {
    if (processedCoords.length > 0 && isPlaying && isMapReady) {
      startAnimation();
    } else {
      stopAnimation();
    }
    return () => stopAnimation();
  }, [processedCoords, isPlaying, speed, isMapReady]);

  const fetchTrail = async () => {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setTrail(data);
      
      // Use coordinates as-is from GPX
      if (data?.route_coordinates?.coordinates) {
        setProcessedCoords(data.route_coordinates.coordinates);
      }
      
      // REDUCED: Wait only 1 second for map to render (was 1.5 seconds)
      setTimeout(() => {
        setIsMapReady(true);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching trail:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAnimation = () => {
    stopAnimation();
    const interval = 100 / speed;

    animationRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        if (next >= processedCoords.length) {
          setIsPlaying(false);
          return processedCoords.length - 1;
        }
        
        const progress = next / (processedCoords.length - 1);
        progressAnim.setValue(progress);
        
        bearingUpdateCounter.current += 1;
        if (bearingUpdateCounter.current >= 15) {
          bearingUpdateCounter.current = 0;
          const newBearing = calculateBearing(processedCoords, next);
          setCurrentBearing(newBearing);
        }
        
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
    if (currentIndex >= processedCoords.length - 1) {
      setCurrentIndex(0);
      progressAnim.setValue(0);
      bearingUpdateCounter.current = 0;
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    progressAnim.setValue(0);
    bearingUpdateCounter.current = 0;
    setCurrentBearing(calculateBearing(processedCoords, 0));
    setIsPlaying(true);
  };

  const cycleSpeed = () => {
    const speeds = [0.5, 1, 2, 3];
    const currentSpeedIndex = speeds.indexOf(speed);
    const nextSpeed = speeds[(currentSpeedIndex + 1) % speeds.length];
    setSpeed(nextSpeed);
  };

  // NEW: Toggle map style
  const cycleMapStyle = () => {
    setMapStyleIndex((prev) => (prev + 1) % MAP_STYLES.length);
    setShowStylePicker(false);
  };

  // NEW: Select specific style
  const selectMapStyle = (index: number) => {
    setMapStyleIndex(index);
    setShowStylePicker(false);
  };

  if (loading || !trail) {
    return (
      <View style={trailPreviewStyles.loadingContainer}>
        <Text style={trailPreviewStyles.loadingText}>Loading trail...</Text>
      </View>
    );
  }

  const hasCoords = processedCoords.length > 0;
  
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

  const currentCoord = processedCoords[currentIndex] || processedCoords[0];
  const currentLon = currentCoord[0];
  const currentLat = currentCoord[1];
  
  // ELEVATION: Check if elevation exists at index 2
  const hasElevationData = processedCoords[0]?.length >= 3 && processedCoords[0][2] > 0;
  
  let currentElevationFt = 0;
  let startEleFt = 0;
  let endEleFt = 0;
  let elevationGain = trail.elevation_gain_ft || 0;
  let minEle = 0;
  let maxEle = 0;
  let elevations: number[] = [];
  
  if (hasElevationData) {
    // Use GPX elevation data
    elevations = processedCoords.map((c: number[]) => c[2] || 0);
    minEle = Math.min(...elevations.filter(e => e > 0));
    maxEle = Math.max(...elevations);
    
    const currentElevationMeters = currentCoord[2] || 0;
    currentElevationFt = Math.round(currentElevationMeters * 3.28084);
    startEleFt = Math.round((elevations[0] || 0) * 3.28084);
    endEleFt = Math.round((elevations[elevations.length - 1] || 0) * 3.28084);
    elevationGain = Math.round((maxEle - elevations[0]) * 3.28084);
  } else {
    // Fallback to database values
    startEleFt = trail.trailhead_elevation_ft || 0;
    endEleFt = startEleFt + (trail.elevation_gain_ft || 0);
    elevationGain = trail.elevation_gain_ft || 0;
    
    // Calculate current elevation based on progress (linear interpolation)
    const progress = currentIndex / (processedCoords.length - 1);
    currentElevationFt = Math.round(startEleFt + (progress * elevationGain));
    
    // Create fake elevations for the chart
    elevations = processedCoords.map((_, index) => {
      const p = index / (processedCoords.length - 1);
      return startEleFt + (p * elevationGain);
    });
    minEle = startEleFt;
    maxEle = endEleFt;
  }

  const routeCoordinates = processedCoords.map((c: number[]) => [c[0], c[1]]);
  const traveledCoordinates = processedCoords.slice(0, currentIndex + 1).map((c: number[]) => [c[0], c[1]]);

  const distanceTraveled = ((currentIndex / (processedCoords.length - 1)) * (trail.distance_miles || 0)).toFixed(1);
  const progress = currentIndex / (processedCoords.length - 1);

  const currentMapStyle = MAP_STYLES[mapStyleIndex];

  return (
    <View style={trailPreviewStyles.container}>
      {/* Map */}
      <Mapbox.MapView
        style={trailPreviewStyles.map}
        styleURL={currentMapStyle.url}
      >
        <Mapbox.Camera
          zoomLevel={15}
          centerCoordinate={[currentLon, currentLat]}
          pitch={60}
          heading={currentBearing}
          animationDuration={500}
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

      {/* Map Style Toggle Button */}
      <TouchableOpacity 
        style={trailPreviewStyles.mapStyleButton}
        onPress={() => setShowStylePicker(!showStylePicker)}
      >
        <Ionicons name={currentMapStyle.icon as any} size={20} color="#333" />
      </TouchableOpacity>

      {/* Map Style Picker Dropdown */}
      {showStylePicker && (
        <View style={trailPreviewStyles.stylePickerContainer}>
          {MAP_STYLES.map((style, index) => (
            // @ts-ignore
            <TouchableOpacity
              key={style.id}
              style={[
                trailPreviewStyles.styleOption,
                index === mapStyleIndex && trailPreviewStyles.styleOptionActive
              ]}
              onPress={() => selectMapStyle(index)}
            >
              <Ionicons 
                name={style.icon as any} 
                size={18} 
                color={index === mapStyleIndex ? COLORS.primary : '#666'} 
              />
              <Text style={[
                trailPreviewStyles.styleOptionText,
                index === mapStyleIndex && trailPreviewStyles.styleOptionTextActive
              ]}>
                {style.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Elevation Info Card */}
      <View style={trailPreviewStyles.elevationCard}>
        <View style={trailPreviewStyles.elevationMain}>
          <Ionicons name="trending-up" size={20} color={COLORS.primary} />
          <Text style={trailPreviewStyles.elevationValue}>{currentElevationFt.toLocaleString()} ft</Text>
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
            <Text style={trailPreviewStyles.statValue}>{startEleFt.toLocaleString()} ft</Text>
            <Text style={trailPreviewStyles.statLabel}>Start</Text>
          </View>
          <View style={trailPreviewStyles.stat}>
            <Text style={trailPreviewStyles.statValue}>{endEleFt.toLocaleString()} ft</Text>
            <Text style={trailPreviewStyles.statLabel}>End</Text>
          </View>
          <View style={trailPreviewStyles.stat}>
            <Text style={trailPreviewStyles.statValue}>+{elevationGain} ft</Text>
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

function calculateBearing(coords: number[][], currentIndex: number): number {
  if (currentIndex >= coords.length - 1) return 0;
  
  const current = coords[currentIndex];
  const next = coords[Math.min(currentIndex + 15, coords.length - 1)];
  
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
  const eleRange = (maxEle - minEle) || 1;

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