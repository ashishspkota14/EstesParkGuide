import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
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

  return (
    <View style={styles.wrapper}>
      <WrapperComponent {...blurProps} style={styles.blur}>
        <View style={styles.container}>
          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            const icon = ICONS[route.name];

            if (!icon) return null;

            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
                activeOpacity={0.7}
                style={styles.touch}
              >
                <View
                  style={[
                    styles.item,
                    isFocused && styles.activeItem,
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
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </WrapperComponent>
    </View>
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