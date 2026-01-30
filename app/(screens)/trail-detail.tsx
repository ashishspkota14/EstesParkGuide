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
import TrailConditions from '../../src/components/trail/TrailConditions';
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
      console.log('📍 Navigating to ID:', id);
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
            user_id,
            profiles (
              id, 
              full_name, 
              avatar_url
            ),
            review_photos!review_photos_review_id_fkey (
              id,
              photo_url
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setTrail(data);
    } catch (error) {
      console.error('Error fetching trail:', error);
      Alert.alert('Error', 'Failed to load trail details.');
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
      router.push({
        pathname: '/(auth)/login',
        params: { returnTo: 'trail', trailId: id as string }
      });
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
    return trail?.park_area || 'Rocky Mountain National Park';
  };

  // Collect all review photos to use in carousel
  const getReviewPhotos = (): string[] => {
    if (!trail?.trail_reviews) return [];
    
    const photos: string[] = [];
    trail.trail_reviews.forEach((review: any) => {
      if (review.review_photos && review.review_photos.length > 0) {
        review.review_photos.forEach((photo: any) => {
          if (photo.photo_url) {
            photos.push(photo.photo_url);
          }
        });
      }
    });
    return photos;
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

  // Get user-uploaded review photos for carousel
  const reviewPhotos = getReviewPhotos();

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
          {/* PhotoCarousel now receives reviewPhotos as optional prop */}
          <PhotoCarousel photos={trail} reviewPhotos={reviewPhotos} />

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
          <TrailConditions trail={trail} />
          
          {/* Reviews Section - Always at bottom */}
          <ReviewsList 
            reviews={trail.trail_reviews || []} 
            trailId={trail.id}
            onReviewChanged={fetchTrailDetails}
          />

          {/* Spacer for floating buttons */}
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