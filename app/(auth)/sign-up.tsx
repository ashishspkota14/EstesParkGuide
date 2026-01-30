import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { loginStyles } from '../../src/styles/screens/login.styles';
import { COLORS } from '../../src/constants/colors';

export default function SignUpScreen() {
  const { signUp, loading } = useAuth();
  const { returnTo, trailId } = useLocalSearchParams<{ returnTo?: string; trailId?: string }>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigateAfterAuth = () => {
    if (returnTo === 'trail' && trailId) {
      // First go to hiking tab, then push to trail detail
      // This creates a clean stack: Hiking → Trail Detail
      router.replace('/tabs/hiking');
      setTimeout(() => {
        router.push({
          pathname: '/(screens)/trail-detail',
          params: { id: trailId }
        } as any);
      }, 50);
    } else if (returnTo === 'favorites') {
      router.replace('/tabs/favorites');
    } else {
      router.replace('/tabs/hiking');
    }
  };

  const handleSignUp = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    const result = await signUp(email, password, name);
    
    if (result.success) {
      // Navigate to login with params preserved
      if (!result.error) {
        Alert.alert(
          'Success',
          'Account created! Please check your email to verify your account.',
          [{ text: 'OK', onPress: () => router.replace({
            pathname: '/(auth)/login',
            params: { returnTo, trailId }
          } as any) }]
        );
      } else {
        Alert.alert(
          'Account Created',
          result.error,
          [{ text: 'OK', onPress: () => router.replace({
            pathname: '/(auth)/login',
            params: { returnTo, trailId }
          } as any) }]
        );
      }
    } else {
      Alert.alert('Sign Up Failed', result.error || 'Could not create account');
    }
  };

  return (
    <KeyboardAvoidingView
      style={loginStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={loginStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Close Button */}
        <TouchableOpacity
          style={loginStyles.closeButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>

        <View style={loginStyles.content}>
          {/* Logo/Header */}
          <View style={loginStyles.header}>
            <Ionicons name="leaf" size={64} color={COLORS.primary} />
            <Text style={loginStyles.title}>Create Account</Text>
            <Text style={loginStyles.subtitle}>Join us to explore Estes Park trails</Text>
          </View>

          {/* Name Input */}
          <View style={loginStyles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.textLight} style={loginStyles.inputIcon} />
            <TextInput
              style={loginStyles.input}
              placeholder="Full Name"
              placeholderTextColor={COLORS.textLight}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>

          {/* Email Input */}
          <View style={loginStyles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textLight} style={loginStyles.inputIcon} />
            <TextInput
              style={loginStyles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          {/* Password Input */}
          <View style={loginStyles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} style={loginStyles.inputIcon} />
            <TextInput
              style={loginStyles.input}
              placeholder="Password (min 6 characters)"
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password-new"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={loginStyles.eyeIcon}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={loginStyles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} style={loginStyles.inputIcon} />
            <TextInput
              style={loginStyles.input}
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.textLight}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoComplete="password-new"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={loginStyles.eyeIcon}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[loginStyles.signInButton, loading && loginStyles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={loginStyles.signInButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Sign In Link - Pass returnTo and trailId to login */}
          <View style={loginStyles.signUpContainer}>
            <Text style={loginStyles.signUpText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => router.push({
                pathname: '/(auth)/login',
                params: { returnTo, trailId }
              })}
              activeOpacity={0.7}
            >
              <Text style={loginStyles.signUpLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Skip Sign Up - Go back or to hiking */}
          <TouchableOpacity
            style={loginStyles.skipButton}
            onPress={navigateAfterAuth}
            activeOpacity={0.7}
          >
            <Text style={loginStyles.skipButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}