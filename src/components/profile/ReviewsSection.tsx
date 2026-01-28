import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export default function ReviewsSection() {
  return (
    <View style={styles.container}>
      <Ionicons name="chatbox-ellipses-outline" size={50} color={COLORS.border} />
      <Text style={[styles.text, { color: COLORS.textLight }]}>
        You haven't reviewed any trails yet.
      </Text>
      <TouchableOpacity 
        style={[styles.btn, { backgroundColor: COLORS.primary }]}
        onPress={() => router.push('/(tabs)/hiking')}
      >
        <Text style={styles.btnText}>Find a Trail to Review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  text: { textAlign: 'center', marginTop: 15, marginBottom: 25, fontSize: 16, fontWeight: '500' },
  btn: { paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25 },
  btnText: { color: 'white', fontWeight: '700' }
});