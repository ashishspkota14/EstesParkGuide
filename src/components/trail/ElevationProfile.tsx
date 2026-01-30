import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { elevationProfileStyles } from '../../styles/components/elevationProfile.styles';
import { COLORS } from '../../constants/colors';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 40;
const CHART_HEIGHT = 120;
const TRAIL_COLOR = '#8B6F47';

interface ElevationProfileProps {
  trail: any;
}

export default function ElevationProfile({ trail }: ElevationProfileProps) {
  // Get elevation data from route_coordinates
  const elevationData = useMemo(() => {
    if (!trail?.route_coordinates?.coordinates) {
      return null;
    }

    const coords = trail.route_coordinates.coordinates;
    
    // Check if we have elevation data (index 2)
    const hasElevation = coords[0]?.length >= 3 && coords[0][2] > 0;
    
    if (!hasElevation) {
      // Generate synthetic elevation data based on trail info
      const startEle = trail.trailhead_elevation_ft || 8000;
      const gain = trail.elevation_gain_ft || 500;
      const points = 50;
      
      return Array.from({ length: points }, (_, i) => {
        const progress = i / (points - 1);
        // Create a realistic-looking profile curve
        const elevation = startEle + (gain * Math.sin(progress * Math.PI * 0.5));
        return elevation;
      });
    }

    // Sample real elevation data
    const sampleSize = Math.min(50, coords.length);
    const step = Math.max(1, Math.floor(coords.length / sampleSize));
    const elevations: number[] = [];
    
    for (let i = 0; i < coords.length; i += step) {
      // Convert meters to feet
      const eleFt = (coords[i][2] || 0) * 3.28084;
      elevations.push(eleFt);
    }
    
    return elevations;
  }, [trail]);

  if (!elevationData || elevationData.length === 0) {
    return null;
  }

  const minEle = Math.min(...elevationData);
  const maxEle = Math.max(...elevationData);
  const eleRange = maxEle - minEle || 1;
  
  const startEleFt = Math.round(elevationData[0]);
  const endEleFt = Math.round(elevationData[elevationData.length - 1]);
  const elevationGain = trail.elevation_gain_ft || Math.round(maxEle - elevationData[0]);

  const barWidth = (CHART_WIDTH - 20) / elevationData.length;

  return (
    <View style={elevationProfileStyles.container}>
      <Text style={elevationProfileStyles.title}>Elevation Profile</Text>
      
      {/* Elevation Chart */}
      <View style={elevationProfileStyles.chartContainer}>
        {/* Y-Axis Labels */}
        <View style={elevationProfileStyles.yAxis}>
          <Text style={elevationProfileStyles.axisLabel}>{Math.round(maxEle).toLocaleString()}'</Text>
          <Text style={elevationProfileStyles.axisLabel}>{Math.round(minEle).toLocaleString()}'</Text>
        </View>

        {/* Chart Bars */}
        <View style={elevationProfileStyles.chart}>
          {elevationData.map((ele, index) => {
            const normalized = (ele - minEle) / eleRange;
            const height = Math.max(4, normalized * (CHART_HEIGHT - 20));
            
            return (
              // @ts-ignore
              <View
                key={`ele-${index}`}
                style={{
                  width: barWidth - 1,
                  height: height,
                  backgroundColor: TRAIL_COLOR,
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                  marginRight: 1,
                }}
              />
            );
          })}
        </View>
      </View>

      {/* Stats Row */}
      <View style={elevationProfileStyles.statsRow}>
        <View style={elevationProfileStyles.stat}>
          <View style={elevationProfileStyles.statIcon}>
            <Ionicons name="flag-outline" size={16} color={COLORS.primary} />
          </View>
          <View>
            <Text style={elevationProfileStyles.statValue}>{startEleFt.toLocaleString()} ft</Text>
            <Text style={elevationProfileStyles.statLabel}>Start</Text>
          </View>
        </View>

        <View style={elevationProfileStyles.stat}>
          <View style={elevationProfileStyles.statIcon}>
            <Ionicons name="trending-up" size={16} color={COLORS.primary} />
          </View>
          <View>
            <Text style={elevationProfileStyles.statValue}>+{elevationGain.toLocaleString()} ft</Text>
            <Text style={elevationProfileStyles.statLabel}>Gain</Text>
          </View>
        </View>

        <View style={elevationProfileStyles.stat}>
          <View style={elevationProfileStyles.statIcon}>
            <Ionicons name="locate-outline" size={16} color={COLORS.primary} />
          </View>
          <View>
            <Text style={elevationProfileStyles.statValue}>{endEleFt.toLocaleString()} ft</Text>
            <Text style={elevationProfileStyles.statLabel}>End</Text>
          </View>
        </View>

        <View style={elevationProfileStyles.stat}>
          <View style={elevationProfileStyles.statIcon}>
            <Ionicons name="analytics-outline" size={16} color={COLORS.primary} />
          </View>
          <View>
            <Text style={elevationProfileStyles.statValue}>{Math.round(maxEle).toLocaleString()} ft</Text>
            <Text style={elevationProfileStyles.statLabel}>Max</Text>
          </View>
        </View>
      </View>
    </View>
  );
}