import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  button3D: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  buttonTextActive: {
    color: COLORS.primary,
  },
  buttonLayers: {
    position: 'absolute',
    top: 130,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  trailInfoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  trailInfo: {
    gap: 8,
  },
  trailName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  trailStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trailStat: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  trailStatDivider: {
    color: COLORS.textLight,
    fontSize: 14,
  },
});