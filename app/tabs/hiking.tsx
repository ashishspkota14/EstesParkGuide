import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import TrailCard from '../../src/components/trail/TrailCard';
import { HikingStyles } from '../../src/styles/screens/hiking.styles';
import { COLORS } from '../../src/constants/colors';

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

export default function HikingScreen() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Get API URL from environment variable
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchTrails();
  }, []);

  const fetchTrails = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/trails`);
      const data = await response.json();
      
      if (data.success) {
        // Filter out test trails
        const realTrails = data.data.filter(
          (trail: Trail) => trail.slug !== 'test-trail' && trail.slug !== 'test-trail-2'
        );
        setTrails(realTrails);
      } else {
        setError('Failed to load trails');
      }
    } catch (err) {
      console.error('Error fetching trails:', err);
      setError('Unable to connect to server. Make sure backend is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTrails();
  };

  const handleTrailPress = (trail: Trail) => {
    router.push(`/trail/${trail.slug}`);
  };

  if (loading) {
    return (
      <View style={HikingStyles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={HikingStyles.loadingText}>Loading trails...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={HikingStyles.centerContainer}>
        <Text style={HikingStyles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity style={HikingStyles.retryButton} onPress={fetchTrails}>
          <Text style={HikingStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={HikingStyles.container}>
      {/* Header */}
      <View style={HikingStyles.header}>
        <Text style={HikingStyles.headerTitle}>🥾 Trails</Text>
        <Text style={HikingStyles.headerSubtitle}>{trails.length} trails available</Text>
      </View>

      {/* Trail List */}
      <FlatList
        data={trails}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrailCard trail={item} onPress={() => handleTrailPress(item)} />
        )}
        contentContainerStyle={HikingStyles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={HikingStyles.emptyContainer}>
            <Text style={HikingStyles.emptyText}>No trails found</Text>
          </View>
        }
      />
    </View>
  );
}