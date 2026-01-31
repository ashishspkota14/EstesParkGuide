import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TrailCard from '../../src/components/trail/TrailCard';
import { useColors } from '../../src/context/ThemeContext';
import { supabase } from '../../src/services/supabase/client';
import { HikingStyles } from '../../src/styles/screens/hiking.styles';

// Difficulty filters - Easy/Moderate/Hard have specific colors, All uses theme
const DIFFICULTY_FILTERS = [
  { id: 'all', label: 'All', color: null, bgColor: null },
  { id: 'easy', label: 'Easy', color: '#15803D', bgColor: '#DCFCE7' },
  { id: 'moderate', label: 'Moderate', color: '#B45309', bgColor: '#FEF3C7' },
  { id: 'hard', label: 'Hard', color: '#B91C1C', bgColor: '#FEE2E2' },
];

// Feature filters - icons have colors, but chip uses theme primary when selected
// Only ONE can be selected at a time - tap again to deselect
const FEATURE_FILTERS = [
  { id: 'closest', label: 'Closest', icon: 'navigate', iconColor: '#0EA5E9' },
  { id: 'dog_friendly', label: 'Dog Friendly', icon: 'paw', iconColor: '#F97316' },
  { id: 'waterfall', label: 'Waterfall', icon: 'water', iconColor: '#06B6D4' },
  { id: 'lake', label: 'Lake', icon: 'fish', iconColor: '#3B82F6' },
  { id: 'summit', label: 'Summit', icon: 'triangle', iconColor: '#8B5CF6' },
  { id: 'kid_friendly', label: 'Kid Friendly', icon: 'happy', iconColor: '#EC4899' },
];

const SORT_OPTIONS = [
  { id: 'popular', label: 'Most Popular', icon: 'flame-outline' },
  { id: 'rating', label: 'Highest Rated', icon: 'star-outline' },
  { id: 'distance_asc', label: 'Shortest First', icon: 'resize-outline' },
  { id: 'distance_desc', label: 'Longest First', icon: 'resize-outline' },
  { id: 'name', label: 'A-Z', icon: 'text-outline' },
];

