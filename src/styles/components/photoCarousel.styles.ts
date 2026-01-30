import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const photoCarouselStyles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 280,
    backgroundColor: '#f0f0f0',
  },
  photo: {
    width: SCREEN_WIDTH,
    height: 280,
  },
  
  // Pagination Dots
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  
  // Review photo dots (slightly different color to indicate user content)
  reviewDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  reviewDotActive: {
    backgroundColor: COLORS.primary,
    borderWidth: 0,
  },
  
  // Photo Count Badge (bottom right)
  countBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  countText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  
  // User Photo Badge (top left - shows when viewing user-uploaded photo)
  userPhotoBadge: {
    position: 'absolute',
    top: 60, // Below status bar / back button
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  userPhotoText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});