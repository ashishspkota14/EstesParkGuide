import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useColors } from '../../src/context/ThemeContext';
import { supabase } from '../../src/services/supabase/client';
import { favoritesStyles } from '../../src/styles/screens/favorites.styles';
import TrailCard from '../../src/components/trail/TrailCard';

export default function FavoritesScreen() {
  const { user } = useAuth();
  const COLORS = useColors();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [user])
  );

  const fetchFavorites = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          created_at,
          trails (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedFavorites = data
        .filter((fav: any) => fav.trails !== null)
        .map((fav: any) => ({
          ...fav.trails,
          favorite_id: fav.id,
          favorited_at: fav.created_at
        }));

      setFavorites(formattedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  }, [user]);

  const handleFavoriteChange = () => {
    fetchFavorites();
  };

  const renderEmpty = () => {
    if (!user) {
      return (
        <View style={favoritesStyles.emptyContainer}>
          <View style={[favoritesStyles.iconCircle, { backgroundColor: `${COLORS.primary}15` }]}>
            <Ionicons name="heart-outline" size={48} color={COLORS.border} />
          </View>
          <Text style={[favoritesStyles.emptyTitle, { color: COLORS.text }]}>
            Save Your Favorite Trails
          </Text>
          <Text style={[favoritesStyles.emptyText, { color: COLORS.textLight }]}>
            Sign in to save trails and access them anytime, even offline.
          </Text>
          <TouchableOpacity
            style={[favoritesStyles.signInButton, { backgroundColor: COLORS.primary }]}
            onPress={() => router.push({
              pathname: '/(auth)/login',
              params: { returnTo: 'favorites' }
            })}
            activeOpacity={0.8}
          >
            <Text style={favoritesStyles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={favoritesStyles.emptyContainer}>
        <View style={[favoritesStyles.iconCircle, { backgroundColor: `${COLORS.primary}15` }]}>
          <Ionicons name="bookmark-outline" size={48} color={COLORS.border} />
        </View>
        <Text style={[favoritesStyles.emptyTitle, { color: COLORS.text }]}>
          No Favorites Yet
        </Text>
        <Text style={[favoritesStyles.emptyText, { color: COLORS.textLight }]}>
          Tap the bookmark icon on any trail to save it here for quick access.
        </Text>
        <TouchableOpacity
          style={[favoritesStyles.exploreButton, { backgroundColor: COLORS.primary }]}
          onPress={() => router.push('/tabs/hiking')}
          activeOpacity={0.8}
        >
          <Text style={favoritesStyles.exploreButtonText}>Explore Trails</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[favoritesStyles.loader, { backgroundColor: COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={[favoritesStyles.container, { backgroundColor: COLORS.background }]}>
      <View style={[favoritesStyles.header, { backgroundColor: COLORS.background }]}>
        <Text style={[favoritesStyles.title, { color: COLORS.text }]}>Favorites</Text>
        {favorites.length > 0 && (
          <Text style={[favoritesStyles.count, { color: COLORS.textLight }]}>
            {favorites.length} {favorites.length === 1 ? 'Trail' : 'Trails'}
          </Text>
        )}
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.favorite_id}
        renderItem={({ item }) => (
          <View style={favoritesStyles.cardContainer}>
            <TrailCard 
              trail={item}
              onFavoriteChange={handleFavoriteChange}
            />
          </View>
        )}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={favorites.length === 0 && favoritesStyles.emptyList}
      />
    </View>
  );
}