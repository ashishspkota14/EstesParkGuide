import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  GestureResponderEvent,
  LayoutChangeEvent,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../context/ThemeContext';

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
  const COLORS = useColors();
  const WrapperComponent = Platform.OS === 'ios' ? BlurView : View;
  const blurProps = Platform.OS === 'ios' ? { intensity: 80, tint: 'light' as const } : {};
  
  const touchStartX = useRef(0);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const highlightPosition = useRef(new Animated.Value(state.index)).current;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tabPositions, setTabPositions] = useState<number[]>([]);

  useEffect(() => {
    if (!isSwiping) {
      Animated.spring(highlightPosition, {
        toValue: state.index,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }
  }, [state.index, isSwiping]);

  const handleTabLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    const centerX = x + (width / 2) - 27;
    
    setTabPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = centerX;
      return newPositions;
    });
  };

  const handleTouchStart = (e: GestureResponderEvent) => {
    touchStartX.current = e.nativeEvent.pageX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: GestureResponderEvent) => {
    const currentX = e.nativeEvent.pageX;
    const deltaX = currentX - touchStartX.current;
    
    if (tabPositions.length === 5) {
      const tabBarLeft = 30;
      const relativeX = currentX - tabBarLeft;
      
      let closestIndex = 0;
      let minDistance = Infinity;
      
      tabPositions.forEach((pos, idx) => {
        const distance = Math.abs(relativeX - (pos + 27));
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = idx;
        }
      });
      
      setHoverIndex(closestIndex);
      highlightPosition.setValue(closestIndex);
    }
    
    const progress = Math.min(Math.abs(deltaX) / 100, 1);
    setSwipeProgress(progress);
  };

  const handleTouchEnd = (e: GestureResponderEvent) => {
    if (hoverIndex !== null && hoverIndex !== state.index) {
      navigation.navigate(state.routes[hoverIndex].name);
    }

    setIsSwiping(false);
    setSwipeProgress(0);
    setHoverIndex(null);
  };

  const highlightTranslateX = highlightPosition.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: tabPositions.length === 5 
      ? tabPositions 
      : [0, 0, 0, 0, 0],
  });

  return (
    <View 
      style={styles.wrapper}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <WrapperComponent {...blurProps} style={[styles.blur, Platform.OS === 'android' && { backgroundColor: 'rgba(255, 255, 255, 0.95)' }]}>
        <View style={styles.container}>
          {tabPositions.length === 5 && (
            <Animated.View
              style={[
                styles.movingHighlight,
                {
                  backgroundColor: COLORS.primary,
                  shadowColor: COLORS.primary,
                  transform: [{ translateX: highlightTranslateX }],
                  opacity: isSwiping ? 0.7 : 1,
                },
              ]}
            />
          )}

          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            const isHovered = hoverIndex === index;
            const icon = ICONS[route.name];

            if (!icon) return null;

            return (
              <TabItem
                key={route.key}
                icon={icon}
                isFocused={isFocused}
                isHovered={isHovered}
                isSwiping={isSwiping}
                onPress={() => navigation.navigate(route.name)}
                onLayout={(e: LayoutChangeEvent) => handleTabLayout(index, e)}
              />
            );
          })}
        </View>
      </WrapperComponent>
    </View>
  );
}

function TabItem({ icon, isFocused, isHovered, isSwiping, onPress, onLayout }: any) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isFocused || isHovered ? 1.1 : 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [isFocused, isHovered]);

  const showActive = isHovered || isFocused;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.touch}
      onLayout={onLayout}
    >
      <Animated.View
        style={[
          styles.item,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Ionicons
          name={showActive ? icon.active : icon.inactive}
          size={20}
          color={showActive ? '#ffffff' : '#6b7280'}
        />
        <Text
          style={[
            styles.label,
            showActive && styles.activeLabel,
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
  },
  container: {
    flexDirection: 'row',
    height: 65,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  movingHighlight: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  touch: {
    flex: 1,
    alignItems: 'center',
    zIndex: 10,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
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