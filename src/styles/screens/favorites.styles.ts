import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const favoritesStyles = StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
  },
  count: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  cardContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});