import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const trailWeatherStyles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
  },
  loader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  weatherCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  currentWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  tempContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: 52,
  },
  weatherDesc: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#f0f0f0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  insightsCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  insightText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    flex: 1,
  },
});