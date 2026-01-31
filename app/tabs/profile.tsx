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
import { useColors } from '../../src/context/ThemeContext';
import { useUnits } from '../../src/context/UnitsContext';
import { supabase } from '../../src/services/supabase/client';
import TrailCard from '../../src/components/trail/TrailCard';
import Settings from '../../src/components/profile/Settings';
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

const HIKER_LEVELS = [
  { name: 'Beginner', minHikes: 0, icon: '🥾', color: '#94A3B8' },
  { name: 'Explorer', minHikes: 5, icon: '🏕️', color: '#22C55E' },
  { name: 'Trailblazer', minHikes: 15, icon: '⛰️', color: '#3B82F6' },
  { name: 'Summit Master', minHikes: 30, icon: '🏔️', color: '#F59E0B' },
  { name: 'Mountain Legend', minHikes: 50, icon: '👑', color: '#8B5CF6' },
];

export default function ProfileScreen() {
  const { user } = useAuth();
  const COLORS = useColors();
  const { formatDistanceShort, formatElevationShort, getDistanceUnitShort, getElevationUnitShort } = useUnits();
  
  const [activeTab, setActiveTab] = useState<'completed' | 'reviews' | 'photos'>('completed');
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedHikes, setCompletedHikes] = useState<CompletedHike[]>([]);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [userPhotos, setUserPhotos] = useState<UserPhoto[]>([]);
  const [stats, setStats] = useState({ hikes: 0, miles: 0, vert: 0 });
  const [profile, setProfile] = useState<any>(null);

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

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);

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

  if (!user) {
    return (
      <SafeAreaView style={[profileStyles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
        <View style={profileStyles.guestContainer}>
          <View style={[profileStyles.guestIconCircle, { backgroundColor: `${COLORS.primary}15` }]}>
            <Ionicons name="person-outline" size={60} color={COLORS.primary} />
          </View>
          <Text style={[profileStyles.guestTitle, { color: COLORS.text }]}>Your Hiking Profile</Text>
          <Text style={[profileStyles.guestText, { color: COLORS.textLight }]}>
            Sign in to track your adventures, earn badges, upload photos, and compete for weekly Starbucks rewards!
          </Text>
          
          <TouchableOpacity 
            style={[profileStyles.signInButton, { backgroundColor: COLORS.primary }]}
            onPress={handleSignIn}
            activeOpacity={0.8}
          >
            <Text style={profileStyles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[profileStyles.createAccountButton, { borderColor: COLORS.primary }]}
            onPress={() => router.push({
              pathname: '/(auth)/sign-up',
              params: { returnTo: 'profile' }
            })}
            activeOpacity={0.8}
          >
            <Text style={[profileStyles.createAccountText, { color: COLORS.primary }]}>Create Account</Text>
          </TouchableOpacity>

          <View style={profileStyles.featureList}>
            <View style={profileStyles.featureItem}>
              <Ionicons name="trophy" size={24} color={COLORS.primary} />
              <Text style={[profileStyles.featureText, { color: COLORS.text }]}>Earn achievement badges</Text>
            </View>
            <View style={profileStyles.featureItem}>
              <Ionicons name="camera" size={24} color={COLORS.primary} />
              <Text style={[profileStyles.featureText, { color: COLORS.text }]}>Upload photos for Starbucks rewards</Text>
            </View>
            <View style={profileStyles.featureItem}>
              <Ionicons name="stats-chart" size={24} color={COLORS.primary} />
              <Text style={[profileStyles.featureText, { color: COLORS.text }]}>Track your hiking stats</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const hikerLevel = getHikerLevel();
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Hiker';

  const renderHeader = () => (
    <View style={[profileStyles.headerContainer, { backgroundColor: COLORS.background }]}>
      <View style={profileStyles.topRow}>
        <Text style={[profileStyles.headerTitle, { color: COLORS.text }]}>Profile</Text>
        <TouchableOpacity onPress={() => setShowSettings(true)}>
          <Ionicons name="settings-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={profileStyles.profileInfo}>
        <ProfilePhotoUpload 
          currentPhoto={profile?.avatar_url}
          onPhotoUpdated={fetchData}
        />
        
        <Text style={[profileStyles.name, { color: COLORS.text }]}>{displayName}</Text>
        
        <View style={[profileStyles.levelBadge, { backgroundColor: hikerLevel.color }]}>
          <Text style={profileStyles.levelIcon}>{hikerLevel.icon}</Text>
          <Text style={profileStyles.levelText}>{hikerLevel.name}</Text>
        </View>

        <View style={[profileStyles.statsRow, { backgroundColor: COLORS.white }]}>
          <View style={profileStyles.statBox}>
            <Text style={[profileStyles.statVal, { color: COLORS.text }]}>{stats.hikes}</Text>
            <Text style={[profileStyles.statLab, { color: COLORS.textLight }]}>Hikes</Text>
          </View>
          <View style={[profileStyles.statBox, profileStyles.statDivider, { borderColor: COLORS.border }]}>
            <Text style={[profileStyles.statVal, { color: COLORS.text }]}>{stats.miles}</Text>
            <Text style={[profileStyles.statLab, { color: COLORS.textLight }]}>{getDistanceUnitShort() === 'km' ? 'Km' : 'Miles'}</Text>
          </View>
          <View style={profileStyles.statBox}>
            <Text style={[profileStyles.statVal, { color: COLORS.text }]}>{stats.vert.toLocaleString()}</Text>
            <Text style={[profileStyles.statLab, { color: COLORS.textLight }]}>Vert {getElevationUnitShort()}</Text>
          </View>
        </View>
      </View>

      <AchievementBadges stats={stats} />

      <TouchableOpacity 
        style={[profileStyles.rewardCard, { backgroundColor: COLORS.primary }]}
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

      <View style={[profileStyles.tabWrapper, { backgroundColor: COLORS.white }]}>
        <TouchableOpacity 
          onPress={() => setActiveTab('completed')}
          style={[profileStyles.tab, activeTab === 'completed' && [profileStyles.activeTab, { borderBottomColor: COLORS.primary }]]}
        >
          <Ionicons 
            name="checkmark-circle" 
            size={18} 
            color={activeTab === 'completed' ? COLORS.primary : COLORS.textLight} 
          />
          <Text style={[profileStyles.tabText, { color: COLORS.textLight }, activeTab === 'completed' && { color: COLORS.primary }]}>
            Completed
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setActiveTab('reviews')}
          style={[profileStyles.tab, activeTab === 'reviews' && [profileStyles.activeTab, { borderBottomColor: COLORS.primary }]]}
        >
          <Ionicons 
            name="star" 
            size={18} 
            color={activeTab === 'reviews' ? COLORS.primary : COLORS.textLight} 
          />
          <Text style={[profileStyles.tabText, { color: COLORS.textLight }, activeTab === 'reviews' && { color: COLORS.primary }]}>
            Reviews
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setActiveTab('photos')}
          style={[profileStyles.tab, activeTab === 'photos' && [profileStyles.activeTab, { borderBottomColor: COLORS.primary }]]}
        >
          <Ionicons 
            name="images" 
            size={18} 
            color={activeTab === 'photos' ? COLORS.primary : COLORS.textLight} 
          />
          <Text style={[profileStyles.tabText, { color: COLORS.textLight }, activeTab === 'photos' && { color: COLORS.primary }]}>
            Photos
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCompletedEmpty = () => (
    <View style={profileStyles.emptyContainer}>
      <View style={[profileStyles.emptyIconCircle, { backgroundColor: `${COLORS.primary}15` }]}>
        <Ionicons name="trail-sign-outline" size={40} color={COLORS.primary} />
      </View>
      <Text style={[profileStyles.emptyTitle, { color: COLORS.text }]}>No Hikes Yet</Text>
      <Text style={[profileStyles.emptyText, { color: COLORS.textLight }]}>
        Your adventure starts here! Find a trail and tap "Start Hike" to begin tracking.
      </Text>
      <TouchableOpacity 
        style={[profileStyles.exploreButton, { backgroundColor: COLORS.primary }]}
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
      <View style={[profileStyles.emptyIconCircle, { backgroundColor: `${COLORS.primary}15` }]}>
        <Ionicons name="chatbubbles-outline" size={40} color={COLORS.primary} />
      </View>
      <Text style={[profileStyles.emptyTitle, { color: COLORS.text }]}>Share Your Wisdom</Text>
      <Text style={[profileStyles.emptyText, { color: COLORS.textLight }]}>
        Your reviews help fellow hikers find the best trails and stay safe.
      </Text>
      <TouchableOpacity 
        style={[profileStyles.exploreButton, { backgroundColor: COLORS.primary }]}
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
      <TouchableOpacity 
        style={[profileStyles.uploadCard, { backgroundColor: COLORS.white }]}
        onPress={() => Alert.alert('Coming Soon', 'Photo upload feature will be available soon!')}
        activeOpacity={0.8}
      >
        <View style={[profileStyles.uploadIconCircle, { backgroundColor: `${COLORS.primary}15` }]}>
          <Ionicons name="cloud-upload-outline" size={32} color={COLORS.primary} />
        </View>
        <Text style={[profileStyles.uploadTitle, { color: COLORS.text }]}>Upload Trail Photos</Text>
        <Text style={[profileStyles.uploadText, { color: COLORS.textLight }]}>
          Share your hiking memories and enter our weekly Starbucks giveaway! ☕
        </Text>
        <View style={[profileStyles.uploadButton, { backgroundColor: COLORS.primary }]}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={profileStyles.uploadButtonText}>Add Photos</Text>
        </View>
      </TouchableOpacity>

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
          <Text style={[profileStyles.noPhotosText, { color: COLORS.textLight }]}>
            No photos uploaded yet. Be the first to share your trail adventures!
          </Text>
        </View>
      )}
    </View>
  );

  const renderReviewItem = ({ item }: { item: UserReview }) => (
    <TouchableOpacity 
      style={[profileStyles.reviewCard, { backgroundColor: COLORS.white }]}
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
        <Text style={[profileStyles.reviewTrailName, { color: COLORS.text }]} numberOfLines={1}>
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
        <Text style={[profileStyles.reviewComment, { color: COLORS.textLight }]} numberOfLines={2}>
          {item.comment}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[profileStyles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
        <View style={profileStyles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[profileStyles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
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