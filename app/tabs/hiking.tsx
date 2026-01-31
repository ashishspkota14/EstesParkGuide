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
import { useColors } from '../../src/context/ThemeContext';
import { TrailSummary } from '../../src/types/trail.types';

export default function HikingScreen() {
  const COLORS = useColors();
  const [trails, setTrails] = useState<TrailSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

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
        const realTrails = data.data.filter(
          (trail: TrailSummary) => trail.slug !== 'test-trail' && trail.slug !== 'test-trail-2'
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

  const handleFavoriteChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTrailPress = (trail: TrailSummary) => {
    router.push(`/trail/${trail.slug}`);
  };

  if (loading) {
    return (
      <View style={[HikingStyles.centerContainer, { backgroundColor: COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[HikingStyles.loadingText, { color: COLORS.textLight }]}>Loading trails...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[HikingStyles.centerContainer, { backgroundColor: COLORS.background }]}>
        <Text style={[HikingStyles.errorText, { color: COLORS.danger || '#EF4444' }]}>⚠️ {error}</Text>
        <TouchableOpacity 
          style={[HikingStyles.retryButton, { backgroundColor: COLORS.primary }]} 
          onPress={fetchTrails}
        >
          <Text style={HikingStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[HikingStyles.container, { backgroundColor: COLORS.background }]}>
      {/* Header */}
      <View style={[HikingStyles.header, { backgroundColor: COLORS.background }]}>
        <Text style={[HikingStyles.headerTitle, { color: COLORS.text }]}>🥾 Trails</Text>
        <Text style={[HikingStyles.headerSubtitle, { color: COLORS.textLight }]}>
          {trails.length} trails available
        </Text>
      </View>

      {/* Trail List */}
      <FlatList
        key={refreshKey}
        data={trails}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrailCard 
            trail={item} 
            onPress={() => handleTrailPress(item)}
            onFavoriteChange={handleFavoriteChange}
          />
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
            <Text style={[HikingStyles.emptyText, { color: COLORS.textLight }]}>No trails found</Text>
          </View>
        }
      />
    </View>
  );
}