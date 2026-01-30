import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { mapCategoriesStyles as styles } from '../../styles/components/map.Categories.styles';

// Category configuration - only one selectable at a time
export const CATEGORIES = [
  { id: 'trails', label: 'Trails', icon: 'trail-sign', color: COLORS.primary },
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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Show on Map</Text>
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
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.chip,
                isActive && { backgroundColor: category.color, borderColor: category.color }
              ]}
              onPress={() => onCategoryChange(category.id)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={category.icon as any} 
                size={18} 
                color={isActive ? '#fff' : category.color} 
              />
              <Text style={[
                styles.chipText,
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