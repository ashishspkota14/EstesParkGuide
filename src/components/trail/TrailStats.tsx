import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../context/ThemeContext';
import { useUnits } from '../../context/UnitsContext';
import { trailStatsStyles } from '../../styles/components/trailStats.styles';

interface TrailStatsProps {
  trail: any;
}

export default function TrailStats({ trail }: TrailStatsProps) {
  const COLORS = useColors();
  const { 
    formatDistanceShort, 
    formatElevationShort, 
    convertDistance, 
    convertElevation,
    getDistanceUnitShort,
    getElevationUnitShort 
  } = useUnits();

  // Calculate round trip
  const oneWayMiles = trail.distance_miles || 0;
  const roundTripMiles = trail.route_type === 'loop' ? oneWayMiles : oneWayMiles * 2;

  // Estimate times (assume 2 mph average)
  const oneWayHours = oneWayMiles / 2;
  const roundTripHours = roundTripMiles / 2;

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  // Determine steepness
  const getSteepness = () => {
    const gainPerMile = trail.elevation_gain_ft / oneWayMiles;
    if (gainPerMile < 200) return 'Gradual';
    if (gainPerMile < 500) return 'Moderate';
    if (gainPerMile < 800) return 'Steep';
    return 'Very Steep';
  };

  const getTrailType = () => {
    switch(trail.route_type) {
      case 'loop': return 'Loop';
      case 'out_and_back': return 'Out & Back';
      case 'point_to_point': return 'Point to Point';
      default: return 'Out & Back';
    }
  };

  return (
    <View style={[trailStatsStyles.container, { backgroundColor: COLORS.white }]}>
      <Text style={[trailStatsStyles.title, { color: COLORS.text }]}>Trail Information</Text>

      {/* Distance */}
      <View style={trailStatsStyles.statGroup}>
        <View style={[trailStatsStyles.iconBox, { backgroundColor: `${COLORS.primary}15` }]}>
          <Ionicons name="trail-sign" size={22} color={COLORS.primary} />
        </View>
        <View style={trailStatsStyles.statContent}>
          <Text style={[trailStatsStyles.statLabel, { color: COLORS.textLight }]}>Distance</Text>
          <Text style={[trailStatsStyles.statValue, { color: COLORS.text }]}>
            {formatDistanceShort(oneWayMiles)}
          </Text>
          <Text style={[trailStatsStyles.statSubtext, { color: COLORS.textLight }]}>
            {trail.route_type === 'loop' 
              ? 'Loop Trail' 
              : `${formatDistanceShort(roundTripMiles)} round trip`}
          </Text>
        </View>
      </View>

      {/* Elevation */}
      <View style={trailStatsStyles.statGroup}>
        <View style={[trailStatsStyles.iconBox, { backgroundColor: `${COLORS.primary}15` }]}>
          <Ionicons name="trending-up" size={22} color={COLORS.primary} />
        </View>
        <View style={trailStatsStyles.statContent}>
          <Text style={[trailStatsStyles.statLabel, { color: COLORS.textLight }]}>Elevation Gain</Text>
          <Text style={[trailStatsStyles.statValue, { color: COLORS.text }]}>
            {formatElevationShort(trail.elevation_gain_ft || 0)}
          </Text>
          <Text style={[trailStatsStyles.statSubtext, { color: COLORS.textLight }]}>
            {getSteepness()} climb
          </Text>
        </View>
      </View>

      {/* Time Estimate */}
      <View style={trailStatsStyles.statGroup}>
        <View style={[trailStatsStyles.iconBox, { backgroundColor: `${COLORS.primary}15` }]}>
          <Ionicons name="time" size={22} color={COLORS.primary} />
        </View>
        <View style={trailStatsStyles.statContent}>
          <Text style={[trailStatsStyles.statLabel, { color: COLORS.textLight }]}>Estimated Time</Text>
          <Text style={[trailStatsStyles.statValue, { color: COLORS.text }]}>
            {formatTime(oneWayHours)}
          </Text>
          <Text style={[trailStatsStyles.statSubtext, { color: COLORS.textLight }]}>
            {trail.route_type === 'loop' 
              ? 'Complete loop' 
              : `${formatTime(roundTripHours)} round trip`}
          </Text>
        </View>
      </View>

      {/* Trail Type */}
      <View style={trailStatsStyles.statGroup}>
        <View style={[trailStatsStyles.iconBox, { backgroundColor: `${COLORS.primary}15` }]}>
          <Ionicons name="git-network" size={22} color={COLORS.primary} />
        </View>
        <View style={trailStatsStyles.statContent}>
          <Text style={[trailStatsStyles.statLabel, { color: COLORS.textLight }]}>Route Type</Text>
          <Text style={[trailStatsStyles.statValue, { color: COLORS.text }]}>
            {getTrailType()}
          </Text>
          <Text style={[trailStatsStyles.statSubtext, { color: COLORS.textLight }]}>
            {trail.surface_type || 'Mixed terrain'}
          </Text>
        </View>
      </View>

      {/* Popularity */}
      <View style={trailStatsStyles.statGroup}>
        <View style={[trailStatsStyles.iconBox, { backgroundColor: `${COLORS.primary}15` }]}>
          <Ionicons name="people" size={22} color={COLORS.primary} />
        </View>
        <View style={trailStatsStyles.statContent}>
          <Text style={[trailStatsStyles.statLabel, { color: COLORS.textLight }]}>Popularity</Text>
          <Text style={[trailStatsStyles.statValue, { color: COLORS.text }]}>
            {trail.popularity || 'Moderate'} traffic
          </Text>
          <Text style={[trailStatsStyles.statSubtext, { color: COLORS.textLight }]}>
            Best time: {trail.best_time || 'Morning'}
          </Text>
        </View>
      </View>
    </View>
  );
}