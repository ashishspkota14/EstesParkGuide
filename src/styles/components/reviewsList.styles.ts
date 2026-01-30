import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const reviewsListStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  
  // Header
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  
  // Write Review Section
  writeReviewSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  
  // Write Prompt (green button for new review) - SMALLER & CENTERED
  writePrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    gap: 8,
  },
  promptIconWrap: {
    // Not used anymore
  },
  promptTextWrap: {
    // Not used anymore
  },
  writePromptText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  writePromptSubtext: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  
  // Edit Prompt (light green for existing review) - SMALLER & CENTERED
  editPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${COLORS.primary}12`,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: `${COLORS.primary}30`,
    gap: 8,
  },
  editPromptText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  promptSubtext: {
    // Not used anymore
  },
  
  // Review Card
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
  },
  userInfo: {
    gap: 4,
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${COLORS.primary}12`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Review Content
  reviewText: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.text,
  },
  
  // Photos Grid
  photosGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  reviewPhoto: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});