import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  GestureResponderEvent,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const ACTIVE_GREEN = '#2d5a3f';

const ICONS: Record<
  string,
  {
    active: keyof typeof Ionicons.glyphMap;
    inactive: keyof typeof Ionicons.glyphMap;
    label: string;
  }
> = {
  hiking: { active: 'walk', inactive: 'walk-outline', label: 'Hiking' },
  explore: { active: 'compass', inactive: 'compass-outline', label: 'Explore' },
  map: { active: 'map', inactive: 'map-outline', label: 'Map' },
  favorites: { active: 'heart', inactive: 'heart-outline', label: 'Favorites' },
  profile: { active: 'person', inactive: 'person-outline', label: 'Profile' },
};

export function GlassTabBar({ state, descriptors, navigation }: any) {
  const WrapperComponent = Platform.OS === 'ios' ? BlurView : View;
  const blurProps = Platform.OS === 'ios' ? { intensity: 80, tint: 'light' as const } : {};
  
  const touchStartX = useRef(0);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e: GestureResponderEvent) => {
    touchStartX.current = e.nativeEvent.pageX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: GestureResponderEvent) => {
    const currentX = e.nativeEvent.pageX;
    const deltaX = currentX - touchStartX.current;
    // Calculate progress (0 to 1) based on swipe distance
    const progress = Math.min(Math.abs(deltaX) / 100, 1);
    setSwipeProgress(progress);
  };

  const handleTouchEnd = (e: GestureResponderEvent) => {
    const touchEndX = e.nativeEvent.pageX;
    const deltaX = touchEndX - touchStartX.current;

    // FIXED: Swipe RIGHT (finger moves right) → go to NEXT tab (right in list)
    if (deltaX > 50 && state.index < state.routes.length - 1) {
      navigation.navigate(state.routes[state.index + 1].name);
    }
    // FIXED: Swipe LEFT (finger moves left) → go to PREVIOUS tab (left in list)
    else if (deltaX < -50 && state.index > 0) {
      navigation.navigate(state.routes[state.index - 1].name);
    }

    // Reset swipe state
    setIsSwiping(false);
    setSwipeProgress(0);
  };

  return (
    <View 
      style={styles.wrapper}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <WrapperComponent {...blurProps} style={styles.blur}>
        <View style={styles.container}>
          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            const icon = ICONS[route.name];

            if (!icon) return null;

            return (
              <TabItem
                key={route.key}
                icon={icon}
                isFocused={isFocused}
                isSwiping={isSwiping}
                swipeProgress={swipeProgress}
                onPress={() => navigation.navigate(route.name)}
              />
            );
          })}
        </View>
      </WrapperComponent>
    </View>
  );
}

// Separate component for smooth animations
function TabItem({ icon, isFocused, isSwiping, swipeProgress, onPress }: any) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1.1 : 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [isFocused]);

  // Calculate opacity based on swipe progress
  const backgroundOpacity = isFocused && isSwiping 
    ? 1 - (swipeProgress * 0.5) // Fade from 1.0 to 0.5 during swipe
    : 1;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.touch}
    >
      <Animated.View
        style={[
          styles.item,
          isFocused && {
            ...styles.activeItem,
            backgroundColor: `rgba(45, 90, 63, ${backgroundOpacity})`,
          },
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Ionicons
          name={isFocused ? icon.active : icon.inactive}
          size={20}
          color={isFocused ? '#ffffff' : '#6b7280'}
        />
        <Text
          style={[
            styles.label,
            isFocused && styles.activeLabel,
          ]}
        >
          {icon.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 25,
    left: 30,
    right: 30,
    borderRadius: 35,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  blur: {
    borderRadius: 35,
    backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
  },
  container: {
    flexDirection: 'row',
    height: 65,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  touch: {
    flex: 1,
    alignItems: 'center',
  },
  item: {
    minWidth: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  activeItem: {
    backgroundColor: ACTIVE_GREEN,
    shadowColor: ACTIVE_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 2,
  },
  activeLabel: {
    color: '#ffffff',
  },
});