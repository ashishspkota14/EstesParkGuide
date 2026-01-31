import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { achievementStyles } from '../../styles/components/achievement.styles';

interface AchievementBadgesProps {
  stats: {
    hikes: number;
    miles: number;
    vert: number;
  };
}

// Badge definitions
const BADGES = [
  // Hike count badges
  { id: 'first_hike', name: 'First Steps', icon: '🥾', requirement: (s: any) => s.hikes >= 1, description: 'Complete your first hike' },
  { id: 'hiker_5', name: 'Trail Regular', icon: '🏕️', requirement: (s: any) => s.hikes >= 5, description: 'Complete 5 hikes' },
  { id: 'hiker_10', name: 'Adventurer', icon: '🧭', requirement: (s: any) => s.hikes >= 10, description: 'Complete 10 hikes' },
  { id: 'hiker_25', name: 'Trailblazer', icon: '⛰️', requirement: (s: any) => s.hikes >= 25, description: 'Complete 25 hikes' },
  { id: 'hiker_50', name: 'Mountain Master', icon: '🏔️', requirement: (s: any) => s.hikes >= 50, description: 'Complete 50 hikes' },
  
  // Distance badges
  { id: 'miles_10', name: '10 Miler', icon: '👟', requirement: (s: any) => s.miles >= 10, description: 'Hike 10 total miles' },
  { id: 'miles_50', name: 'Marathoner', icon: '🏃', requirement: (s: any) => s.miles >= 50, description: 'Hike 50 total miles' },
  { id: 'miles_100', name: 'Century Club', icon: '💯', requirement: (s: any) => s.miles >= 100, description: 'Hike 100 total miles' },
  
  // Elevation badges
  { id: 'vert_1000', name: 'Climber', icon: '🧗', requirement: (s: any) => s.vert >= 1000, description: 'Gain 1,000 ft elevation' },
  { id: 'vert_5000', name: 'Peak Seeker', icon: '🗻', requirement: (s: any) => s.vert >= 5000, description: 'Gain 5,000 ft elevation' },
  { id: 'vert_10000', name: 'Summit Legend', icon: '👑', requirement: (s: any) => s.vert >= 10000, description: 'Gain 10,000 ft elevation' },
];

export default function AchievementBadges({ stats }: AchievementBadgesProps) {
  const earnedBadges = BADGES.filter(badge => badge.requirement(stats));
  const lockedBadges = BADGES.filter(badge => !badge.requirement(stats));

  // Show max 4 earned badges + progress hint
  const displayBadges = earnedBadges.slice(0, 4);
  const nextBadge = lockedBadges[0];

  if (earnedBadges.length === 0 && !nextBadge) return null;

  return (
    <View style={achievementStyles.container}>
      <View style={achievementStyles.header}>
        <Text style={achievementStyles.title}>Achievements</Text>
        <Text style={achievementStyles.count}>{earnedBadges.length}/{BADGES.length}</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={achievementStyles.badgesScroll}
      >
        {/* Earned badges */}
        {displayBadges.map((badge) => (
          <View key={badge.id} style={achievementStyles.badge}>
            <View style={achievementStyles.badgeIcon}>
              <Text style={achievementStyles.badgeEmoji}>{badge.icon}</Text>
            </View>
            <Text style={achievementStyles.badgeName} numberOfLines={1}>{badge.name}</Text>
          </View>
        ))}

        {/* Next badge to earn (locked) */}
        {nextBadge && (
          <View style={[achievementStyles.badge, achievementStyles.lockedBadge]}>
            <View style={[achievementStyles.badgeIcon, achievementStyles.lockedIcon]}>
              <Ionicons name="lock-closed" size={20} color={COLORS.textLight} />
            </View>
            <Text style={[achievementStyles.badgeName, achievementStyles.lockedName]} numberOfLines={1}>
              {nextBadge.name}
            </Text>
          </View>
        )}

        {/* View all button if more earned */}
        {earnedBadges.length > 4 && (
          <TouchableOpacity style={achievementStyles.viewAllBadge}>
            <View style={achievementStyles.viewAllIcon}>
              <Text style={achievementStyles.viewAllCount}>+{earnedBadges.length - 4}</Text>
            </View>
            <Text style={achievementStyles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Progress hint */}
      {nextBadge && (
        <View style={achievementStyles.progressHint}>
          <Ionicons name="trophy-outline" size={14} color={COLORS.primary} />
          <Text style={achievementStyles.progressText}>
            Next: <Text style={achievementStyles.progressBold}>{nextBadge.name}</Text> - {nextBadge.description}
          </Text>
        </View>
      )}
    </View>
  );
}