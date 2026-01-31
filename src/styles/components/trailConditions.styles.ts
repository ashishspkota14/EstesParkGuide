import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const trailConditionsStyles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    // backgroundColor and borderLeftColor applied dynamically in component
    borderRadius: 12,
    padding: 16,
    paddingLeft: 14,
    borderLeftWidth: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  conditionsList: {
    gap: 10,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  conditionEmoji: {
    fontSize: 15,
    width: 20,
  },
  conditionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.text,
    fontWeight: '400',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
});