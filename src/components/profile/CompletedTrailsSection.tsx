import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '../../constants/colors';
import TrailCard from '../trail/TrailCard';

// Importing the new vertical styles object
import { completedTrailsStyles } from '../../styles/screens/completedTrailSection.styles';

interface CompletedTrailSectionProps {
  trails: any[];
}

const CompletedTrailSection = ({ trails }: CompletedTrailSectionProps) => {
  if (trails.length === 0) {
    return (
      <Text style={completedTrailsStyles.empty}>
        No trails completed yet. Get out there!
      </Text>
    );
  }

  return (
    <View style={completedTrailsStyles.container}>
      {trails.map((trail, index) => (
        <View key={trail.id || index} style={completedTrailsStyles.cardContainer}>
          <TrailCard 
            trail={trail} 
            onPress={() => router.push(`/trail/${trail.id}`)} 
          />
          
          {/* Date Badge positioned over the card */}
          <View 
            style={[
              completedTrailsStyles.dateBadge, 
              { backgroundColor: COLORS.primary + 'CC' } // CC adds 80% transparency
            ]}
          >
            <Text style={completedTrailsStyles.dateText}>
              {trail.completed_at ? new Date(trail.completed_at).toLocaleDateString() : 'COMPLETED'}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default CompletedTrailSection;