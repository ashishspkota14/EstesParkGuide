import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase/client';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/colors';
import { trailCardStyles } from '../../styles/components/trailCard.styles';
import DifficultyBadge from './DifficultyBadge';

interface TrailCardProps {
  trail: any;
  onPress?: () => void;
  onFavoriteChange?: () => void;
}

export default function TrailCard({ trail, onPress, onFavoriteChange }: TrailCardProps) {
  const { user } = useAuth();
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
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('trail_id', trail.id);
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, trail_id: trail.id });
        setIsFavorite(true);
      }
      
      if (onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (error) {
      console.error('Favorite error:', error);
    } finally {
      setLoading(false);
    }
  };

const handlePress = () => {
  console.log('📍 Navigating to ID:', trail.id);
  
  router.push({
    pathname: "/trail-detail",
    params: { id: trail.id }
  });
};
  const photo = trail.image_main || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4';

  return (
    <TouchableOpacity 
      style={trailCardStyles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={trailCardStyles.imageContainer}>
        <Image source={{ uri: photo }} style={trailCardStyles.image} />
        
        <TouchableOpacity
          style={trailCardStyles.bookmarkButton}
          onPress={toggleFavorite}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isFavorite ? COLORS.primary : '#fff'}
          />
        </TouchableOpacity>
      </View>

      <View style={trailCardStyles.content}>
        <View style={trailCardStyles.header}>
          <Text style={trailCardStyles.name} numberOfLines={1}>
            {trail.name}
          </Text>
          <View style={trailCardStyles.ratingBox}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text style={trailCardStyles.rating}>
              {trail.rating || '4.5'}
            </Text>
          </View>
        </View>

        <View style={trailCardStyles.details}>
          <View style={trailCardStyles.detailItem}>
            <Ionicons name="trail-sign" size={14} color={COLORS.textLight} />
            <Text style={trailCardStyles.detailText}>
              {trail.distance_miles?.toFixed(1)} mi
            </Text>
          </View>
          <View style={trailCardStyles.detailItem}>
            <Ionicons name="trending-up" size={14} color={COLORS.textLight} />
            <Text style={trailCardStyles.detailText}>
              {trail.elevation_gain_ft?.toLocaleString()} ft
            </Text>
          </View>
        </View>

        <View style={trailCardStyles.footer}>
          <DifficultyBadge difficulty={trail.difficulty} />
          {trail.dog_friendly && (
            <View style={trailCardStyles.tag}>
              <Ionicons name="paw" size={12} color={COLORS.primary} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}