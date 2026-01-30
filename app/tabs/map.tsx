import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Mapbox from '@rnmapbox/maps';
import { supabase } from '../../src/services/supabase/client';
import { COLORS } from '../../src/constants/colors';
import { mapStyles } from '../../src/styles/screens/map.styles';
import MapCategories, { CATEGORIES } from '../../src/components/map/MapCategories';

// Map style options
const MAP_STYLES = [
  { id: 'outdoors', label: 'Outdoor', url: Mapbox.StyleURL.Outdoors },
  { id: 'satellite', label: 'Satellite', url: Mapbox.StyleURL.SatelliteStreet },
  { id: 'streets', label: 'Streets', url: Mapbox.StyleURL.Street },
];

export default function MapScreen() {
  const [trails, setTrails] = useState<any[]>([]);
  const [selectedTrail, setSelectedTrail] = useState<any>(null);
  const [is3DMode, setIs3DMode] = useState(true);
  const [mapStyleIndex, setMapStyleIndex] = useState(0);
  const [showCategories, setShowCategories] = useState(false);
  const [activeCategory, setActiveCategory] = useState('trails'); // Single category

  // Estes Park center coordinates
  const ESTES_PARK_CENTER = [-105.5217, 40.3772];

  useEffect(() => {
    fetchTrails();
  }, []);

  const fetchTrails = async () => {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select('id, name, difficulty, distance_miles, elevation_gain_ft, trailhead_lat, trailhead_lon, image_main')
        .order('name');

      if (error) throw error;
      setTrails(data || []);
    } catch (error) {
      console.error('Error fetching trails:', error);
    }
  };

  const toggle3D = () => {
    setIs3DMode(!is3DMode);
  };

  const cycleMapStyle = () => {
    setMapStyleIndex((prev) => (prev + 1) % MAP_STYLES.length);
  };

  const handleCategoryChange = (categoryId: string) => {
    // Single selection - only one category at a time
    setActiveCategory(categoryId);
    setSelectedTrail(null); // Clear selected trail when switching category
  };

  const handleMapPress = () => {
    // Close categories panel and deselect trail when tapping on map
    setShowCategories(false);
    setSelectedTrail(null);
  };

  const handleTrailPress = (trail: any) => {
    setSelectedTrail(trail);
    setShowCategories(false); // Close categories when selecting a trail
  };

  const navigateToTrail = () => {
    if (selectedTrail) {
      router.push({
        pathname: '/(screens)/trail-detail',
        params: { id: selectedTrail.id }
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return '#22C55E';
      case 'moderate': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return COLORS.primary;
    }
  };

  // Get current category info for display
  const currentCategory = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <View style={mapStyles.container}>
      <Mapbox.MapView
        style={mapStyles.map}
        styleURL={MAP_STYLES[mapStyleIndex].url}
        onPress={handleMapPress}
      >
        <Mapbox.Camera
          zoomLevel={12}
          centerCoordinate={ESTES_PARK_CENTER}
          pitch={is3DMode ? 45 : 0}
          animationDuration={1000}
        />

        {/* Trail Markers - Only show when trails category is active */}
        {activeCategory === 'trails' && trails.map((trail) => (
          <Mapbox.MarkerView
            key={trail.id}
            id={`trail-${trail.id}`}
            coordinate={[trail.trailhead_lon, trail.trailhead_lat]}
            anchor={{ x: 0.5, y: 1 }}
          >
            <TouchableOpacity
              onPress={() => handleTrailPress(trail)}
              activeOpacity={0.8}
              style={mapStyles.markerContainer}
            >
              <View style={[
                mapStyles.trailMarker,
                selectedTrail?.id === trail.id && mapStyles.trailMarkerSelected
              ]}>
                <Ionicons 
                  name="trail-sign" 
                  size={18} 
                  color={selectedTrail?.id === trail.id ? '#fff' : COLORS.primary} 
                />
              </View>
              <View style={[
                mapStyles.markerArrow,
                selectedTrail?.id === trail.id && mapStyles.markerArrowSelected
              ]} />
            </TouchableOpacity>
          </Mapbox.MarkerView>
        ))}
      </Mapbox.MapView>

      {/* Header with title */}
      <View style={mapStyles.header}>
        <Text style={mapStyles.headerTitle}>Explore Estes Park</Text>
      </View>

      {/* Map Controls - Right side */}
      <View style={mapStyles.controlsRight}>
        {/* 3D Toggle */}
        <TouchableOpacity
          style={[mapStyles.controlButton, is3DMode && mapStyles.controlButtonActive]}
          onPress={toggle3D}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="cube-outline" 
            size={22} 
            color={is3DMode ? '#fff' : COLORS.text} 
          />
        </TouchableOpacity>

        {/* Map Style Toggle */}
        <TouchableOpacity
          style={mapStyles.controlButton}
          onPress={cycleMapStyle}
          activeOpacity={0.8}
        >
          <Ionicons name="layers-outline" size={22} color={COLORS.text} />
        </TouchableOpacity>

        {/* Categories Toggle */}
        <TouchableOpacity
          style={[mapStyles.controlButton, showCategories && mapStyles.controlButtonActive]}
          onPress={() => setShowCategories(!showCategories)}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="options-outline" 
            size={22} 
            color={showCategories ? '#fff' : COLORS.text} 
          />
        </TouchableOpacity>
      </View>

      {/* Map Style Indicator */}
      <View style={mapStyles.styleIndicator}>
        <Text style={mapStyles.styleIndicatorText}>
          {MAP_STYLES[mapStyleIndex].label}
        </Text>
      </View>

      {/* Active Category Indicator (when categories panel is closed) */}
      {!showCategories && currentCategory && (
        <TouchableOpacity 
          style={[mapStyles.categoryIndicator, { backgroundColor: currentCategory.color }]}
          onPress={() => setShowCategories(true)}
          activeOpacity={0.8}
        >
          <Ionicons name={currentCategory.icon as any} size={16} color="#fff" />
          <Text style={mapStyles.categoryIndicatorText}>{currentCategory.label}</Text>
        </TouchableOpacity>
      )}

      {/* Categories Panel */}
      {showCategories && (
        <MapCategories
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          onClose={() => setShowCategories(false)}
        />
      )}

      {/* Info message for non-trail categories */}
      {activeCategory !== 'trails' && !selectedTrail && (
        <View style={mapStyles.infoMessage}>
          <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
          <Text style={mapStyles.infoMessageText}>
            {currentCategory?.label} shown are from map data. Zoom in to see more.
          </Text>
        </View>
      )}

      {/* Selected Trail Card - Positioned above tabs */}
      {selectedTrail && activeCategory === 'trails' && (
        <View style={mapStyles.trailCard}>
          <TouchableOpacity 
            style={mapStyles.trailCardContent}
            onPress={navigateToTrail}
            activeOpacity={0.9}
          >
            {/* Trail Image */}
            {selectedTrail.image_main && (
              <Image 
                source={{ uri: selectedTrail.image_main }} 
                style={mapStyles.trailCardImage}
              />
            )}
            
            <View style={mapStyles.trailCardInfo}>
              <Text style={mapStyles.trailCardName} numberOfLines={1}>
                {selectedTrail.name}
              </Text>
              
              <View style={mapStyles.trailCardStats}>
                <View style={[
                  mapStyles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(selectedTrail.difficulty) }
                ]}>
                  <Text style={mapStyles.difficultyText}>
                    {selectedTrail.difficulty}
                  </Text>
                </View>
                
                <Text style={mapStyles.trailCardStat}>
                  {selectedTrail.distance_miles?.toFixed(1)} mi
                </Text>
                
                <Text style={mapStyles.trailCardStatDivider}>•</Text>
                
                <Text style={mapStyles.trailCardStat}>
                  {selectedTrail.elevation_gain_ft?.toLocaleString()} ft
                </Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}