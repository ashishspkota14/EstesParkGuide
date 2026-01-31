import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Linking,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUnits } from '../../context/UnitsContext';
import { supabase } from '../../services/supabase/client';
import EmergencyContacts from './EmergencyContacts';
import SOSAlert from './SOSAlert';
import PrivacyPolicy from './PrivacyPolicy';
import { settingsStyles } from '../../styles/components/settings.styles';

interface SettingsProps {
  onClose: () => void;
}

// Theme options with display names
const THEME_OPTIONS = [
  { key: 'greenish', name: 'Forest', icon: '🌲', color: '#2d5a3f' },
  { key: 'ocean', name: 'Ocean', icon: '🌊', color: '#0277BD' },
  { key: 'sunset', name: 'Sunset', icon: '🌅', color: '#FF7E67' },
  { key: 'forest', name: 'Meadow', icon: '🌿', color: '#2E7D32' },
  { key: 'coffee', name: 'Coffee', icon: '☕', color: '#8B593E' },
  { key: 'purple', name: 'Lavender', icon: '💜', color: '#6A1B9A' },
  { key: 'mint', name: 'Mint', icon: '🍃', color: '#00B5B5' },
  { key: 'midnight', name: 'Midnight', icon: '🌙', color: '#2C3E50' },
  { key: 'roseGold', name: 'Rose', icon: '🌸', color: '#E0BFB8' },
];

// Unit options
const UNIT_OPTIONS = [
  { key: 'imperial', name: 'Imperial', subtitle: 'Miles, Feet' },
  { key: 'metric', name: 'Metric', subtitle: 'Kilometers, Meters' },
];

