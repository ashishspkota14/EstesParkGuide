import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Your Project's Correct Imports
import { supabase } from '../../src/services/supabase/client';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS } from '../../src/constants/colors';
import { trailDetailStyles } from '../../src/styles/screens/trail-detail.styles';
import PhotoCarousel from '../../src/components/trail/PhotoCarousel';
import TrailStats from '../../src/components/trail/TrailStats';
import TrailMapPreview from '../../src/components/trail/TrailMapPreview';
import TrailWeather from '../../src/components/trail/TrailWeather';
import ReviewsList from '../../src/components/trail/ReviewsList';
import FloatingActions from '../../src/components/trail/FloatingActions';
import DifficultyBadge from '../../src/components/trail/DifficultyBadge';
import { confirmAndNavigate } from '../../src/utils/navigation';

export default function TrailDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [trail, setTrail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTrailDetails();
      if (user) checkFavoriteStatus();
    }
  }, [id, user]);

  const fetchTrailDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trails')
        .select(`
          *,
          trail_reviews (
            id,
            rating,
            comment,
            created_at,
            profiles (
              id, 
              full_name, 
              avatar_url
            ),
            review_photos!fk_review (photo_url)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setTrail(data);
    } catch (error) {
      console.error('Error fetching trail:', error);
      // We check for the specific PostgREST ambiguity error in the logs
      Alert.alert('Error', 'Failed to load trail details. Check database relationships.');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('trail_id', id)
        .single();
      
      setIsFavorite(!!data);
    } catch (error) {
      setIsFavorite(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to save favorites');
      router.push('/(auth)/login');
      return;
    }

    try {
      if (isFavorite) {
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('trail_id', id);
        setIsFavorite(false);
      } else {
        await supabase.from('favorites').insert({ user_id: user.id, trail_id: id });
        setIsFavorite(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

const handleStartTrail = () => {
  confirmAndNavigate({
    latitude: trail.trailhead_lat,
    longitude: trail.trailhead_lon,
    trailName: trail.name,
  });
};

  const getParkName = () => {
    if (!trail) return 'Estes Park, Colorado';
    const name = trail.name.toLowerCase();
    const rmnpTrails = ['bear lake', 'emerald', 'dream', 'sky pond', 'loch'];
    if (rmnpTrails.some(keyword => name.includes(keyword))) {
      return 'Rocky Mountain National Park';
    }
    return 'Estes Park, Colorado';
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={trailDetailStyles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </>
    );
  }

  if (!trail) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={trailDetailStyles.loader}>
          <Text style={trailDetailStyles.errorText}>Trail not found</Text>
        </View>
      </>
    );
  }

  const avgRating = trail.trail_reviews?.length > 0
    ? trail.trail_reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / trail.trail_reviews.length
    : 0;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={trailDetailStyles.container}>
        <TouchableOpacity 
          style={trailDetailStyles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <ScrollView 
          style={trailDetailStyles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <PhotoCarousel photos={trail} />

          <View style={trailDetailStyles.header}>
            <View style={trailDetailStyles.headerTop}>
              <View style={trailDetailStyles.headerLeft}>
                <Text style={trailDetailStyles.title}>{trail.name}</Text>
                <View style={trailDetailStyles.locationRow}>
                  <Ionicons name="location" size={16} color={COLORS.textLight} />
                  <Text style={trailDetailStyles.location}>{getParkName()}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={toggleFavorite}>
                <Ionicons 
                  name={isFavorite ? 'heart' : 'heart-outline'} 
                  size={28} 
                  color={isFavorite ? COLORS.primary : COLORS.text}
                />
              </TouchableOpacity>
            </View>

            <View style={trailDetailStyles.tagsRow}>
              <View style={trailDetailStyles.ratingBox}>
                <Ionicons name="star" size={18} color="#FFB800" />
                <Text style={trailDetailStyles.ratingText}>
                  {avgRating.toFixed(1)} ({trail.trail_reviews?.length || 0})
                </Text>
              </View>
              <DifficultyBadge difficulty={trail.difficulty} />
              {trail.dog_friendly && (
                <View style={trailDetailStyles.tag}>
                  <Ionicons name="paw" size={14} color={COLORS.primary} />
                  <Text style={trailDetailStyles.tagText}>Dog Friendly</Text>
                </View>
              )}
            </View>
          </View>

          <TrailStats trail={trail} />

          <View style={trailDetailStyles.section}>
            <Text style={trailDetailStyles.sectionTitle}>About This Trail</Text>
            <Text style={trailDetailStyles.description}>
              {trail.description || 'A beautiful trail with stunning mountain views.'}
            </Text>
          </View>

          <TrailMapPreview trail={trail} />
          <TrailWeather trail={trail} />
          
          <ReviewsList 
            reviews={trail.trail_reviews || []} 
            trailId={trail.id}
            onReviewChanged={fetchTrailDetails}
          />

          <View style={{ height: 120 }} />
        </ScrollView>

        <FloatingActions 
          onStart={handleStartTrail}
          onDownload={() => Alert.alert('Download', 'Downloading for offline use...')}
        />
      </View>
    </>
  );
}