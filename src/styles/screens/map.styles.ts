import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    flex: 1,
  },

  // Header
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 80,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // Right Side Controls
  controlsRight: {
    position: 'absolute',
    top: 50,
    right: 16,
    gap: 10,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  controlButtonActive: {
    backgroundColor: COLORS.primary,
  },

  // Style Indicator
  styleIndicator: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  styleIndicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Category Indicator (shows when panel is closed)
  categoryIndicator: {
    position: 'absolute',
    top: 100,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIndicatorText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  // Trail Markers
  markerContainer: {
    alignItems: 'center',
  },
  trailMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  trailMarkerSelected: {
    backgroundColor: COLORS.primary,
    transform: [{ scale: 1.15 }],
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.primary,
    marginTop: -2,
  },
  markerArrowSelected: {
    borderTopColor: COLORS.primary,
  },

  // Info Message (for non-trail categories)
  infoMessage: {
    position: 'absolute',
    bottom: 100, // Above tabs
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoMessageText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },

  // Selected Trail Card - POSITIONED ABOVE TABS
  trailCard: {
    position: 'absolute',
    bottom: 100, // Above tab bar (~80-90px tab height + padding)
    left: 16,
    right: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  trailCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  trailCardImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  trailCardInfo: {
    flex: 1,
    gap: 6,
  },
  trailCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  trailCardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'capitalize',
  },
  trailCardStat: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  trailCardStatDivider: {
    fontSize: 13,
    color: COLORS.border,
  },

  // Legacy styles (keep for compatibility)
  button3D: {
    position: 'absolute',
    top: 100,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextActive: {
    color: COLORS.primary,
  },
  buttonLayers: {
    position: 'absolute',
    top: 160,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 12,
  },
  navBanner: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4ADE80',
  },
  navText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  trailInfoCard: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  trailInfo: {
    gap: 8,
  },
  trailName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  trailStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trailStat: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  trailStatDivider: {
    marginHorizontal: 8,
    color: COLORS.border,
  },
});