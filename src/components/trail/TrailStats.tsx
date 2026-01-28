import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { trailStatsStyles } from '../../styles/components/trailStats.styles';
import { COLORS } from '../../constants/colors';

interface TrailStatsProps {
  trail: any;
}

export default function TrailStats({ trail }: TrailStatsProps) {
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
    <View style={trailStatsStyles.container}>
      <Text style={trailStatsStyles.title}>Trail Information</Text>

      {/* Distance */}
      <View style={trailStatsStyles.statGroup}>
        <View style={trailStatsStyles.iconBox}>
          <Ionicons name="trail-sign" size={22} color={COLORS.primary} />
        </View>
        <View style={trailStatsStyles.statContent}>
          <Text style={trailStatsStyles.statLabel}>Distance</Text>
          <Text style={trailStatsStyles.statValue}>
            {oneWayMiles.toFixed(1)} miles
          </Text>
          <Text style={trailStatsStyles.statSubtext}>
            {trail.route_type === 'loop' 
              ? 'Loop Trail' 
              : `${roundTripMiles.toFixed(1)} miles round trip`}
          </Text>
        </View>
      </View>

      {/* Elevation */}
      <View style={trailStatsStyles.statGroup}>
        <View style={trailStatsStyles.iconBox}>
          <Ionicons name="trending-up" size={22} color={COLORS.primary} />
        </View>
        <View style={trailStatsStyles.statContent}>
          <Text style={trailStatsStyles.statLabel}>Elevation Gain</Text>
          <Text style={trailStatsStyles.statValue}>
            {trail.elevation_gain_ft?.toLocaleString() || 0} ft
          </Text>
          <Text style={trailStatsStyles.statSubtext}>
            {getSteepness()} climb
          </Text>
        </View>
      </View>

      {/* Time Estimate */}
      <View style={trailStatsStyles.statGroup}>
        <View style={trailStatsStyles.iconBox}>
          <Ionicons name="time" size={22} color={COLORS.primary} />
        </View>
        <View style={trailStatsStyles.statContent}>
          <Text style={trailStatsStyles.statLabel}>Estimated Time</Text>
          <Text style={trailStatsStyles.statValue}>
            {formatTime(oneWayHours)}
          </Text>
          <Text style={trailStatsStyles.statSubtext}>
            {trail.route_type === 'loop' 
              ? 'Complete loop' 
              : `${formatTime(roundTripHours)} round trip`}
          </Text>
        </View>
      </View>

      {/* Trail Type */}
      <View style={trailStatsStyles.statGroup}>
        <View style={trailStatsStyles.iconBox}>
          <Ionicons name="git-network" size={22} color={COLORS.primary} />
        </View>
        <View style={trailStatsStyles.statContent}>
          <Text style={trailStatsStyles.statLabel}>Route Type</Text>
          <Text style={trailStatsStyles.statValue}>
            {getTrailType()}
          </Text>
          <Text style={trailStatsStyles.statSubtext}>
            {trail.surface_type || 'Mixed terrain'}
          </Text>
        </View>
      </View>

      {/* Popularity */}
      <View style={trailStatsStyles.statGroup}>
        <View style={trailStatsStyles.iconBox}>
          <Ionicons name="people" size={22} color={COLORS.primary} />
        </View>
        <View style={trailStatsStyles.statContent}>
          <Text style={trailStatsStyles.statLabel}>Popularity</Text>
          <Text style={trailStatsStyles.statValue}>
            {trail.popularity || 'Moderate'} traffic
          </Text>
          <Text style={trailStatsStyles.statSubtext}>
            Best time: {trail.best_time || 'Morning'}
          </Text>
        </View>
      </View>
    </View>
  );
}