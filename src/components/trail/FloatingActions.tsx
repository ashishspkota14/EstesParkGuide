import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { floatingActionsStyles } from '../../styles/components/floatingActions.styles';

interface FloatingActionsProps {
  onStart: () => void;
  onDownload: () => void;
}

export default function FloatingActions({ onStart, onDownload }: FloatingActionsProps) {
  return (
    <View style={floatingActionsStyles.container}>
      <TouchableOpacity
        style={floatingActionsStyles.downloadButton}
        onPress={onDownload}
        activeOpacity={0.8}
      >
        <Ionicons name="download-outline" size={22} color="#2d5a3f" />
        <Text style={floatingActionsStyles.downloadText}>Download</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={floatingActionsStyles.startButton}
        onPress={onStart}
        activeOpacity={0.8}
      >
        <Ionicons name="navigate" size={22} color="#fff" />
        <Text style={floatingActionsStyles.startText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
}