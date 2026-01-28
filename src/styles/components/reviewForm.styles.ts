import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const reviewFormStyles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  stars: {
    flexDirection: 'row',
    gap: 8,
  },
  commentContainer: {
    marginBottom: 20,
  },
  commentInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: COLORS.text,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  photosContainer: {
    marginBottom: 20,
  },
  photosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removePhoto: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addPhoto: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  addPhotoText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});