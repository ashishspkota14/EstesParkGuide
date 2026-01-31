import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  Alert,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useAuth } from '../../src/context/AuthContext';
import { COLORS } from '../../src/constants/colors';
import { supabase } from '../../src/services/supabase/client';
import TrailCard from '../../src/components/trail/TrailCard';
import Settings from '../../src/components/common/Settings';
import ProfilePhotoUpload from '../../src/components/profile/ProfilePhotoUpload';
import AchievementBadges from '../../src/components/profile/AchievementBadges';
import { profileStyles } from '../../src/styles/screens/profile.styles';

interface CompletedHike {
  id: string;
  name: string;
  distance_miles: number;
  elevation_gain_ft: number;
  difficulty: string;
  image_main: string;
  completed_at: string;
}

interface UserReview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  trail: {
    id: string;
    name: string;
    image_main: string;
  };
}

interface UserPhoto {
  id: string;
  photo_url: string;
  caption: string;
  trail_name: string;
  created_at: string;
}

// Hiker levels based on stats
const HIKER_LEVELS = [
  { name: 'Beginner', minHikes: 0, icon: '🥾', color: '#94A3B8' },
  { name: 'Explorer', minHikes: 5, icon: '🏕️', color: '#22C55E' },
  { name: 'Trailblazer', minHikes: 15, icon: '⛰️', color: '#3B82F6' },
  { name: 'Summit Master', minHikes: 30, icon: '🏔️', color: '#F59E0B' },
  { name: 'Mountain Legend', minHikes: 50, icon: '👑', color: '#8B5CF6' },
];

