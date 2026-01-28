import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const trailDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    padding: 20,
    paddingTop: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontSize: 15,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFF8E1',
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F57C00',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text,
  },
});