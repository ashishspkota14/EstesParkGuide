import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    // We are increasing this to force a move
    paddingTop: 30, 
    paddingBottom: 20,
    backgroundColor: COLORS.background, // Ensure no overlap
  },
  closeBtn: {
    padding: 10, // Larger hit area
    marginTop: -5,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: 25,
    marginBottom: 12,
    letterSpacing: 1.2,
    color: COLORS.textLight,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
});