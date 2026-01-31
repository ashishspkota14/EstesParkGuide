import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const sosStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  countdownContainer: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },

  countdownLabel: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },

  countdownNumber: {
    fontSize: 120,
    fontWeight: '800',
    color: '#fff',
  },

  cancelButton: {
    marginTop: 40,
    paddingVertical: 16,
    paddingHorizontal: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },

  cancelButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
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

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EF4444',
  },

  placeholder: {
    width: 40,
  },

  content: {
    flex: 1,
    padding: 16,
  },

  warningCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },

  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#991B1B',
    marginTop: 12,
    marginBottom: 8,
  },

  warningText: {
    fontSize: 14,
    color: '#7F1D1D',
    textAlign: 'center',
    lineHeight: 20,
  },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },

  statusCardOffline: {
    backgroundColor: '#FFFBEB',
  },

  statusText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
  },

  infoSection: {
    marginBottom: 20,
  },

  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
  },

  locationText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },

  contactsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  contactChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  contactChipText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },

  noContactsText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },

  sosButton: {
    backgroundColor: '#EF4444',
    borderRadius: 100,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },

  sosButtonText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginTop: 12,
  },

  sosButtonSubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },

  alternativeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },

  alternativeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },

  tipsCard: {
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
    marginBottom: 40,
  },

  tipsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },

  tipItem: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 22,
  },

  sentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  sentIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  sentTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
  },

  sentText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },

  offlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },

  offlineText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
  },

  nextStepsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 24,
  },

  nextStepsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },

  nextStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  nextStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    overflow: 'hidden',
  },

  nextStepText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
  },

  call911Button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 16,
  },

  call911Text: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },

  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
  },

  closeButtonText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});