export default function HikingScreen() {
  const COLORS = useColors();
  
  const [trails, setTrails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    fetchTrails();
  }, []);

  const fetchTrails = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('trails')
        .select(`
          *,
          trail_reviews (
            id,
            rating
          )
        `)
        .order('name');

      if (error) throw error;

      const processedTrails = (data || [])
        .filter((trail: any) => trail.slug !== 'test-trail' && trail.slug !== 'test-trail-2')
        .map((trail: any) => ({
          ...trail,
          avg_rating: trail.trail_reviews?.length > 0
            ? trail.trail_reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / trail.trail_reviews.length
            : null,
          review_count: trail.trail_reviews?.length || 0,
        }));

      setTrails(processedTrails);
    } catch (err) {
      console.error('Error fetching trails:', err);
      setError('Unable to load trails. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTrails();
  }, []);

  const handleFavoriteChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Toggle feature filter
  // - Clicking same filter again DESELECTS it (sets to null)
  // - When deselected, shows ALL trails (still respects difficulty if selected)
  const toggleFeature = (featureId: string) => {
    setSelectedFeature(prev => prev === featureId ? null : featureId);
  };

  // Helper: check if trail has a specific tag
  const hasTag = (trail: any, tag: string): boolean => {
    if (!trail.tags || !Array.isArray(trail.tags)) return false;
    return trail.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase());
  };

  // Helper: normalize search term (handle plurals)
  const normalizeSearchTerm = (term: string): string => {
    let normalized = term.toLowerCase().trim();
    if (normalized.endsWith('ies')) {
      normalized = normalized.slice(0, -3) + 'y';
    } else if (normalized.endsWith('es') && normalized.length > 3) {
      const withoutEs = normalized.slice(0, -2);
      return withoutEs.length >= 3 ? withoutEs : normalized.slice(0, -1);
    } else if (normalized.endsWith('s') && normalized.length > 2) {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  };

  // Helper: check if text contains search term
  const textContainsTerm = (text: string | null | undefined, searchTerm: string): boolean => {
    if (!text) return false;
    const normalizedText = text.toLowerCase();
    const normalizedTerm = normalizeSearchTerm(searchTerm);
    return normalizedText.includes(searchTerm.toLowerCase()) || normalizedText.includes(normalizedTerm);
  };

  // Helper: check if tags array contains search term
  const tagsContainTerm = (tags: string[] | null | undefined, searchTerm: string): boolean => {
    if (!tags || !Array.isArray(tags)) return false;
    const normalizedTerm = normalizeSearchTerm(searchTerm);
    return tags.some(tag => {
      const normalizedTag = tag.toLowerCase();
      return normalizedTag.includes(searchTerm.toLowerCase()) || 
             normalizedTag.includes(normalizedTerm) ||
             normalizedTerm.includes(normalizedTag);
    });
  };

  // Main filter logic
  // - Difficulty and Feature filters are INDEPENDENT
  // - When feature is deselected (null), all trails show (respecting difficulty)
  const filteredTrails = useMemo(() => {
    let result = [...trails];

    // 1. Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim();
      result = result.filter(trail => {
        if (textContainsTerm(trail.name, query)) return true;
        if (textContainsTerm(trail.park_area, query)) return true;
        if (textContainsTerm(trail.short_description, query)) return true;
        if (textContainsTerm(trail.long_description, query)) return true;
        if (tagsContainTerm(trail.tags, query)) return true;
        if (textContainsTerm(trail.difficulty, query)) return true;
        if (textContainsTerm(trail.route_type, query)) return true;
        if (textContainsTerm(trail.trailhead_name, query)) return true;
        return false;
      });
    }

    // 2. Difficulty filter - ALWAYS applies if not "all"
    if (selectedDifficulty !== 'all') {
      result = result.filter(trail => 
        trail.difficulty?.toLowerCase() === selectedDifficulty
      );
    }

    // 3. Feature filter - ONLY applies if one is selected
    // When null (deselected), this entire block is skipped
    if (selectedFeature) {
      switch (selectedFeature) {
        case 'dog_friendly':
          result = result.filter(trail => trail.dog_friendly === true);
          break;
        case 'kid_friendly':
          result = result.filter(trail => trail.kid_friendly === true);
          break;
        case 'waterfall':
          result = result.filter(trail => hasTag(trail, 'waterfall'));
          break;
        case 'lake':
          result = result.filter(trail => hasTag(trail, 'lake'));
          break;
        case 'summit':
          result = result.filter(trail => hasTag(trail, 'summit'));
          break;
        case 'closest':
          result.sort((a, b) => (a.distance_miles || 0) - (b.distance_miles || 0));
          break;
      }
    }

    // 4. Sort (skip if "closest" already sorted)
    if (selectedFeature !== 'closest') {
      switch (selectedSort) {
        case 'rating':
          result.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
          break;
        case 'distance_asc':
          result.sort((a, b) => (a.distance_miles || 0) - (b.distance_miles || 0));
          break;
        case 'distance_desc':
          result.sort((a, b) => (b.distance_miles || 0) - (a.distance_miles || 0));
          break;
        case 'name':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'popular':
        default:
          result.sort((a, b) => {
            const rankA = a.popularity_rank || 999;
            const rankB = b.popularity_rank || 999;
            if (rankA !== rankB) return rankA - rankB;
            return (b.review_count || 0) - (a.review_count || 0);
          });
          break;
      }
    }

    return result;
  }, [trails, searchQuery, selectedDifficulty, selectedSort, selectedFeature]);

  if (loading) {
    return (
      <SafeAreaView style={[HikingStyles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
        <View style={HikingStyles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[HikingStyles.loadingText, { color: COLORS.textLight }]}>
            Discovering spots...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[HikingStyles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
        <View style={HikingStyles.errorContainer}>
          <View style={[HikingStyles.errorIconCircle, { backgroundColor: `${COLORS.primary}15` }]}>
            <Ionicons name="cloud-offline-outline" size={40} color={COLORS.primary} />
          </View>
          <Text style={[HikingStyles.errorTitle, { color: COLORS.text }]}>Connection Error</Text>
          <Text style={[HikingStyles.errorText, { color: COLORS.textLight }]}>{error}</Text>
          <TouchableOpacity 
            style={[HikingStyles.retryButton, { backgroundColor: COLORS.primary }]}
            onPress={fetchTrails}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={16} color="#fff" />
            <Text style={HikingStyles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[HikingStyles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      {/* Search Header */}
      <View style={HikingStyles.searchHeader}>
        <View style={[HikingStyles.searchContainer, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
          <Ionicons name="search" size={18} color={COLORS.textLight} />
          <TextInput
            style={[HikingStyles.searchInput, { color: COLORS.text }]}
            placeholder="Search spots..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={[HikingStyles.sortButton, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}
          onPress={() => setShowSortMenu(!showSortMenu)}
          activeOpacity={0.7}
        >
          <Ionicons name="options-outline" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Sort Dropdown */}
      {showSortMenu && (
        <View style={[HikingStyles.sortMenu, { backgroundColor: COLORS.white }]}>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                HikingStyles.sortOption,
                selectedSort === option.id && { backgroundColor: `${COLORS.primary}10` }
              ]}
              onPress={() => {
                setSelectedSort(option.id);
                setShowSortMenu(false);
              }}
            >
              <Ionicons 
                name={option.icon as any} 
                size={16} 
                color={selectedSort === option.id ? COLORS.primary : COLORS.textLight} 
              />
              <Text style={[
                HikingStyles.sortOptionText,
                { color: selectedSort === option.id ? COLORS.primary : COLORS.text }
              ]}>
                {option.label}
              </Text>
              {selectedSort === option.id && (
                <Ionicons name="checkmark" size={16} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Filter Chips */}
      <View style={HikingStyles.filtersSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={HikingStyles.filtersScroll}
        >
          {/* Difficulty Filters */}
          {DIFFICULTY_FILTERS.map((filter) => {
            const isSelected = selectedDifficulty === filter.id;
            const hasSpecificColor = filter.bgColor && filter.color;
            const chipBg = isSelected 
              ? (hasSpecificColor ? filter.bgColor : `${COLORS.primary}15`)
              : COLORS.white;
            const chipBorder = isSelected
              ? (hasSpecificColor ? filter.color : COLORS.primary)
              : COLORS.border;
            const textColor = isSelected
              ? (hasSpecificColor ? filter.color : COLORS.primary)
              : COLORS.text;

            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  HikingStyles.filterChip,
                  { backgroundColor: chipBg, borderColor: chipBorder }
                ]}
                onPress={() => setSelectedDifficulty(filter.id)}
                activeOpacity={0.7}
              >
                <Text style={[HikingStyles.filterChipText, { color: textColor }]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <View style={HikingStyles.filterDivider} />

          {/* Feature Filters - tap again to deselect */}
          {FEATURE_FILTERS.map((filter) => {
            const isSelected = selectedFeature === filter.id;
            
            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  HikingStyles.filterChip,
                  { 
                    backgroundColor: isSelected ? `${COLORS.primary}15` : COLORS.white,
                    borderColor: isSelected ? COLORS.primary : COLORS.border,
                  }
                ]}
                onPress={() => toggleFeature(filter.id)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={filter.icon as any} 
                  size={14} 
                  color={isSelected ? filter.iconColor : COLORS.textLight} 
                />
                <Text style={[
                  HikingStyles.filterChipText,
                  { color: isSelected ? COLORS.primary : COLORS.text }
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Trail List - extraData ensures re-render on filter changes */}
      <FlatList
        data={filteredTrails}
        keyExtractor={(item) => item.id}
        extraData={[selectedFeature, selectedDifficulty, selectedSort, refreshKey]}
        renderItem={({ item }) => (
          <TrailCard 
            trail={item}
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
        ListEmptyComponent={() => (
          <View style={HikingStyles.emptyContainer}>
            <View style={[HikingStyles.emptyIconCircle, { backgroundColor: `${COLORS.primary}15` }]}>
              <Ionicons name="trail-sign-outline" size={40} color={COLORS.primary} />
            </View>
            <Text style={[HikingStyles.emptyTitle, { color: COLORS.text }]}>No Spots Found</Text>
            <Text style={[HikingStyles.emptyText, { color: COLORS.textLight }]}>
              Try adjusting your filters or search terms
            </Text>
            <TouchableOpacity 
              style={[HikingStyles.clearFiltersButton, { backgroundColor: COLORS.primary }]}
              onPress={() => {
                setSearchQuery('');
                setSelectedDifficulty('all');
                setSelectedFeature(null);
              }}
            >
              <Text style={HikingStyles.clearFiltersButtonText}>Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}