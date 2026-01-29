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
    color: '#1a1a1a',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 12,
  },
  loader: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  heroCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  currentWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempSection: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '900',
    color: '#1a1a1a',
    lineHeight: 52,
  },
  weatherCondition: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  forecastScroll: {
    marginBottom: 8,
  },
  forecastDay: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginRight: 10,
    width: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  tempHigh: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a1a',
    marginTop: 8,
  },
  tempLow: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    marginTop: 2,
  },
  elevationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  insightsCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  insightItem: {
    marginBottom: 10,
  },
  insightText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export const elevationStyles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  labelBox: {
    alignItems: 'center',
  },
  labelBoxPeak: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  labelValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333',
  },
  labelText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 70,
    paddingHorizontal: 4,
  },
  bar: {
    width: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  distanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  distanceText: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
  },
});