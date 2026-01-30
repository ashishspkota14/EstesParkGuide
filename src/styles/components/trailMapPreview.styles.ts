import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const trailMapPreviewStyles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
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
    color: COLORS.text,
  },
  
  fullMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  fullMapText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  
  map: {
    flex: 1,
  },
  
  // 3D Toggle Button (top right)
  toggleButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  
  // Preview Trail Button (bottom left)
  previewButton: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 20,
  },
  
  previewText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Legacy styles (keep for compatibility)
  marker: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 12,
  },
  
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 4,
  },
  
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },
});