export default function Settings({ onClose }: SettingsProps) {
  const { user, signOut } = useAuth();
  const { theme, themeName, setTheme } = useTheme();
  const { unitSystem, setUnitSystem } = useUnits();
  
  const [signingOut, setSigningOut] = useState(false);
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [trailAlerts, setTrailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [offlineMaps, setOfflineMaps] = useState(false);
  const [locationSharing, setLocationSharing] = useState(false);
  const [autoTrackHikes, setAutoTrackHikes] = useState(true);

  // Modal states
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  // Use theme colors
  const COLORS = theme;

  // Load saved settings
  useEffect(() => {
    loadSettings();
    loadSafetySettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('app_settings');
      if (saved) {
        const settings = JSON.parse(saved);
        setNotifications(settings.notifications ?? true);
        setTrailAlerts(settings.trailAlerts ?? true);
        setWeeklyDigest(settings.weeklyDigest ?? true);
        setOfflineMaps(settings.offlineMaps ?? false);
        setAutoTrackHikes(settings.autoTrackHikes ?? true);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadSafetySettings = async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from('user_safety_settings')
        .select('location_sharing_enabled')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setLocationSharing(data.location_sharing_enabled);
      }
    } catch (error) {
      // Settings don't exist yet, that's okay
    }
  };

  const saveSettings = async (key: string, value: any) => {
    try {
      const saved = await AsyncStorage.getItem('app_settings');
      const settings = saved ? JSON.parse(saved) : {};
      settings[key] = value;
      await AsyncStorage.setItem('app_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setSigningOut(true);
              await signOut();
              onClose();
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            } finally {
              setSigningOut(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all your data including completed hikes, reviews, and photos. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Contact Support', 'To delete your account, please email us at support@estesparkhiking.com with the subject "Account Deletion Request".');
          },
        },
      ]
    );
  };

  const handleThemeSelect = async (themeKey: string) => {
    await setTheme(themeKey as any);
  };

  const handleUnitSelect = async (unitKey: string) => {
    await setUnitSystem(unitKey as 'imperial' | 'metric');
  };

  const toggleSetting = async (key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    await saveSettings(key, value);
  };

  const handleLocationSharing = async (value: boolean) => {
    if (!user?.id) return;
    
    setLocationSharing(value);
    
    try {
      const { error } = await supabase
        .from('user_safety_settings')
        .upsert({
          user_id: user.id,
          location_sharing_enabled: value,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving location sharing:', error);
      setLocationSharing(!value);
    }
  };

  const handleRateApp = async () => {
    Alert.alert('Thanks!', 'App Store rating will be available once the app is published. We appreciate your support!');
  };

  const renderSectionHeader = (title: string, icon: string) => (
    <View style={[settingsStyles.sectionHeader, { borderBottomColor: COLORS.border }]}>
      <Ionicons name={icon as any} size={20} color={COLORS.primary} />
      <Text style={[settingsStyles.sectionTitle, { color: COLORS.primary }]}>{title}</Text>
    </View>
  );

  const renderSettingRow = (
    title: string,
    subtitle: string | null,
    icon: string,
    rightElement: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity 
      style={settingsStyles.settingRow}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={settingsStyles.settingLeft}>
        <View style={[settingsStyles.settingIconWrap, { backgroundColor: `${COLORS.primary}12` }]}>
          <Ionicons name={icon as any} size={20} color={COLORS.primary} />
        </View>
        <View style={settingsStyles.settingText}>
          <Text style={[settingsStyles.settingTitle, { color: COLORS.text }]}>{title}</Text>
          {subtitle && <Text style={[settingsStyles.settingSubtitle, { color: COLORS.textLight }]}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  // Modals
  if (showEmergencyContacts) {
    return <EmergencyContacts onClose={() => setShowEmergencyContacts(false)} />;
  }

  if (showSOS) {
    return <SOSAlert onClose={() => setShowSOS(false)} />;
  }

  if (showPrivacyPolicy) {
    return <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />;
  }

  return (
    <SafeAreaView style={[settingsStyles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      {/* Header */}
      <View style={[settingsStyles.header, { backgroundColor: COLORS.white, borderBottomColor: COLORS.border }]}>
        <TouchableOpacity onPress={onClose} style={settingsStyles.closeButton}>
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={[settingsStyles.headerTitle, { color: COLORS.text }]}>Settings</Text>
        <View style={settingsStyles.placeholder} />
      </View>

      <ScrollView 
        style={settingsStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={settingsStyles.scrollContent}
      >
        {/* Account Section */}
        {user && (
          <View style={[settingsStyles.section, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
            {renderSectionHeader('Account', 'person-outline')}
            <View style={[settingsStyles.accountCard, { backgroundColor: `${COLORS.primary}08` }]}>
              <View style={settingsStyles.accountInfo}>
                <Text style={[settingsStyles.accountEmail, { color: COLORS.text }]}>{user.email}</Text>
                <Text style={[settingsStyles.accountId, { color: COLORS.textLight }]}>ID: {user.id.slice(0, 8)}...</Text>
              </View>
              <View style={[settingsStyles.accountBadge, { backgroundColor: COLORS.primary }]}>
                <Text style={settingsStyles.accountBadgeText}>Free</Text>
              </View>
            </View>
          </View>
        )}

        {/* Appearance Section */}
        <View style={[settingsStyles.section, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
          {renderSectionHeader('Appearance', 'color-palette-outline')}
          
          <Text style={[settingsStyles.themeLabel, { color: COLORS.textLight }]}>Color Theme</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={settingsStyles.themeScroll}
          >
            {THEME_OPTIONS.map((themeOption) => (
              <TouchableOpacity
                key={themeOption.key}
                style={[
                  settingsStyles.themeOption,
                  themeName === themeOption.key && [settingsStyles.themeOptionSelected, { borderColor: COLORS.primary, backgroundColor: `${COLORS.primary}08` }]
                ]}
                onPress={() => handleThemeSelect(themeOption.key)}
                activeOpacity={0.7}
              >
                <View style={[settingsStyles.themeColor, { backgroundColor: themeOption.color }]}>
                  <Text style={settingsStyles.themeIcon}>{themeOption.icon}</Text>
                </View>
                <Text style={[
                  settingsStyles.themeName,
                  { color: COLORS.textLight },
                  themeName === themeOption.key && { color: COLORS.primary, fontWeight: '600' }
                ]}>
                  {themeOption.name}
                </Text>
                {themeName === themeOption.key && (
                  <View style={settingsStyles.themeCheck}>
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Units Section */}
        <View style={[settingsStyles.section, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
          {renderSectionHeader('Units', 'speedometer-outline')}
          <View style={settingsStyles.unitOptions}>
            {UNIT_OPTIONS.map((unit) => (
              <TouchableOpacity
                key={unit.key}
                style={[
                  settingsStyles.unitOption,
                  { borderColor: COLORS.border },
                  unitSystem === unit.key && { borderColor: COLORS.primary, backgroundColor: `${COLORS.primary}08` }
                ]}
                onPress={() => handleUnitSelect(unit.key)}
                activeOpacity={0.7}
              >
                <Text style={[
                  settingsStyles.unitName,
                  { color: COLORS.text },
                  unitSystem === unit.key && { color: COLORS.primary }
                ]}>
                  {unit.name}
                </Text>
                <Text style={[
                  settingsStyles.unitSubtitle,
                  { color: COLORS.textLight },
                  unitSystem === unit.key && { color: COLORS.primary }
                ]}>
                  {unit.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifications Section */}
        <View style={[settingsStyles.section, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
          {renderSectionHeader('Notifications', 'notifications-outline')}
          
          {renderSettingRow(
            'Push Notifications',
            'Receive alerts on your device',
            'phone-portrait-outline',
            <Switch
              value={notifications}
              onValueChange={(v) => toggleSetting('notifications', v, setNotifications)}
              trackColor={{ false: COLORS.border, true: `${COLORS.primary}50` }}
              thumbColor={notifications ? COLORS.primary : '#f4f3f4'}
            />
          )}
          
          {renderSettingRow(
            'Trail Condition Alerts',
            'Get notified about trail updates',
            'alert-circle-outline',
            <Switch
              value={trailAlerts}
              onValueChange={(v) => toggleSetting('trailAlerts', v, setTrailAlerts)}
              trackColor={{ false: COLORS.border, true: `${COLORS.primary}50` }}
              thumbColor={trailAlerts ? COLORS.primary : '#f4f3f4'}
            />
          )}
          
          {renderSettingRow(
            'Weekly Digest',
            'Trail recommendations every week',
            'mail-outline',
            <Switch
              value={weeklyDigest}
              onValueChange={(v) => toggleSetting('weeklyDigest', v, setWeeklyDigest)}
              trackColor={{ false: COLORS.border, true: `${COLORS.primary}50` }}
              thumbColor={weeklyDigest ? COLORS.primary : '#f4f3f4'}
            />
          )}
        </View>

        {/* Trail Settings Section */}
        <View style={[settingsStyles.section, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
          {renderSectionHeader('Trail Settings', 'trail-sign-outline')}
          
          {renderSettingRow(
            'Auto-Track Hikes',
            'Automatically track when hiking',
            'walk-outline',
            <Switch
              value={autoTrackHikes}
              onValueChange={(v) => toggleSetting('autoTrackHikes', v, setAutoTrackHikes)}
              trackColor={{ false: COLORS.border, true: `${COLORS.primary}50` }}
              thumbColor={autoTrackHikes ? COLORS.primary : '#f4f3f4'}
            />
          )}
          
          {renderSettingRow(
            'Offline Maps',
            'Download maps for offline use',
            'cloud-download-outline',
            <Switch
              value={offlineMaps}
              onValueChange={(v) => {
                if (!offlineMaps) {
                  Alert.alert('Coming Soon', 'Offline maps will be available in a future update!');
                } else {
                  toggleSetting('offlineMaps', v, setOfflineMaps);
                }
              }}
              trackColor={{ false: COLORS.border, true: `${COLORS.primary}50` }}
              thumbColor={offlineMaps ? COLORS.primary : '#f4f3f4'}
            />
          )}
        </View>

        {/* Privacy & Safety Section */}
        <View style={[settingsStyles.section, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
          {renderSectionHeader('Privacy & Safety', 'shield-checkmark-outline')}
          
          {renderSettingRow(
            'SOS Emergency',
            'Send distress signal with location',
            'alert-circle',
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />,
            () => setShowSOS(true)
          )}
          
          {renderSettingRow(
            'Location Sharing',
            'Share location with emergency contacts',
            'location-outline',
            <Switch
              value={locationSharing}
              onValueChange={handleLocationSharing}
              trackColor={{ false: COLORS.border, true: `${COLORS.primary}50` }}
              thumbColor={locationSharing ? COLORS.primary : '#f4f3f4'}
            />
          )}
          
          {renderSettingRow(
            'Emergency Contacts',
            'Manage your safety contacts',
            'people-outline',
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />,
            () => setShowEmergencyContacts(true)
          )}
          
          {renderSettingRow(
            'Privacy Policy',
            null,
            'document-text-outline',
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />,
            () => setShowPrivacyPolicy(true)
          )}
        </View>

        {/* Support Section */}
        <View style={[settingsStyles.section, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
          {renderSectionHeader('Support', 'help-buoy-outline')}
          
          {renderSettingRow(
            'Help Center',
            'FAQs and guides',
            'help-circle-outline',
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />,
            () => Linking.openURL('mailto:support@estesparkhiking.com?subject=Help Request')
          )}
          
          {renderSettingRow(
            'Send Feedback',
            'Help us improve the app',
            'chatbubble-ellipses-outline',
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />,
            () => Linking.openURL('mailto:feedback@estesparkhiking.com?subject=App Feedback')
          )}
          
          {renderSettingRow(
            'Rate the App',
            'Love the app? Leave a review!',
            'star-outline',
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />,
            handleRateApp
          )}
          
          {renderSettingRow(
            'About',
            'Version 1.0.0',
            'information-circle-outline',
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />,
            () => Alert.alert('Estes Park Hiking', 'Version 1.0.0\n\nMade with ❤️ for hikers\n\n© 2025 Estes Park Hiking\n\nDesigned for exploring the beautiful trails of Estes Park and Rocky Mountain National Park.')
          )}
        </View>

        {/* Sign Out Button */}
        {user && (
          <TouchableOpacity 
            style={[settingsStyles.signOutButton, { borderColor: COLORS.primary }]}
            onPress={handleSignOut}
            activeOpacity={0.8}
            disabled={signingOut}
          >
            {signingOut ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={22} color={COLORS.primary} />
                <Text style={[settingsStyles.signOutText, { color: COLORS.primary }]}>Sign Out</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Danger Zone */}
        {user && (
          <View style={settingsStyles.dangerZone}>
            <Text style={settingsStyles.dangerTitle}>Danger Zone</Text>
            <TouchableOpacity 
              style={settingsStyles.deleteButton}
              onPress={handleDeleteAccount}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={settingsStyles.deleteText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <View style={settingsStyles.footer}>
          <Text style={[settingsStyles.footerText, { color: COLORS.textLight }]}>Estes Park Hiking</Text>
          <Text style={[settingsStyles.footerVersion, { color: COLORS.textLight }]}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}