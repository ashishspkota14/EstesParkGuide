import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const trailWeatherStyles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 16,
  },
  
  loader: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Hero Card - Light Green Theme
  heroCard: {
    backgroundColor: `${COLORS.primary}08`, // Very light green
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: `${COLORS.primary}20`,
  },
  
  // Selected Day Badge (when viewing future forecast)
  selectedDayBadge: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  
  selectedDayText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  
  currentWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  
  tempSection: {
    flex: 1,
  },
  
  temperature: {
    fontSize: 44,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 48,
  },
  
  weatherCondition: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 2,
  },
  
  feelsLike: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 3,
  },
  
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: `${COLORS.primary}15`,
  },
  
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 12,
  },
  
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  
  statLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  
  // Sunrise/Sunset Row
  sunTimesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: `${COLORS.primary}15`,
  },
  
  sunTimeBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  sunTimeDivider: {
    width: 1,
    height: 24,
    backgroundColor: `${COLORS.primary}20`,
    marginHorizontal: 12,
  },
  
  sunTimeLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  
  sunTimeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  
  // 7-Day Forecast - CLICKABLE DESIGN
  forecastTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  
  forecastScroll: {
    marginBottom: 16,
  },
  
  forecastContent: {
    paddingRight: 20,
  },
  
  // Unselected Day
  forecastDay: {
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}06`,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 8,
    minWidth: 64,
    borderWidth: 1.5,
    borderColor: `${COLORS.primary}15`,
  },
  
  // Selected Day - Dark Green Highlight
  forecastDaySelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  dayName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 6,
  },
  
  dayNameSelected: {
    color: COLORS.white,
    fontWeight: '700',
  },
  
  // Icon wrapper for better visual
  forecastIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  forecastIconWrapSelected: {
    backgroundColor: `rgba(255,255,255,0.2)`,
  },
  
  tempHigh: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 4,
  },
  
  tempHighSelected: {
    color: COLORS.white,
  },
  
  tempLow: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 1,
  },
  
  tempLowSelected: {
    color: 'rgba(255,255,255,0.7)',
  },
  
  rainChance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 6,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  
  rainChanceSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  
  rainChanceText: {
    fontSize: 10,
    color: '#1976D2',
    fontWeight: '600',
  },
  
  rainChanceTextSelected: {
    color: COLORS.white,
  },
  
  // Today's Trail Condition - COMPACT
  todayConditionCard: {
    marginBottom: 0,
  },
  
  todayConditionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  todayConditionEmoji: {
    fontSize: 22,
  },
  
  todayConditionContent: {
    flex: 1,
  },
  
  todayConditionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 2,
  },
  
  todayConditionText: {
    fontSize: 15,
    fontWeight: '700',
  },
  
  // Deprecated
  todayConditionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
});