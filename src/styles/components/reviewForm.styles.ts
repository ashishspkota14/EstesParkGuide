import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const reviewFormStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Sections
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },
  labelHint: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: -6,
    marginBottom: 12,
  },
  
  // Star Rating
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 4,
  },
  
  // Text Input
  textInput: {
    backgroundColor: `${COLORS.primary}06`,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.text,
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'right',
    marginTop: 6,
  },
  
  // Photos
  photosScroll: {
    marginTop: 4,
  },
  photosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoWrapper: {
    position: 'relative',
  },
  photoPreview: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  addPhotoButton: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: `${COLORS.primary}30`,
    borderStyle: 'dashed',
    backgroundColor: `${COLORS.primary}08`,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addPhotoText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  
  // Action Buttons
  actions: {
    marginTop: 8,
    gap: 12,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E74C3C',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});