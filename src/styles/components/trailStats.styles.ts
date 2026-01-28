import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const trailStatsStyles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 16,
  },
  statGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});