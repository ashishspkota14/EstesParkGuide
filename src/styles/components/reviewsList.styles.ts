import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const reviewsListStyles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  writeReviewSection: {
    marginBottom: 20,
  },
  writePrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  writePromptText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  editPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  editPromptText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  userInfo: {
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  reviewDate: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  reviewText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.text,
    marginBottom: 12,
  },
  photosGrid: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  reviewPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  morePhotos: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
  },
  morePhotosText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});