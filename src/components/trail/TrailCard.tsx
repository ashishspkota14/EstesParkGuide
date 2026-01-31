import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase/client';
import { useAuth } from '../../context/AuthContext';
import { useColors } from '../../context/ThemeContext';
import { useUnits } from '../../context/UnitsContext';
import { trailCardStyles } from '../../styles/components/trailCard.styles';

interface TrailCardProps {
  trail: any;
  onPress?: () => void;
  onFavoriteChange?: () => void;
  variant?: 'default' | 'featured';
}

export default function TrailCard({ trail, onPress, onFavoriteChange, variant = 'default' }: TrailCardProps) {
  const { user } = useAuth();
  const COLORS = useColors();
  const { formatDistanceShort, formatElevationShort } = useUnits();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) checkFavoriteStatus();
  }, [user, trail.id]);

  const checkFavoriteStatus = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('trail_id', trail.id)
        .single();
      setIsFavorite(!!data);
    } catch (error) {
      setIsFavorite(false);
    }
  };

  const toggleFavorite = async (e: any) => {
    e.stopPropagation();
    if (!user) {
      router.push('/(auth)/login');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('trail_id', trail.id);
        setIsFavorite(false);
      } else {
        await supabase.from('favorites').insert({ user_id: user.id, trail_id: trail.id });
        setIsFavorite(true);
      }
      if (onFavoriteChange) onFavoriteChange();
    } catch (error) {
      console.error('Favorite error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    router.push({
      pathname: "/trail-detail",
      params: { id: trail.id }
    });
  };

  // Calculate estimated time (assume 2 mph average hiking speed)
  const getEstimatedTime = () => {
    const miles = trail.distance_miles || 0;
    const hours = miles / 2;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  // Get actual rating from trail data
  const getRating = () => {
    if (trail.avg_rating) return trail.avg_rating.toFixed(1);
    if (trail.rating && typeof trail.rating === 'number') return trail.rating.toFixed(1);
    if (trail.trail_reviews?.length > 0) {
      const avg = trail.trail_reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / trail.trail_reviews.length;
      return avg.toFixed(1);
    }
    return null;
  };

  // Get review count
  const getReviewCount = () => {
    if (trail.review_count !== undefined) return trail.review_count;
    if (trail.trail_reviews?.length !== undefined) return trail.trail_reviews.length;
    return 0;
  };

  // Get route type label - shows for ALL route types
  const getRouteType = () => {
    switch(trail.route_type) {
      case 'loop': return 'Loop';
      case 'out_and_back': 
      case 'out-and-back': return 'Out & Back';
      case 'point_to_point': 
      case 'point-to-point': return 'Point to Point';
      default: return null;
    }
  };

  // Difficulty colors - clean light backgrounds
  const getDifficultyStyle = () => {
    switch (trail.difficulty?.toLowerCase()) {
      case 'easy':
        return { bg: '#DCFCE7', text: '#15803D' };
      case 'moderate':
        return { bg: '#FEF3C7', text: '#B45309' };
      case 'hard':
        return { bg: '#FEE2E2', text: '#B91C1C' };
      default:
        return { bg: '#F3F4F6', text: COLORS.textLight };
    }
  };

  const photo = trail.image_main || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4';
  const rating = getRating();
  const reviewCount = getReviewCount();
  const diffStyle = getDifficultyStyle();
  const routeType = getRouteType();

  return (
    <TouchableOpacity 
      style={[
        trailCardStyles.card,
        { backgroundColor: COLORS.background }, // Lightest theme color
        variant === 'featured' && trailCardStyles.featuredCard
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Clean Image Container */}
      <View style={trailCardStyles.imageContainer}>
        <Image source={{ uri: photo }} style={trailCardStyles.image} />
        
        {/* Clean Bookmark Button */}
        <TouchableOpacity
          style={trailCardStyles.bookmarkButton}
          onPress={toggleFavorite}
          disabled={loading}
          activeOpacity={0.7}
        >
          <View style={[
            trailCardStyles.bookmarkBg, 
            isFavorite && { backgroundColor: COLORS.primary }
          ]}>
            <Ionicons
              name={isFavorite ? 'bookmark' : 'bookmark-outline'}
              size={16}
              color={isFavorite ? '#fff' : COLORS.text}
            />
          </View>
        </TouchableOpacity>

        {/* Route Type Badge - Lightest theme color */}
        {routeType && (
          <View style={[trailCardStyles.routeTypeBadge, { backgroundColor: COLORS.background }]}>
            <Ionicons name="git-compare-outline" size={10} color={COLORS.textLight} />
            <Text style={[trailCardStyles.routeTypeText, { color: COLORS.text }]}>{routeType}</Text>
          </View>
        )}

        {/* Dog Friendly Badge - Lightest theme color */}
        {trail.dog_friendly && (
          <View style={[trailCardStyles.dogBadge, { backgroundColor: COLORS.background }]}>
            <Ionicons name="paw" size={12} color="#F97316" />
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={trailCardStyles.content}>
        {/* Trail Name */}
        <View style={trailCardStyles.header}>
          <Text style={[trailCardStyles.name, { color: COLORS.text }]} numberOfLines={1}>
            {trail.name}
          </Text>
        </View>

        {/* Rating Row with Stars */}
        {rating && (
          <View style={trailCardStyles.ratingRow}>
            <View style={trailCardStyles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= Math.round(parseFloat(rating)) ? 'star' : 'star-outline'}
                  size={12}
                  color={star <= Math.round(parseFloat(rating)) ? '#FBBF24' : '#D1D5DB'}
                  style={{ marginRight: 1 }}
                />
              ))}
            </View>
            <Text style={[trailCardStyles.ratingText, { color: COLORS.text }]}>{rating}</Text>
            <Text style={[trailCardStyles.reviewCount, { color: COLORS.textLight }]}>
              ({reviewCount})
            </Text>
          </View>
        )}

        {/* Stats Row - Distance, Elevation, Time */}
        <View style={trailCardStyles.statsRow}>
          <View style={trailCardStyles.statItem}>
            <Ionicons name="resize-outline" size={12} color={COLORS.textLight} />
            <Text style={[trailCardStyles.statText, { color: COLORS.textLight }]}>
              {formatDistanceShort(trail.distance_miles || 0)}
            </Text>
          </View>
          
          <View style={trailCardStyles.statDivider} />
          
          <View style={trailCardStyles.statItem}>
            <Ionicons name="trending-up" size={12} color={COLORS.textLight} />
            <Text style={[trailCardStyles.statText, { color: COLORS.textLight }]}>
              {formatElevationShort(trail.elevation_gain_ft || 0)}
            </Text>
          </View>
          
          <View style={trailCardStyles.statDivider} />
          
          <View style={trailCardStyles.statItem}>
            <Ionicons name="time-outline" size={12} color={COLORS.textLight} />
            <Text style={[trailCardStyles.statText, { color: COLORS.textLight }]}>
              {getEstimatedTime()}
            </Text>
          </View>
        </View>

        {/* Footer - Difficulty Badge & Location */}
        <View style={trailCardStyles.footer}>
          <View style={[trailCardStyles.difficultyBadge, { backgroundColor: diffStyle.bg }]}>
            <Text style={[trailCardStyles.difficultyText, { color: diffStyle.text }]}>
              {trail.difficulty || 'Unknown'}
            </Text>
          </View>
          
          {trail.park_area && (
            <View style={trailCardStyles.locationContainer}>
              <Ionicons name="location-outline" size={11} color={COLORS.textLight} />
              <Text style={[trailCardStyles.locationText, { color: COLORS.textLight }]} numberOfLines={1}>
                {trail.park_area}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}