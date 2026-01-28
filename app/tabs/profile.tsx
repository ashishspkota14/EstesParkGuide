import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Verified import paths
import { useAuth } from '../../src/context/AuthContext';
import { COLORS } from '../../src/constants/colors';
import { supabase } from '../../src/services/supabase/client';
import TrailCard from '../../src/components/trail/TrailCard';
import Settings from '../../src/components/common/Settings';
import { TrailSummary } from '../../src/types/trail.types';

// Importing the styles object directly
import { profileStyles } from '../../src/styles/screens/profile.styles';

interface CompletedHike extends TrailSummary {
  completed_at: string;
}

export default function ProfileScreen() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'completed' | 'reviews'>('completed');
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedHikes, setCompletedHikes] = useState<CompletedHike[]>([]);
  const [stats, setStats] = useState({ hikes: 0, miles: 0, vert: 0 });

  const fetchData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const timeout = setTimeout(() => setLoading(false), 5000);

      const [statsRes, listRes] = await Promise.all([
        supabase
          .from('completed_trails')
          .select('trails(distance_miles, elevation_gain_ft)')
          .eq('user_id', user.id),
        supabase
          .from('completed_trails')
          .select('completed_at, trails (*)')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
      ]);

      clearTimeout(timeout);

      if (statsRes.data) {
        const miles = statsRes.data.reduce((acc, curr: any) => acc + (curr.trails?.distance_miles || 0), 0);
        const vert = statsRes.data.reduce((acc, curr: any) => acc + (curr.trails?.elevation_gain_ft || 0), 0);
        setStats({
          hikes: statsRes.data.length,
          miles: Number(miles.toFixed(1)),
          vert: Math.round(vert)
        });
      }
      
      if (listRes.data) {
        const formatted = listRes.data
          .filter((item: any) => item.trails !== null)
          .map((item: any) => ({ ...item.trails, completed_at: item.completed_at }));
        setCompletedHikes(formatted);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderHeader = () => (
    <View style={profileStyles.headerContainer}>
      <View style={profileStyles.topRow}>
        <Text style={profileStyles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => setShowSettings(true)}>
          <Ionicons name="settings-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={profileStyles.profileInfo}>
        <Image 
          source={{ uri: `https://ui-avatars.com/api/?name=${user?.email || 'Hiker'}&background=2d5a3f&color=fff` }} 
          style={profileStyles.avatar} 
        />
        <Text style={profileStyles.name}>{user?.email?.split('@')[0] || 'Hiker'}</Text>
        
        <View style={profileStyles.statsRow}>
          <View style={profileStyles.statBox}>
            <Text style={profileStyles.statVal}>{stats.hikes}</Text>
            <Text style={profileStyles.statLab}>Hikes</Text>
          </View>
          <View style={[profileStyles.statBox, profileStyles.statDivider]}>
            <Text style={profileStyles.statVal}>{stats.miles}</Text>
            <Text style={profileStyles.statLab}>Miles</Text>
          </View>
          <View style={profileStyles.statBox}>
            <Text style={profileStyles.statVal}>{stats.vert}</Text>
            <Text style={profileStyles.statLab}>Vert ft</Text>
          </View>
        </View>
      </View>

      <View style={profileStyles.tabWrapper}>
        <TouchableOpacity 
          onPress={() => setActiveTab('completed')}
          style={[profileStyles.tab, activeTab === 'completed' && profileStyles.activeTab]}
        >
          <Text style={[profileStyles.tabText, activeTab === 'completed' && { color: COLORS.primary }]}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('reviews')}
          style={[profileStyles.tab, activeTab === 'reviews' && profileStyles.activeTab]}
        >
          <Text style={[profileStyles.tabText, activeTab === 'reviews' && { color: COLORS.primary }]}>Reviews</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (activeTab === 'completed') {
      return (
        <View style={profileStyles.emptyContainer}>
          <View style={profileStyles.iconCircle}>
            <Ionicons name="trail-sign-outline" size={40} color={COLORS.border} />
          </View>
          <Text style={profileStyles.emptyText}>
            Your adventure starts here. Go log your first trail!
          </Text>
        </View>
      );
    }

    return (
      <View style={profileStyles.emptyContainer}>
        <View style={profileStyles.iconCircle}>
          <Ionicons name="chatbubbles-outline" size={40} color={COLORS.primary} />
        </View>
        <Text style={profileStyles.emptyTitle}>Share your wisdom</Text>
        <Text style={profileStyles.emptyText}>
          Your reviews help the Estes Park community find the best hidden gems and safe paths.
        </Text>
        
        <TouchableOpacity 
          activeOpacity={0.7} 
          onPress={() => router.push('/tabs/hiking')}
          style={profileStyles.reviewBtn}
        >
          <Text style={profileStyles.reviewBtnText}>See Trails for Reviews</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={profileStyles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <FlatList
        data={activeTab === 'completed' ? completedHikes : []}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <View style={profileStyles.cardPadding}>
            <TrailCard trail={item} onPress={() => {}} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
      <Modal visible={showSettings} animationType="slide">
        <Settings onClose={() => setShowSettings(false)} />
      </Modal>
    </SafeAreaView>
  );
}