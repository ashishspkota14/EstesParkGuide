import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { settingsStyles } from '../../styles/screens/settings.styles';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const { signOut, user } = useAuth();
  const insets = useSafeAreaInsets(); 

  return (
    <View style={[settingsStyles.container, { paddingTop: insets.top }]}>
      <View style={settingsStyles.header}>
        <Text style={settingsStyles.title}>Settings</Text>
        <TouchableOpacity onPress={onClose} style={settingsStyles.closeBtn}>
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={settingsStyles.content} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={settingsStyles.sectionTitle}>Account</Text>
        <View style={settingsStyles.settingItem}>
          <View style={settingsStyles.settingLabel}>
            <Ionicons name="person-outline" size={22} color={COLORS.primary} />
            <Text style={settingsStyles.settingText}>{user?.email || 'Hiker'}</Text>
          </View>
        </View>

        <Text style={settingsStyles.sectionTitle}>Preferences</Text>
        <TouchableOpacity style={settingsStyles.settingItem}>
          <View style={settingsStyles.settingLabel}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
            <Text style={settingsStyles.settingText}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.border} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[settingsStyles.settingItem, { marginTop: 30, marginBottom: 40 }]} 
          onPress={async () => {
            await signOut();
            onClose();
          }}
        >
          <View style={settingsStyles.settingLabel}>
            <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
            <Text style={[settingsStyles.settingText, { color: '#FF3B30' }]}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}