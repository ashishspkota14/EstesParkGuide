import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const photoCarouselStyles = StyleSheet.create({
  container: {
    height: 300,
    backgroundColor: '#000',
  },
  photo: {
    width: SCREEN_WIDTH,
    height: 300,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 24,
  },
  countBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  countText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});