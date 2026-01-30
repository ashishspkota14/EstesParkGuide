import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../../constants/colors';

export const trailMapStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  map: {
    flex: 1,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  
  loadingText: {
    color: COLORS.textLight,
    fontSize: 16,
    marginTop: 12,
  },
  
  backButtonAlt: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  
  backButtonAltText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Header
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  
  trailName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  
  // Right Side Buttons
  rightButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 110 : 100,
    right: 16,
    gap: 10,
    zIndex: 10,
  },
  
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  
  controlButtonActive: {
    backgroundColor: COLORS.primary,
  },
  
  // Style Picker
  stylePickerContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 170 : 160,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 20,
  },
  
  styleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  
  styleOptionActive: {
    backgroundColor: `${COLORS.primary}15`,
  },
  
  styleOptionText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  
  styleOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  
  // Bottom Card
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  
  trailInfo: {
    marginBottom: 16,
  },
  
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  previewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  
  // Legend
  legend: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 180 : 160,
    left: 16,
    flexDirection: 'row',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
});