export default function ProfileScreen() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'completed' | 'reviews' | 'photos'>('completed');
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedHikes, setCompletedHikes] = useState<CompletedHike[]>([]);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [userPhotos, setUserPhotos] = useState<UserPhoto[]>([]);
  const [stats, setStats] = useState({ hikes: 0, miles: 0, vert: 0 });
  const [profile, setProfile] = useState<any>(null);

  // Calculate hiker level based on completed hikes
  const getHikerLevel = () => {
    const level = [...HIKER_LEVELS].reverse().find(l => stats.hikes >= l.minHikes);
    return level || HIKER_LEVELS[0];
  };

  const fetchData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);

      // Fetch completed hikes with stats
      const { data: statsData } = await supabase
        .from('completed_trails')
        .select('trails(distance_miles, elevation_gain_ft)')
        .eq('user_id', user.id);

      if (statsData) {
        const miles = statsData.reduce((acc, curr: any) => acc + (curr.trails?.distance_miles || 0), 0);
        const vert = statsData.reduce((acc, curr: any) => acc + (curr.trails?.elevation_gain_ft || 0), 0);
        setStats({
          hikes: statsData.length,
          miles: Number(miles.toFixed(1)),
          vert: Math.round(vert)
        });
      }

      // Fetch completed hikes list
      const { data: hikesData } = await supabase
        .from('completed_trails')
        .select('completed_at, trails (*)')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (hikesData) {
        const formatted = hikesData
          .filter((item: any) => item.trails !== null)
          .map((item: any) => ({ ...item.trails, completed_at: item.completed_at }));
        setCompletedHikes(formatted);
      }

      // Fetch user reviews
      const { data: reviewsData } = await supabase
        .from('trail_reviews')
        .select(`
          id, rating, comment, created_at,
          trails:trail_id (id, name, image_main)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (reviewsData) {
        setUserReviews(reviewsData.map((r: any) => ({
          ...r,
          trail: r.trails
        })));
      }

      // Fetch user photos
      const { data: photosData } = await supabase
        .from('user_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (photosData) {
        setUserPhotos(photosData);
      }

    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSignIn = () => {
    router.push({
      pathname: '/(auth)/login',
      params: { returnTo: 'profile' }
    });
  };

  // Guest view - Sign in prompt
  if (!user) {
    return (
      <SafeAreaView style={profileStyles.container} edges={['top']}>
        <View style={profileStyles.guestContainer}>
          <View style={profileStyles.guestIconCircle}>
            <Ionicons name="person-outline" size={60} color={COLORS.primary} />
          </View>
          <Text style={profileStyles.guestTitle}>Your Hiking Profile</Text>
          <Text style={profileStyles.guestText}>
            Sign in to track your adventures, earn badges, upload photos, and compete for weekly Starbucks rewards!
          </Text>
          
          <TouchableOpacity 
            style={profileStyles.signInButton}
            onPress={handleSignIn}
            activeOpacity={0.8}
          >
            <Text style={profileStyles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={profileStyles.createAccountButton}
            onPress={() => router.push({
              pathname: '/(auth)/sign-up',
              params: { returnTo: 'profile' }
            })}
            activeOpacity={0.8}
          >
            <Text style={profileStyles.createAccountText}>Create Account</Text>
          </TouchableOpacity>

          {/* Feature highlights */}
          <View style={profileStyles.featureList}>
            <View style={profileStyles.featureItem}>
              <Ionicons name="trophy" size={24} color={COLORS.primary} />
              <Text style={profileStyles.featureText}>Earn achievement badges</Text>
            </View>
            <View style={profileStyles.featureItem}>
              <Ionicons name="camera" size={24} color={COLORS.primary} />
              <Text style={profileStyles.featureText}>Upload photos for Starbucks rewards</Text>
            </View>
            <View style={profileStyles.featureItem}>
              <Ionicons name="stats-chart" size={24} color={COLORS.primary} />
              <Text style={profileStyles.featureText}>Track your hiking stats</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const hikerLevel = getHikerLevel();
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Hiker';

  const renderHeader = () => (
    <View style={profileStyles.headerContainer}>
      {/* Top Row */}
      <View style={profileStyles.topRow}>
        <Text style={profileStyles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => setShowSettings(true)}>
          <Ionicons name="settings-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={profileStyles.profileInfo}>
        {/* Avatar with edit button */}
        <ProfilePhotoUpload 
          currentPhoto={profile?.avatar_url}
          onPhotoUpdated={fetchData}
        />
        
        <Text style={profileStyles.name}>{displayName}</Text>
        
        {/* Hiker Level Badge */}
        <View style={[profileStyles.levelBadge, { backgroundColor: hikerLevel.color }]}>
          <Text style={profileStyles.levelIcon}>{hikerLevel.icon}</Text>
          <Text style={profileStyles.levelText}>{hikerLevel.name}</Text>
        </View>

        {/* Stats Row */}
        <View style={profileStyles.statsRow}>
          <View style={profileStyles.statBox}>
            <Text style={profileStyles.statVal}>{stats.hikes}</Text>
            <Text style={profileStyles.statLab}>Hikes</Text>
          </View>
          <View style={[profileStyles.statBox, profileStyles.statDivider]}>
            <Text style={profileStyles.statVal}>{stats.miles}</Text>
            <Text style={profileStyles.statLab}>Miles</Text>
          </View>
          <View style={profileStyles.statBox}>
            <Text style={profileStyles.statVal}>{stats.vert.toLocaleString()}</Text>
            <Text style={profileStyles.statLab}>Vert ft</Text>
          </View>
        </View>
      </View>

      {/* Achievement Badges Preview */}
      <AchievementBadges stats={stats} />

      {/* Starbucks Reward Card */}
      <TouchableOpacity 
        style={profileStyles.rewardCard}
        onPress={() => setActiveTab('photos')}
        activeOpacity={0.9}
      >
        <View style={profileStyles.rewardIconWrap}>
          <Text style={profileStyles.rewardIcon}>☕</Text>
        </View>
        <View style={profileStyles.rewardContent}>
          <Text style={profileStyles.rewardTitle}>Win Free Starbucks!</Text>
          <Text style={profileStyles.rewardText}>
            Upload trail photos for a chance to win coffee every week
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
      </TouchableOpacity>

      {/* Tab Wrapper */}
      <View style={profileStyles.tabWrapper}>
        <TouchableOpacity 
          onPress={() => setActiveTab('completed')}
          style={[profileStyles.tab, activeTab === 'completed' && profileStyles.activeTab]}
        >
          <Ionicons 
            name="checkmark-circle" 
            size={18} 
            color={activeTab === 'completed' ? COLORS.primary : COLORS.textLight} 
          />
          <Text style={[profileStyles.tabText, activeTab === 'completed' && profileStyles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setActiveTab('reviews')}
          style={[profileStyles.tab, activeTab === 'reviews' && profileStyles.activeTab]}
        >
          <Ionicons 
            name="star" 
            size={18} 
            color={activeTab === 'reviews' ? COLORS.primary : COLORS.textLight} 
          />
          <Text style={[profileStyles.tabText, activeTab === 'reviews' && profileStyles.activeTabText]}>
            Reviews
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setActiveTab('photos')}
          style={[profileStyles.tab, activeTab === 'photos' && profileStyles.activeTab]}
        >
          <Ionicons 
            name="images" 
            size={18} 
            color={activeTab === 'photos' ? COLORS.primary : COLORS.textLight} 
          />
          <Text style={[profileStyles.tabText, activeTab === 'photos' && profileStyles.activeTabText]}>
            Photos
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCompletedEmpty = () => (
    <View style={profileStyles.emptyContainer}>
      <View style={profileStyles.emptyIconCircle}>
        <Ionicons name="trail-sign-outline" size={40} color={COLORS.primary} />
      </View>
      <Text style={profileStyles.emptyTitle}>No Hikes Yet</Text>
      <Text style={profileStyles.emptyText}>
        Your adventure starts here! Find a trail and tap "Start Hike" to begin tracking.
      </Text>
      <TouchableOpacity 
        style={profileStyles.exploreButton}
        onPress={() => router.push('/tabs/hiking')}
        activeOpacity={0.8}
      >
        <Text style={profileStyles.exploreButtonText}>Explore Trails</Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderReviewsEmpty = () => (
    <View style={profileStyles.emptyContainer}>
      <View style={profileStyles.emptyIconCircle}>
        <Ionicons name="chatbubbles-outline" size={40} color={COLORS.primary} />
      </View>
      <Text style={profileStyles.emptyTitle}>Share Your Wisdom</Text>
      <Text style={profileStyles.emptyText}>
        Your reviews help fellow hikers find the best trails and stay safe.
      </Text>
      <TouchableOpacity 
        style={profileStyles.exploreButton}
        onPress={() => router.push('/tabs/hiking')}
        activeOpacity={0.8}
      >
        <Text style={profileStyles.exploreButtonText}>Write a Review</Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderPhotosSection = () => (
    <View style={profileStyles.photosSection}>
      {/* Upload Card */}
      <TouchableOpacity 
        style={profileStyles.uploadCard}
        onPress={() => Alert.alert('Coming Soon', 'Photo upload feature will be available soon!')}
        activeOpacity={0.8}
      >
        <View style={profileStyles.uploadIconCircle}>
          <Ionicons name="cloud-upload-outline" size={32} color={COLORS.primary} />
        </View>
        <Text style={profileStyles.uploadTitle}>Upload Trail Photos</Text>
        <Text style={profileStyles.uploadText}>
          Share your hiking memories and enter our weekly Starbucks giveaway! ☕
        </Text>
        <View style={profileStyles.uploadButton}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={profileStyles.uploadButtonText}>Add Photos</Text>
        </View>
      </TouchableOpacity>

      {/* User Photos Grid */}
      {userPhotos.length > 0 ? (
        <View style={profileStyles.photosGrid}>
          {userPhotos.map((photo) => (
            <TouchableOpacity key={photo.id} style={profileStyles.photoItem}>
              <Image source={{ uri: photo.photo_url }} style={profileStyles.photoImage} />
              {photo.trail_name && (
                <View style={profileStyles.photoOverlay}>
                  <Text style={profileStyles.photoTrailName} numberOfLines={1}>
                    {photo.trail_name}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={profileStyles.noPhotosContainer}>
          <Text style={profileStyles.noPhotosText}>
            No photos uploaded yet. Be the first to share your trail adventures!
          </Text>
        </View>
      )}
    </View>
  );

  const renderReviewItem = ({ item }: { item: UserReview }) => (
    <TouchableOpacity 
      style={profileStyles.reviewCard}
      onPress={() => router.push({
        pathname: '/(screens)/trail-detail',
        params: { id: item.trail?.id }
      })}
      activeOpacity={0.8}
    >
      {item.trail?.image_main && (
        <Image source={{ uri: item.trail.image_main }} style={profileStyles.reviewImage} />
      )}
      <View style={profileStyles.reviewContent}>
        <Text style={profileStyles.reviewTrailName} numberOfLines={1}>
          {item.trail?.name || 'Trail'}
        </Text>
        <View style={profileStyles.reviewStars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= item.rating ? 'star' : 'star-outline'}
              size={14}
              color={star <= item.rating ? '#FFB800' : '#ddd'}
            />
          ))}
        </View>
        <Text style={profileStyles.reviewComment} numberOfLines={2}>
          {item.comment}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={profileStyles.container} edges={['top']}>
        <View style={profileStyles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={profileStyles.container} edges={['top']}>
      {activeTab === 'photos' ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderHeader()}
          {renderPhotosSection()}
        </ScrollView>
      ) : activeTab === 'completed' ? (
        <FlatList
          data={completedHikes}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderCompletedEmpty}
          renderItem={({ item }) => (
            <View style={profileStyles.cardPadding}>
              <TrailCard trail={item} onPress={() => router.push({
                pathname: '/(screens)/trail-detail',
                params: { id: item.id }
              })} />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={profileStyles.listContent}
        />
      ) : (
        <FlatList
          data={userReviews}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderReviewsEmpty}
          renderItem={renderReviewItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={profileStyles.listContent}
        />
      )}
      
      <Modal visible={showSettings} animationType="slide">
        <Settings onClose={() => setShowSettings(false)} />
      </Modal>
    </SafeAreaView>
  );
}