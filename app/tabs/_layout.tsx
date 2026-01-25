import { Tabs } from 'expo-router';
import React from 'react';
import { GlassTabBar } from '../../src/components/navigation/GlassTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="hiking" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}





// import { Tabs } from 'expo-router';
// import React from 'react';
// import { Ionicons } from '@expo/vector-icons';
// import { Platform, StyleSheet, Dimensions } from 'react-native';
// import { BlurView } from 'expo-blur';
// import { COLORS } from '../../src/constants/colors';

// const { width } = Dimensions.get('window');

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: COLORS.primary,
//         tabBarInactiveTintColor: COLORS.textLight,
//         headerShown: false,
//         tabBarStyle: {
//           position: 'absolute',
//           bottom: 30,
//           left: 30,
//           right: 30,
//           height: 80,
//           borderRadius: 40,
//           backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.85)' : COLORS.card,
//           borderWidth: 1,
//           borderColor: 'rgba(200, 200, 200, 0.2)',
//           paddingBottom: 12,
//           paddingTop: 12,
//           paddingHorizontal: 12,
//           shadowColor: COLORS.shadow,
//           shadowOffset: { width: 0, height: 10 },
//           shadowOpacity: 0.2,
//           shadowRadius: 25,
//           elevation: 10,
//         },
//         tabBarBackground: () => (
//           Platform.OS === 'ios' ? (
//             <BlurView
//               intensity={90}
//               tint="light"
//               style={StyleSheet.absoluteFill}
//             />
//           ) : null
//         ),
//         tabBarLabelStyle: {
//           fontSize: 10,
//           fontWeight: '600',
//           marginTop: 2,
//           marginBottom: 0,
//         },
//         tabBarItemStyle: {
//           height: 56,
//           borderRadius: 28,
//           marginHorizontal: 2,
//           justifyContent: 'center',
//           alignItems: 'center',
//         },
//         tabBarActiveBackgroundColor: 'rgba(45, 90, 63, 0.15)',
//         tabBarHideOnKeyboard: true,
//         animation: 'shift',
//       }}
//     >
//       <Tabs.Screen
//         name="hiking"
//         options={{
//           title: 'Hiking',
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons 
//               name={focused ? "walk" : "walk-outline"} 
//               size={22} 
//               color={color} 
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: 'Explore',
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons 
//               name={focused ? "compass" : "compass-outline"} 
//               size={22} 
//               color={color} 
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="map"
//         options={{
//           title: 'Map',
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons 
//               name={focused ? "map" : "map-outline"} 
//               size={22} 
//               color={color} 
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="favorites"
//         options={{
//           title: 'Favorites',
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons 
//               name={focused ? "heart" : "heart-outline"} 
//               size={22} 
//               color={color} 
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons 
//               name={focused ? "person" : "person-outline"} 
//               size={22} 
//               color={color} 
//             />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }