import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { MapStyleType } from '../../types/map.types';

interface MapControlsProps {
  mapStyle: MapStyleType;
  onToggleStyle: () => void;
}

export default function MapControls({ mapStyle, onToggleStyle }: MapControlsProps) {
  return (
    <View style={styles.container}>
      {/* Toggle Map Style */}
      <TouchableOpacity
        style={[styles.button, mapStyle === 'satellite' && styles.buttonActive]}
        onPress={onToggleStyle}
        activeOpacity={0.7}
      >
        <Ionicons
          name={mapStyle === 'outdoors' ? 'earth' : 'map'}
          size={24}
          color={mapStyle === 'satellite' ? COLORS.white : COLORS.primary}
        />
      </TouchableOpacity>

      {/* Zoom to Current Location */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.7}
      >
        <Ionicons name="locate" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    gap: 12,
    zIndex: 5,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonActive: {
    backgroundColor: COLORS.primary,
  },
});