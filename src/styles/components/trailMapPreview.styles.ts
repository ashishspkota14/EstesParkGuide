import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const trailMapPreviewStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  viewFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewFullText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  mapContainer: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  map: {
    flex: 1,
  },
  toggle3D: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  previewButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  previewText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
});