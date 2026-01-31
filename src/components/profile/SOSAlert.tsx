import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../services/supabase/client';
import { sosStyles } from '../../styles/components/sos.styles';

// Try to import SMS, but don't fail if unavailable (requires dev build)
let SMS: any = null;
try {
  SMS = require('expo-sms');
} catch (e) {
  console.log('expo-sms not available - requires development build');
}

// Try to import NetInfo, but don't fail if unavailable
let NetInfo: any = null;
try {
  NetInfo = require('@react-native-community/netinfo').default;
} catch (e) {
  console.log('NetInfo not available');
}

interface SOSAlertProps {
  onClose: () => void;
  trailName?: string;
  trailId?: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

const SOS_CACHE_KEY = 'pending_sos_alerts';

export default function SOSAlert({ onClose, trailName, trailId }: SOSAlertProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const COLORS = theme;
  
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchContacts();
    getLocation();
    checkConnection();

    // Listen for connection changes if NetInfo is available
    let unsubscribe: any;
    if (NetInfo) {
      unsubscribe = NetInfo.addEventListener((state: any) => {
        setIsOnline(state.isConnected ?? true);
        if (state.isConnected) {
          sendCachedAlerts();
        }
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const fetchContacts = async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from('emergency_contacts')
        .select('id, name, phone')
        .eq('user_id', user.id)
        .eq('notify_on_sos', true)
        .order('is_primary', { ascending: false });
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const checkConnection = async () => {
    if (NetInfo) {
      try {
        const state = await NetInfo.fetch();
        setIsOnline(state.isConnected ?? true);
      } catch (e) {
        setIsOnline(true);
      }
    }
  };

  const sendCachedAlerts = async () => {
    try {
      const cached = await AsyncStorage.getItem(SOS_CACHE_KEY);
      if (!cached) return;

      const alerts = JSON.parse(cached);
      for (const alert of alerts) {
        await supabase.from('sos_alerts').insert({
          ...alert,
          status: 'sent',
          sent_at: new Date().toISOString(),
        });
      }
      await AsyncStorage.removeItem(SOS_CACHE_KEY);
    } catch (error) {
      console.error('Error sending cached alerts:', error);
    }
  };

  const startCountdown = () => {
    Vibration.vibrate([500, 200, 500, 200, 500]);
    setCountdown(5);
    
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          triggerSOS();
          return null;
        }
        Vibration.vibrate(200);
        return prev - 1;
      });
    }, 1000);
  };

  const cancelCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setCountdown(null);
    Vibration.cancel();
  };

  const triggerSOS = async () => {
    setSending(true);

    const locationText = location 
      ? `Lat: ${location.coords.latitude.toFixed(6)}, Lng: ${location.coords.longitude.toFixed(6)}`
      : 'Location unavailable';

    const googleMapsLink = location
      ? `https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`
      : '';

    const message = `🆘 SOS EMERGENCY ALERT 🆘

${user?.email || 'A hiker'} needs help!

📍 Location: ${locationText}
${googleMapsLink ? `🗺️ Map: ${googleMapsLink}` : ''}
${trailName ? `🥾 Trail: ${trailName}` : ''}

⏰ Time: ${new Date().toLocaleString()}

Please contact emergency services or check on this person immediately.`;

    // Try SMS first (works better with weak signal)
    if (SMS && contacts.length > 0) {
      try {
        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
          const phones = contacts.map(c => c.phone);
          await SMS.sendSMSAsync(phones, message);
        }
      } catch (error) {
        console.error('SMS error:', error);
      }
    } else if (contacts.length > 0) {
      // Fallback: Open SMS app with pre-filled message
      const firstPhone = contacts[0].phone;
      const smsUrl = `sms:${firstPhone}?body=${encodeURIComponent(message)}`;
      try {
        await Linking.openURL(smsUrl);
      } catch (e) {
        console.log('Could not open SMS app');
      }
    }

    // Save to database (or cache if offline)
    const alertData = {
      user_id: user?.id,
      latitude: location?.coords.latitude,
      longitude: location?.coords.longitude,
      altitude: location?.coords.altitude,
      accuracy: location?.coords.accuracy,
      trail_id: trailId || null,
      trail_name: trailName || null,
      message: message,
      was_offline: !isOnline,
      offline_cached_at: !isOnline ? new Date().toISOString() : null,
    };

    if (isOnline) {
      try {
        await supabase.from('sos_alerts').insert({
          ...alertData,
          status: 'sent',
          sent_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error saving alert:', error);
      }
    } else {
      // Cache for later
      try {
        const existing = await AsyncStorage.getItem(SOS_CACHE_KEY);
        const alerts = existing ? JSON.parse(existing) : [];
        alerts.push({ ...alertData, status: 'pending' });
        await AsyncStorage.setItem(SOS_CACHE_KEY, JSON.stringify(alerts));
      } catch (error) {
        console.error('Error caching alert:', error);
      }
    }

    setSending(false);
    setSent(true);
    Vibration.vibrate([200, 100, 200, 100, 200, 100, 1000]);
  };

  const call911 = () => {
    Linking.openURL('tel:911');
  };

  if (sent) {
    return (
      <SafeAreaView style={[sosStyles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
        <View style={sosStyles.sentContainer}>
          <View style={sosStyles.sentIconCircle}>
            <Ionicons name="checkmark" size={60} color="#fff" />
          </View>
          <Text style={[sosStyles.sentTitle, { color: COLORS.text }]}>SOS Alert Sent!</Text>
          <Text style={[sosStyles.sentText, { color: COLORS.textLight }]}>
            {isOnline 
              ? 'Your emergency contacts have been notified with your location.'
              : 'Alert cached! It will be sent automatically when you have signal.'}
          </Text>

          {!isOnline && (
            <View style={sosStyles.offlineCard}>
              <Ionicons name="cloud-offline" size={24} color="#F59E0B" />
              <Text style={sosStyles.offlineText}>
                No internet connection. Your SOS will be sent when signal is restored.
              </Text>
            </View>
          )}

          <View style={[sosStyles.nextStepsCard, { backgroundColor: COLORS.white }]}>
            <Text style={[sosStyles.nextStepsTitle, { color: COLORS.text }]}>What to do now:</Text>
            <View style={sosStyles.nextStep}>
              <Text style={[sosStyles.nextStepNumber, { backgroundColor: COLORS.primary }]}>1</Text>
              <Text style={[sosStyles.nextStepText, { color: COLORS.text }]}>Stay calm and stay put if possible</Text>
            </View>
            <View style={sosStyles.nextStep}>
              <Text style={[sosStyles.nextStepNumber, { backgroundColor: COLORS.primary }]}>2</Text>
              <Text style={[sosStyles.nextStepText, { color: COLORS.text }]}>Make yourself visible (bright clothing, flashlight)</Text>
            </View>
            <View style={sosStyles.nextStep}>
              <Text style={[sosStyles.nextStepNumber, { backgroundColor: COLORS.primary }]}>3</Text>
              <Text style={[sosStyles.nextStepText, { color: COLORS.text }]}>Conserve phone battery</Text>
            </View>
            <View style={sosStyles.nextStep}>
              <Text style={[sosStyles.nextStepNumber, { backgroundColor: COLORS.primary }]}>4</Text>
              <Text style={[sosStyles.nextStepText, { color: COLORS.text }]}>If able, call 911 directly</Text>
            </View>
          </View>

          <TouchableOpacity style={sosStyles.call911Button} onPress={call911}>
            <Ionicons name="call" size={24} color="#fff" />
            <Text style={sosStyles.call911Text}>Call 911</Text>
          </TouchableOpacity>

          <TouchableOpacity style={sosStyles.closeButton} onPress={onClose}>
            <Text style={[sosStyles.closeButtonText, { color: COLORS.textLight }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (countdown !== null) {
    return (
      <SafeAreaView style={[sosStyles.container, sosStyles.countdownContainer]} edges={['top']}>
        <Text style={sosStyles.countdownLabel}>Sending SOS in...</Text>
        <Text style={sosStyles.countdownNumber}>{countdown}</Text>
        <TouchableOpacity style={sosStyles.cancelButton} onPress={cancelCountdown}>
          <Text style={sosStyles.cancelButtonText}>CANCEL</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[sosStyles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      {/* Header */}
      <View style={[sosStyles.header, { backgroundColor: COLORS.white, borderBottomColor: COLORS.border }]}>
        <TouchableOpacity onPress={onClose} style={sosStyles.backButton}>
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={sosStyles.headerTitle}>SOS Emergency</Text>
        <View style={sosStyles.placeholder} />
      </View>

      <ScrollView style={sosStyles.content} showsVerticalScrollIndicator={false}>
        {/* Warning Card */}
        <View style={sosStyles.warningCard}>
          <Ionicons name="warning" size={32} color="#EF4444" />
          <Text style={sosStyles.warningTitle}>Emergency Use Only</Text>
          <Text style={sosStyles.warningText}>
            Only use SOS if you are in a life-threatening emergency and need immediate help.
          </Text>
        </View>

        {/* Connection Status */}
        <View style={[sosStyles.statusCard, !isOnline && sosStyles.statusCardOffline]}>
          <Ionicons 
            name={isOnline ? 'wifi' : 'cloud-offline'} 
            size={20} 
            color={isOnline ? '#22C55E' : '#F59E0B'} 
          />
          <Text style={[sosStyles.statusText, { color: COLORS.text }]}>
            {isOnline 
              ? 'Connected - SOS will be sent immediately' 
              : 'Offline - SOS will send via SMS & cache for later'}
          </Text>
        </View>

        {/* Location Info */}
        <View style={sosStyles.infoSection}>
          <Text style={[sosStyles.infoLabel, { color: COLORS.textLight }]}>Your Location</Text>
          {location ? (
            <View style={[sosStyles.locationCard, { backgroundColor: COLORS.white }]}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
              <Text style={[sosStyles.locationText, { color: COLORS.text }]}>
                {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
              </Text>
            </View>
          ) : (
            <View style={[sosStyles.locationCard, { backgroundColor: COLORS.white }]}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={[sosStyles.locationText, { color: COLORS.text }]}>Getting location...</Text>
            </View>
          )}
        </View>

        {/* Emergency Contacts */}
        <View style={sosStyles.infoSection}>
          <Text style={[sosStyles.infoLabel, { color: COLORS.textLight }]}>
            Will Notify ({contacts.length} contacts)
          </Text>
          {contacts.length > 0 ? (
            <View style={sosStyles.contactsList}>
              {contacts.slice(0, 3).map((contact) => (
                <View key={contact.id} style={[sosStyles.contactChip, { backgroundColor: COLORS.white }]}>
                  <Text style={[sosStyles.contactChipText, { color: COLORS.text }]}>{contact.name}</Text>
                </View>
              ))}
              {contacts.length > 3 && (
                <View style={[sosStyles.contactChip, { backgroundColor: COLORS.white }]}>
                  <Text style={[sosStyles.contactChipText, { color: COLORS.text }]}>+{contacts.length - 3} more</Text>
                </View>
              )}
            </View>
          ) : (
            <Text style={[sosStyles.noContactsText, { color: COLORS.textLight }]}>
              No emergency contacts set. Add contacts in Settings.
            </Text>
          )}
        </View>

        {/* SOS Button */}
        <TouchableOpacity 
          style={sosStyles.sosButton}
          onPress={startCountdown}
          disabled={sending}
          activeOpacity={0.8}
        >
          {sending ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <>
              <Ionicons name="alert-circle" size={40} color="#fff" />
              <Text style={sosStyles.sosButtonText}>SEND SOS</Text>
              <Text style={sosStyles.sosButtonSubtext}>Tap to start 5 second countdown</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Alternative: Call 911 */}
        <TouchableOpacity style={sosStyles.alternativeButton} onPress={call911}>
          <Ionicons name="call" size={22} color="#EF4444" />
          <Text style={sosStyles.alternativeText}>Call 911 Directly</Text>
        </TouchableOpacity>

        {/* Tips */}
        <View style={[sosStyles.tipsCard, { backgroundColor: `${COLORS.primary}10` }]}>
          <Text style={[sosStyles.tipsTitle, { color: COLORS.text }]}>💡 No Signal Tips</Text>
          <Text style={[sosStyles.tipItem, { color: COLORS.text }]}>• Move to higher ground for better reception</Text>
          <Text style={[sosStyles.tipItem, { color: COLORS.text }]}>• SMS often works when data doesn't</Text>
          <Text style={[sosStyles.tipItem, { color: COLORS.text }]}>• Your alert will auto-send when signal returns</Text>
          <Text style={[sosStyles.tipItem, { color: COLORS.text }]}>• iPhone 14+ has satellite SOS capability</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}