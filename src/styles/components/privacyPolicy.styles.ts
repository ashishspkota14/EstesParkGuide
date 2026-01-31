import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const privacyPolicyStyles = StyleSheet.create({
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

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
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
    padding: 20,
    paddingBottom: 40,
  },

  lastUpdated: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 24,
    fontStyle: 'italic',
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },

  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },

  paragraph: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 12,
  },

  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    paddingLeft: 8,
  },

  bullet: {
    fontSize: 15,
    color: COLORS.primary,
    marginRight: 10,
    lineHeight: 24,
  },

  bulletText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
  },

  contactCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },

  contactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    marginTop: 12,
  },

  contactValue: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },

  footer: {
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 16,
  },

  footerText: {
    fontSize: 13,
    color: COLORS.textLight,
  },
});