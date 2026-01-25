import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Icon */}
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={80} color={COLORS.white} />
          <Text style={styles.title}>Estes Park Guide</Text>
          <Text style={styles.subtitle}>Discover the best trails in Estes Park</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {/* Sign In Button */}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => router.push('/(auth)/sign-up')}
            activeOpacity={0.8}
          >
            <Text style={styles.signUpButtonText}>Create Account</Text>
          </TouchableOpacity>

          {/* Continue as Guest */}
          <TouchableOpacity
            style={styles.guestButton}
            onPress={() => router.replace('/tabs/hiking')}
            activeOpacity={0.7}
          >
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="map" size={24} color={COLORS.white} />
            <Text style={styles.featureText}>Interactive Trail Maps</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="heart" size={24} color={COLORS.white} />
            <Text style={styles.featureText}>Save Your Favorites</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="sunny" size={24} color={COLORS.white} />
            <Text style={styles.featureText}>Real-Time Weather</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 60,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.white,
    marginTop: 12,
    textAlign: 'center',
    opacity: 0.9,
  },
  buttonContainer: {
    gap: 16,
  },
  signInButton: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  signInButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  signUpButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  signUpButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  guestButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  features: {
    gap: 16,
    marginTop: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
});