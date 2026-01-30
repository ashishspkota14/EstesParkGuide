import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const elevationProfileStyles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 16,
  },
  
  chartContainer: {
    flexDirection: 'row',
    height: 120,
    marginBottom: 16,
  },
  
  yAxis: {
    width: 50,
    justifyContent: 'space-between',
    paddingVertical: 4,
    marginRight: 8,
  },
  
  axisLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  
  chart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  
  statLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '500',
  },
});