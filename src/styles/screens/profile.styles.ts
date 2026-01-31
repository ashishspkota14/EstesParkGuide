import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 100,
  },

  // ============ GUEST VIEW ============
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  guestIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  guestTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  guestText: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginBottom: 14,
    width: '100%',
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  createAccountButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  createAccountText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  featureList: {
    marginTop: 32,
    gap: 16,
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
    flex: 1,
  },

  // ============ HEADER ============
  headerContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
  },

  // ============ PROFILE INFO ============
  profileInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },

  // ============ HIKER LEVEL BADGE ============
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  levelIcon: {
    fontSize: 16,
  },
  levelText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // ============ STATS ROW ============
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
  },
  statVal: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  statLab: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
    fontWeight: '500',
  },

  // ============ REWARD CARD ============
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00704A', // Starbucks green
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  rewardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardIcon: {
    fontSize: 24,
  },
  rewardContent: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  rewardText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 16,
  },

  // ============ TABS ============
  tabWrapper: {
    flexDirection: 'row',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  activeTabText: {
    color: COLORS.primary,
  },

  // ============ EMPTY STATES ============
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  reviewBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  // ============ TRAIL CARDS ============
  cardPadding: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  // ============ REVIEWS LIST ============
  reviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  reviewImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  reviewContent: {
    flex: 1,
    gap: 4,
  },
  reviewTrailName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },

  // ============ PHOTOS SECTION ============
  photosSection: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  uploadCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  uploadIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  uploadText: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 6,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoItem: {
    width: (SCREEN_WIDTH - 48) / 3,
    height: (SCREEN_WIDTH - 48) / 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  photoTrailName: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  noPhotosContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noPhotosText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});