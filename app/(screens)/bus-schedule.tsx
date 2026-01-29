import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';

export default function BusScheduleScreen() {
  const schedules = [
    { route: 'Gold Route', time: 'Every 15 mins', area: 'Downtown / Visitor Center' },
    { route: 'Silver Route', time: 'Every 30 mins', area: 'High School / Community Center' },
    { route: 'Hiker Shuttle', time: 'Every 30 mins', area: 'RMNP Express' },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Shuttle Schedules', 
        headerShown: true,
        headerTintColor: COLORS.primary 
      }} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>Free shuttles operate seasonally in Estes Park.</Text>
        </View>

        {schedules.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.routeTitle}>{item.route}</Text>
            <Text style={styles.routeDetail}>Frequency: {item.time}</Text>
            <Text style={styles.routeDetail}>Area: {item.area}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 20 },
  infoBox: { flexDirection: 'row', backgroundColor: '#e7f3ff', padding: 15, borderRadius: 10, marginBottom: 20, alignItems: 'center' },
  infoText: { marginLeft: 10, color: '#0056b3', flex: 1 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  routeTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 5 },
  routeDetail: { fontSize: 14, color: COLORS.textLight, marginTop: 2 }
});