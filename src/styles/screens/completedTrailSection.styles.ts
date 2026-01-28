import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const completedTrailsStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  dateBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)', // Adding a subtle background so text is readable over trail images
  },
  dateText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    opacity: 0.5,
  },
});