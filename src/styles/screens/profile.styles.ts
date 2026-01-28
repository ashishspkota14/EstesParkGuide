import { StyleSheet, Platform } from 'react-native'; // Added Platform
import { COLORS } from '../../constants/colors';

export const profileStyles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    paddingHorizontal: 20,
    // Android stays at 40, iOS gets pushed to 55 to match the Settings cross icon
    paddingTop: Platform.OS === 'ios' ? 55 : 40, 
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 15,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 12,
    color: COLORS.text,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 25,
    borderRadius: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#f0f0f0',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },
  statLab: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  tabWrapper: {
    flexDirection: 'row',
    marginTop: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontWeight: '700',
    fontSize: 15,
    color: '#999',
  },
  cardPadding: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 25,
    fontSize: 15,
    lineHeight: 22,
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  reviewBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});