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
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { loginStyles } from '../../src/styles/screens/login.styles';
import { COLORS } from '../../src/constants/colors';

export default function LoginScreen() {
  const { signIn, loading } = useAuth();
  const { returnTo, trailId } = useLocalSearchParams<{ returnTo?: string; trailId?: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigateAfterAuth = () => {
    // Always go to hiking tab for now - simplest approach
    router.replace('/tabs/hiking');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result = await signIn(email, password);
    
    if (result.success) {
      navigateAfterAuth();
    } else {
      Alert.alert('Login Failed', result.error || 'Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView
      style={loginStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
          <Text style={loginStyles.title}>Welcome Back</Text>
          <Text style={loginStyles.subtitle}>Sign in to save your favorite trails</Text>
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
            placeholder="Password"
            placeholderTextColor={COLORS.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password"
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

        {/* Forgot Password */}
        <TouchableOpacity
          style={loginStyles.forgotPassword}
          activeOpacity={0.7}
        >
          <Text style={loginStyles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          style={[loginStyles.signInButton, loading && loginStyles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={loginStyles.signInButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Link - Pass returnTo and trailId to sign-up */}
        <View style={loginStyles.signUpContainer}>
          <Text style={loginStyles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => router.push({
              pathname: '/(auth)/sign-up',
              params: { returnTo, trailId }
            })}
            activeOpacity={0.7}
          >
            <Text style={loginStyles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Skip Login - Go back or to hiking */}
        <TouchableOpacity
          style={loginStyles.skipButton}
          onPress={navigateAfterAuth}
          activeOpacity={0.7}
        >
          <Text style={loginStyles.skipButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}