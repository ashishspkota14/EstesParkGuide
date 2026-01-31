
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../../context/ThemeContext';

interface DifficultyBadgeProps {
  difficulty: string;
}

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const COLORS = useColors();

  const getDifficultyColor = () => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'moderate':
        return { bg: '#FFF8E1', text: '#F57C00' };
      case 'hard':
        return { bg: '#FFEBEE', text: '#C62828' };
      default:
        return { bg: `${COLORS.primary}15`, text: COLORS.textLight };
    }
  };

  const colors = getDifficultyColor();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>
        {difficulty || 'Unknown'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
});