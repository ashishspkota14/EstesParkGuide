import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { TrailCardStyles } from '../../styles/components/trailCard.styles';

interface Trail {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  distance_miles: number;
  elevation_gain_ft: number;
  estimated_time_hours: number;
  image_main: string;
  avg_rating: number;
  total_reviews: number;
  kid_friendly: boolean;
  dog_friendly: boolean;
}

interface TrailCardProps {
  trail: Trail;
  onPress: () => void;
}

export default function TrailCard({ trail, onPress }: TrailCardProps) {
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

  const getDifficultyEmoji = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '🟢';
      case 'moderate':
        return '🟡';
      case 'hard':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <TouchableOpacity style={TrailCardStyles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Image */}
      <Image source={{ uri: trail.image_main }} style={TrailCardStyles.image} resizeMode="cover" />

      {/* Overlay gradient effect */}
      <View style={TrailCardStyles.imageOverlay} />

      {/* Content */}
      <View style={TrailCardStyles.content}>
        {/* Header Row */}
        <View style={TrailCardStyles.header}>
          <View style={TrailCardStyles.headerLeft}>
            <Text style={TrailCardStyles.name} numberOfLines={1}>
              {trail.name}
            </Text>
            {trail.total_reviews > 0 && (
              <View style={TrailCardStyles.ratingContainer}>
                <Text style={TrailCardStyles.rating}>⭐ {trail.avg_rating.toFixed(1)}</Text>
                <Text style={TrailCardStyles.reviews}>({trail.total_reviews})</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        <Text style={TrailCardStyles.description} numberOfLines={2}>
          {trail.short_description}
        </Text>

        {/* Stats Row */}
        <View style={TrailCardStyles.statsRow}>
          {/* Difficulty Badge */}
          <View
            style={[
              TrailCardStyles.difficultyBadge,
              { backgroundColor: getDifficultyColor(trail.difficulty) },
            ]}
          >
            <Text style={TrailCardStyles.difficultyText}>
              {getDifficultyEmoji(trail.difficulty)}{' '}
              {trail.difficulty.charAt(0).toUpperCase() + trail.difficulty.slice(1)}
            </Text>
          </View>

          {/* Trail Stats */}
          <View style={TrailCardStyles.stats}>
            <View style={TrailCardStyles.stat}>
              <Text style={TrailCardStyles.statIcon}>📏</Text>
              <Text style={TrailCardStyles.statText}>{trail.distance_miles} mi</Text>
            </View>
            <View style={TrailCardStyles.stat}>
              <Text style={TrailCardStyles.statIcon}>⛰️</Text>
              <Text style={TrailCardStyles.statText}>{trail.elevation_gain_ft} ft</Text>
            </View>
            <View style={TrailCardStyles.stat}>
              <Text style={TrailCardStyles.statIcon}>⏱️</Text>
              <Text style={TrailCardStyles.statText}>{trail.estimated_time_hours}h</Text>
            </View>
          </View>
        </View>

        {/* Tags Row */}
        {(trail.kid_friendly || trail.dog_friendly) && (
          <View style={TrailCardStyles.tagsRow}>
            {trail.kid_friendly && (
              <View style={TrailCardStyles.tag}>
                <Text style={TrailCardStyles.tagText}>👨‍👩‍👧‍👦 Family Friendly</Text>
              </View>
            )}
            {trail.dog_friendly && (
              <View style={TrailCardStyles.tag}>
                <Text style={TrailCardStyles.tagText}>🐕 Dog Friendly</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}