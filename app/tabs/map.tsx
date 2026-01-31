import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Mapbox from '@rnmapbox/maps';
import { supabase } from '../../src/services/supabase/client';
import { useColors } from '../../src/context/ThemeContext';
import { useUnits } from '../../src/context/UnitsContext';
import { mapStyles } from '../../src/styles/screens/map.styles';
import MapCategories, { CATEGORIES } from '../../src/components/map/MapCategories';

const MAP_STYLES = [
  { id: 'outdoors', label: 'Outdoor', url: Mapbox.StyleURL.Outdoors },
  { id: 'satellite', label: 'Satellite', url: Mapbox.StyleURL.SatelliteStreet },
  { id: 'streets', label: 'Streets', url: Mapbox.StyleURL.Street },
];

export default function MapScreen() {
  const COLORS = useColors();
  const { formatDistanceShort, formatElevationShort } = useUnits();
  
  const [trails, setTrails] = useState<any[]>([]);
  const [selectedTrail, setSelectedTrail] = useState<any>(null);
  const [is3DMode, setIs3DMode] = useState(true);
  const [mapStyleIndex, setMapStyleIndex] = useState(0);
  const [showCategories, setShowCategories] = useState(false);
  const [activeCategory, setActiveCategory] = useState('trails');

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
    setActiveCategory(categoryId);
    setSelectedTrail(null);
  };

  const handleMapPress = () => {
    setShowCategories(false);
    setSelectedTrail(null);
  };

  const handleTrailPress = (trail: any) => {
    setSelectedTrail(trail);
    setShowCategories(false);
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
                { borderColor: COLORS.primary },
                selectedTrail?.id === trail.id && [mapStyles.trailMarkerSelected, { backgroundColor: COLORS.primary }]
              ]}>
                <Ionicons 
                  name="trail-sign" 
                  size={18} 
                  color={selectedTrail?.id === trail.id ? '#fff' : COLORS.primary} 
                />
              </View>
              <View style={[
                mapStyles.markerArrow,
                selectedTrail?.id === trail.id && [mapStyles.markerArrowSelected, { borderTopColor: COLORS.primary }]
              ]} />
            </TouchableOpacity>
          </Mapbox.MarkerView>
        ))}
      </Mapbox.MapView>

      {/* Header */}
      <View style={mapStyles.header}>
        <Text style={[mapStyles.headerTitle, { color: COLORS.text }]}>Explore Estes Park</Text>
      </View>

      {/* Map Controls */}
      <View style={mapStyles.controlsRight}>
        <TouchableOpacity
          style={[
            mapStyles.controlButton, 
            { backgroundColor: COLORS.white },
            is3DMode && { backgroundColor: COLORS.primary }
          ]}
          onPress={toggle3D}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="cube-outline" 
            size={22} 
            color={is3DMode ? '#fff' : COLORS.text} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[mapStyles.controlButton, { backgroundColor: COLORS.white }]}
          onPress={cycleMapStyle}
          activeOpacity={0.8}
        >
          <Ionicons name="layers-outline" size={22} color={COLORS.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            mapStyles.controlButton,
            { backgroundColor: COLORS.white },
            showCategories && { backgroundColor: COLORS.primary }
          ]}
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
      <View style={[mapStyles.styleIndicator, { backgroundColor: COLORS.white }]}>
        <Text style={[mapStyles.styleIndicatorText, { color: COLORS.text }]}>
          {MAP_STYLES[mapStyleIndex].label}
        </Text>
      </View>

      {/* Active Category Indicator */}
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
        <View style={[mapStyles.infoMessage, { backgroundColor: COLORS.white }]}>
          <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
          <Text style={[mapStyles.infoMessageText, { color: COLORS.text }]}>
            {currentCategory?.label} shown are from map data. Zoom in to see more.
          </Text>
        </View>
      )}

      {/* Selected Trail Card */}
      {selectedTrail && activeCategory === 'trails' && (
        <View style={[mapStyles.trailCard, { backgroundColor: COLORS.white }]}>
          <TouchableOpacity 
            style={mapStyles.trailCardContent}
            onPress={navigateToTrail}
            activeOpacity={0.9}
          >
            {selectedTrail.image_main && (
              <Image 
                source={{ uri: selectedTrail.image_main }} 
                style={mapStyles.trailCardImage}
              />
            )}
            
            <View style={mapStyles.trailCardInfo}>
              <Text style={[mapStyles.trailCardName, { color: COLORS.text }]} numberOfLines={1}>
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
                
                <Text style={[mapStyles.trailCardStat, { color: COLORS.textLight }]}>
                  {formatDistanceShort(selectedTrail.distance_miles || 0)}
                </Text>
                
                <Text style={[mapStyles.trailCardStatDivider, { color: COLORS.textLight }]}>•</Text>
                
                <Text style={[mapStyles.trailCardStat, { color: COLORS.textLight }]}>
                  {formatElevationShort(selectedTrail.elevation_gain_ft || 0)}
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