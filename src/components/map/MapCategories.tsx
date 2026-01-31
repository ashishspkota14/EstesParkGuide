import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../context/ThemeContext';
import { mapCategoriesStyles as styles } from '../../styles/components/map.Categories.styles';

// Category configuration - only one selectable at a time
// Note: 'trails' color will be overridden with theme primary in the component
export const CATEGORIES = [
  { id: 'trails', label: 'Trails', icon: 'trail-sign', color: '#2d5a3f' }, // Default, will be dynamic
  { id: 'restaurant', label: 'Restaurants', icon: 'restaurant', color: '#E74C3C' },
  { id: 'cafe', label: 'Coffee', icon: 'cafe', color: '#8B4513' },
  { id: 'lodging', label: 'Hotels', icon: 'bed', color: '#3498DB' },
  { id: 'bar', label: 'Bars', icon: 'beer', color: '#F39C12' },
  { id: 'bakery', label: 'Desserts', icon: 'ice-cream', color: '#E91E63' },
  { id: 'souvenirs', label: 'Souvenirs', icon: 'gift', color: '#9B59B6' },
  { id: 'gas', label: 'Gas', icon: 'car', color: '#34495E' },
  { id: 'parking', label: 'Parking', icon: 'car-sport', color: '#1ABC9C' },
  { id: 'attraction', label: 'Attractions', icon: 'camera', color: '#FF6B6B' },
];

// Helper function to get category color with theme support
export const getCategoryColor = (categoryId: string, primaryColor: string): string => {
  if (categoryId === 'trails') {
    return primaryColor;
  }
  const category = CATEGORIES.find(c => c.id === categoryId);
  return category?.color || primaryColor;
};

interface MapCategoriesProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onClose: () => void;
}

export default function MapCategories({ 
  activeCategory, 
  onCategoryChange,
  onClose 
}: MapCategoriesProps) {
  const COLORS = useColors();

  // Get category color - use theme primary for trails
  const getColor = (category: typeof CATEGORIES[0]) => {
    if (category.id === 'trails') {
      return COLORS.primary;
    }
    return category.color;
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.white }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: COLORS.text }]}>Show on Map</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id;
          const categoryColor = getColor(category);
          
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.chip,
                { borderColor: COLORS.border },
                isActive && { backgroundColor: categoryColor, borderColor: categoryColor }
              ]}
              onPress={() => onCategoryChange(category.id)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={category.icon as any} 
                size={18} 
                color={isActive ? '#fff' : categoryColor} 
              />
              <Text style={[
                styles.chipText,
                { color: COLORS.text },
                isActive && { color: '#fff' }
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}