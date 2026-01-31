import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { privacyPolicyStyles } from '../../styles/components/privacyPolicy.styles';

interface PrivacyPolicyProps {
  onClose: () => void;
}

export default function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
  const { theme } = useTheme();
  const COLORS = theme;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={privacyPolicyStyles.section}>
      <Text style={[privacyPolicyStyles.sectionTitle, { color: COLORS.text }]}>{title}</Text>
      {children}
    </View>
  );

  const Paragraph = ({ children }: { children: string }) => (
    <Text style={[privacyPolicyStyles.paragraph, { color: COLORS.text }]}>{children}</Text>
  );

  const BulletPoint = ({ children }: { children: string }) => (
    <View style={privacyPolicyStyles.bulletRow}>
      <Text style={[privacyPolicyStyles.bullet, { color: COLORS.primary }]}>•</Text>
      <Text style={[privacyPolicyStyles.bulletText, { color: COLORS.text }]}>{children}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[privacyPolicyStyles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      <View style={[privacyPolicyStyles.header, { backgroundColor: COLORS.white, borderBottomColor: COLORS.border }]}>
        <TouchableOpacity onPress={onClose} style={privacyPolicyStyles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={[privacyPolicyStyles.headerTitle, { color: COLORS.text }]}>Privacy Policy</Text>
        <View style={privacyPolicyStyles.placeholder} />
      </View>

      <ScrollView style={privacyPolicyStyles.content} showsVerticalScrollIndicator={false} contentContainerStyle={privacyPolicyStyles.scrollContent}>
        <Text style={[privacyPolicyStyles.lastUpdated, { color: COLORS.textLight }]}>Last Updated: January 2025</Text>

        <Section title="Introduction">
          <Paragraph>Welcome to Estes Park Hiking. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.</Paragraph>
        </Section>

        <Section title="Information We Collect">
          <Text style={[privacyPolicyStyles.subTitle, { color: COLORS.text }]}>Account Information</Text>
          <Paragraph>When you create an account, we collect:</Paragraph>
          <BulletPoint>Email address</BulletPoint>
          <BulletPoint>Password (encrypted and securely stored)</BulletPoint>
          <BulletPoint>Profile name (optional)</BulletPoint>
          <BulletPoint>Profile photo (optional)</BulletPoint>

          <Text style={[privacyPolicyStyles.subTitle, { color: COLORS.text }]}>Location Data</Text>
          <Paragraph>With your permission, we collect location data to:</Paragraph>
          <BulletPoint>Show nearby trails and trailheads</BulletPoint>
          <BulletPoint>Track your hiking progress</BulletPoint>
          <BulletPoint>Provide emergency SOS features</BulletPoint>
          <BulletPoint>Share your location with emergency contacts (when enabled)</BulletPoint>

          <Text style={[privacyPolicyStyles.subTitle, { color: COLORS.text }]}>Usage Data</Text>
          <Paragraph>We automatically collect information about how you use the app:</Paragraph>
          <BulletPoint>Trails viewed and saved</BulletPoint>
          <BulletPoint>Hikes completed</BulletPoint>
          <BulletPoint>Reviews and ratings submitted</BulletPoint>
          <BulletPoint>Photos uploaded</BulletPoint>
        </Section>

        <Section title="How We Use Your Information">
          <Paragraph>We use the information we collect to:</Paragraph>
          <BulletPoint>Provide and maintain our services</BulletPoint>
          <BulletPoint>Personalize your experience</BulletPoint>
          <BulletPoint>Track your hiking achievements</BulletPoint>
          <BulletPoint>Send important notifications about trail conditions</BulletPoint>
          <BulletPoint>Enable emergency SOS and safety features</BulletPoint>
          <BulletPoint>Improve our app and develop new features</BulletPoint>
        </Section>

        <Section title="Emergency & Safety Features">
          <Text style={[privacyPolicyStyles.subTitle, { color: COLORS.text }]}>SOS Alerts</Text>
          <Paragraph>When you trigger an SOS alert, we collect and share your precise location with your designated emergency contacts and potentially local emergency services. This data is shared only during emergencies.</Paragraph>
          
          <Text style={[privacyPolicyStyles.subTitle, { color: COLORS.text }]}>Emergency Contacts</Text>
          <Paragraph>You may add emergency contacts who can be notified in case of emergency. Their contact information is stored securely and only used for emergency notifications.</Paragraph>
        </Section>

        <Section title="Data Storage & Security">
          <Paragraph>We use industry-standard security measures to protect your data:</Paragraph>
          <BulletPoint>All data is encrypted in transit using SSL/TLS</BulletPoint>
          <BulletPoint>Passwords are hashed and salted</BulletPoint>
          <BulletPoint>Data is stored on secure servers (Supabase)</BulletPoint>
          <BulletPoint>We regularly audit our security practices</BulletPoint>
        </Section>

        <Section title="Your Rights & Choices">
          <Paragraph>You have the right to:</Paragraph>
          <BulletPoint>Access your personal data</BulletPoint>
          <BulletPoint>Correct inaccurate information</BulletPoint>
          <BulletPoint>Delete your account and associated data</BulletPoint>
          <BulletPoint>Opt out of marketing communications</BulletPoint>
          <BulletPoint>Disable location services</BulletPoint>
          <Paragraph>To exercise these rights, please contact us at privacy@estesparkhiking.com</Paragraph>
        </Section>

        <Section title="Contact Us">
          <Paragraph>If you have any questions about this Privacy Policy, please contact us at:</Paragraph>
          <View style={[privacyPolicyStyles.contactCard, { backgroundColor: COLORS.white }]}>
            <Text style={[privacyPolicyStyles.contactLabel, { color: COLORS.textLight }]}>Email</Text>
            <Text style={[privacyPolicyStyles.contactValue, { color: COLORS.text }]}>privacy@estesparkhiking.com</Text>
            <Text style={[privacyPolicyStyles.contactLabel, { color: COLORS.textLight }]}>Address</Text>
            <Text style={[privacyPolicyStyles.contactValue, { color: COLORS.text }]}>Estes Park Hiking{'\n'}123 Trail Way{'\n'}Estes Park, CO 80517</Text>
          </View>
        </Section>

        <View style={[privacyPolicyStyles.footer, { borderTopColor: COLORS.border }]}>
          <Text style={[privacyPolicyStyles.footerText, { color: COLORS.textLight }]}>© 2025 Estes Park Hiking. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}