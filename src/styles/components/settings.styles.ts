import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },

  placeholder: {
    width: 40,
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  section: {
    backgroundColor: COLORS.white,
    marginTop: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: `${COLORS.primary}08`,
    borderRadius: 12,
  },

  accountInfo: {
    flex: 1,
  },

  accountEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },

  accountId: {
    fontSize: 12,
    color: COLORS.textLight,
  },

  accountBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  accountBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  settingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${COLORS.primary}12`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  settingText: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },

  settingSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },

  themeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textLight,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  themeScroll: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },

  themeOption: {
    alignItems: 'center',
    width: 72,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },

  themeOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}08`,
  },

  themeColor: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  themeIcon: {
    fontSize: 22,
  },

  themeName: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textLight,
    textAlign: 'center',
  },

  themeNameSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  themeCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
  },

  unitOptions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },

  unitOption: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
  },

  unitOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}08`,
  },

  unitName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },

  unitNameSelected: {
    color: COLORS.primary,
  },

  unitSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
  },

  unitSubtitleSelected: {
    color: COLORS.primary,
  },

  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },

  dangerZone: {
    marginHorizontal: 16,
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  dangerTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },

  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  deleteText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },

  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },

  footerVersion: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
});