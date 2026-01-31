import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const achievementStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  count: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  badgesScroll: {
    gap: 12,
    paddingRight: 16,
  },
  badge: {
    alignItems: 'center',
    width: 72,
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  badgeEmoji: {
    fontSize: 26,
  },
  badgeName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  lockedBadge: {
    opacity: 0.6,
  },
  lockedIcon: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  lockedName: {
    color: COLORS.textLight,
  },
  viewAllBadge: {
    alignItems: 'center',
    width: 72,
  },
  viewAllIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  viewAllCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  progressHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: `${COLORS.primary}08`,
    borderRadius: 10,
  },
  progressText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },
  progressBold: {
    fontWeight: '700',
    color: COLORS.text,
  },
});