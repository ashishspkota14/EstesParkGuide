import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../context/ThemeContext';
import { floatingActionsStyles } from '../../styles/components/floatingActions.styles';

interface FloatingActionsProps {
  onStart: () => void;
  onDownload: () => void;
}

export default function FloatingActions({ onStart, onDownload }: FloatingActionsProps) {
  const COLORS = useColors();

  return (
    <View style={floatingActionsStyles.container}>
      <TouchableOpacity
        style={[
          floatingActionsStyles.downloadButton,
          { backgroundColor: COLORS.white, borderColor: COLORS.primary }
        ]}
        onPress={onDownload}
        activeOpacity={0.8}
      >
        <Ionicons name="download-outline" size={22} color={COLORS.primary} />
        <Text style={[floatingActionsStyles.downloadText, { color: COLORS.primary }]}>
          Download
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[floatingActionsStyles.startButton, { backgroundColor: COLORS.primary }]}
        onPress={onStart}
        activeOpacity={0.8}
      >
        <Ionicons name="navigate" size={22} color="#fff" />
        <Text style={floatingActionsStyles.startText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
}