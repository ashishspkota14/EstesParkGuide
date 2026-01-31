import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../services/supabase/client';
import { emergencyContactsStyles } from '../../styles/components/emergencyContacts.styles';

interface EmergencyContactsProps {
  onClose: () => void;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  relationship: string | null;
  is_primary: boolean;
  notify_on_sos: boolean;
}

const RELATIONSHIP_OPTIONS = [
  'Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 
  'Park Ranger', 'Neighbor', 'Coworker', 'Other'
];

export default function EmergencyContacts({ onClose }: EmergencyContactsProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const COLORS = theme;
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const fetchContacts = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true });
      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      Alert.alert('Error', 'Failed to load emergency contacts');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setRelationship('');
    setIsPrimary(false);
    setEditingContact(null);
    setShowAddForm(false);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setName(contact.name);
    setPhone(contact.phone);
    setEmail(contact.email || '');
    setRelationship(contact.relationship || '');
    setIsPrimary(contact.is_primary);
    setShowAddForm(true);
  };

  const handleSave = async () => {
    if (!user?.id) return;
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Required Fields', 'Please enter name and phone number');
      return;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    try {
      setSaving(true);
      if (isPrimary) {
        await supabase
          .from('emergency_contacts')
          .update({ is_primary: false })
          .eq('user_id', user.id);
      }

      const contactData = {
        user_id: user.id,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        relationship: relationship || null,
        is_primary: isPrimary,
        notify_on_sos: true,
      };

      if (editingContact) {
        const { error } = await supabase
          .from('emergency_contacts')
          .update(contactData)
          .eq('id', editingContact.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('emergency_contacts')
          .insert(contactData);
        if (error) throw error;
      }

      resetForm();
      fetchContacts();
      Alert.alert('Success', editingContact ? 'Contact updated!' : 'Contact added!');
    } catch (error: any) {
      console.error('Error saving contact:', error);
      Alert.alert('Error', error.message || 'Failed to save contact');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (contact: Contact) => {
    Alert.alert(
      'Delete Contact',
      `Remove ${contact.name} from emergency contacts?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.from('emergency_contacts').delete().eq('id', contact.id);
              fetchContacts();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete contact');
            }
          },
        },
      ]
    );
  };

  const renderContactCard = (contact: Contact) => (
    <View key={contact.id} style={[emergencyContactsStyles.contactCard, { backgroundColor: COLORS.white }]}>
      <View style={emergencyContactsStyles.contactHeader}>
        <View style={[emergencyContactsStyles.contactAvatar, { backgroundColor: COLORS.primary }]}>
          <Text style={emergencyContactsStyles.contactInitial}>{contact.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={emergencyContactsStyles.contactInfo}>
          <View style={emergencyContactsStyles.contactNameRow}>
            <Text style={[emergencyContactsStyles.contactName, { color: COLORS.text }]}>{contact.name}</Text>
            {contact.is_primary && (
              <View style={[emergencyContactsStyles.primaryBadge, { backgroundColor: `${COLORS.primary}20` }]}>
                <Text style={[emergencyContactsStyles.primaryBadgeText, { color: COLORS.primary }]}>Primary</Text>
              </View>
            )}
          </View>
          {contact.relationship && (
            <Text style={[emergencyContactsStyles.contactRelationship, { color: COLORS.textLight }]}>{contact.relationship}</Text>
          )}
          <Text style={[emergencyContactsStyles.contactPhone, { color: COLORS.text }]}>{contact.phone}</Text>
        </View>
      </View>
      <View style={[emergencyContactsStyles.contactActions, { borderTopColor: COLORS.border }]}>
        <TouchableOpacity style={[emergencyContactsStyles.actionButton, { backgroundColor: `${COLORS.primary}10` }]} onPress={() => Linking.openURL(`tel:${contact.phone}`)}>
          <Ionicons name="call" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={[emergencyContactsStyles.actionButton, { backgroundColor: `${COLORS.primary}10` }]} onPress={() => Linking.openURL(`sms:${contact.phone}`)}>
          <Ionicons name="chatbubble" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={[emergencyContactsStyles.actionButton, { backgroundColor: `${COLORS.primary}10` }]} onPress={() => handleEdit(contact)}>
          <Ionicons name="pencil" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
        <TouchableOpacity style={[emergencyContactsStyles.actionButton, { backgroundColor: `${COLORS.primary}10` }]} onPress={() => handleDelete(contact)}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAddForm = () => (
    <View style={[emergencyContactsStyles.formContainer, { backgroundColor: COLORS.white }]}>
      <View style={emergencyContactsStyles.formHeader}>
        <Text style={[emergencyContactsStyles.formTitle, { color: COLORS.text }]}>{editingContact ? 'Edit Contact' : 'Add Emergency Contact'}</Text>
        <TouchableOpacity onPress={resetForm}><Ionicons name="close" size={24} color={COLORS.textLight} /></TouchableOpacity>
      </View>
      <View style={emergencyContactsStyles.inputGroup}>
        <Text style={[emergencyContactsStyles.inputLabel, { color: COLORS.text }]}>Name *</Text>
        <TextInput style={[emergencyContactsStyles.input, { backgroundColor: COLORS.background, borderColor: COLORS.border, color: COLORS.text }]} value={name} onChangeText={setName} placeholder="Contact name" placeholderTextColor={COLORS.textLight} />
      </View>
      <View style={emergencyContactsStyles.inputGroup}>
        <Text style={[emergencyContactsStyles.inputLabel, { color: COLORS.text }]}>Phone *</Text>
        <TextInput style={[emergencyContactsStyles.input, { backgroundColor: COLORS.background, borderColor: COLORS.border, color: COLORS.text }]} value={phone} onChangeText={setPhone} placeholder="Phone number" placeholderTextColor={COLORS.textLight} keyboardType="phone-pad" />
      </View>
      <View style={emergencyContactsStyles.inputGroup}>
        <Text style={[emergencyContactsStyles.inputLabel, { color: COLORS.text }]}>Email (Optional)</Text>
        <TextInput style={[emergencyContactsStyles.input, { backgroundColor: COLORS.background, borderColor: COLORS.border, color: COLORS.text }]} value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor={COLORS.textLight} keyboardType="email-address" autoCapitalize="none" />
      </View>
      <View style={emergencyContactsStyles.inputGroup}>
        <Text style={[emergencyContactsStyles.inputLabel, { color: COLORS.text }]}>Relationship</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={emergencyContactsStyles.relationshipScroll}>
          {RELATIONSHIP_OPTIONS.map((option) => (
            <TouchableOpacity key={option} style={[emergencyContactsStyles.relationshipChip, { backgroundColor: COLORS.background, borderColor: COLORS.border }, relationship === option && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]} onPress={() => setRelationship(relationship === option ? '' : option)}>
              <Text style={[emergencyContactsStyles.relationshipChipText, { color: COLORS.text }, relationship === option && { color: COLORS.white }]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity style={emergencyContactsStyles.primaryToggle} onPress={() => setIsPrimary(!isPrimary)}>
        <Ionicons name={isPrimary ? 'checkbox' : 'square-outline'} size={24} color={COLORS.primary} />
        <Text style={[emergencyContactsStyles.primaryToggleText, { color: COLORS.text }]}>Set as primary emergency contact</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[emergencyContactsStyles.saveButton, { backgroundColor: COLORS.primary }]} onPress={handleSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={emergencyContactsStyles.saveButtonText}>{editingContact ? 'Update Contact' : 'Add Contact'}</Text>}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[emergencyContactsStyles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      <View style={[emergencyContactsStyles.header, { backgroundColor: COLORS.white, borderBottomColor: COLORS.border }]}>
        <TouchableOpacity onPress={onClose} style={emergencyContactsStyles.backButton}><Ionicons name="arrow-back" size={24} color={COLORS.text} /></TouchableOpacity>
        <Text style={[emergencyContactsStyles.headerTitle, { color: COLORS.text }]}>Emergency Contacts</Text>
        <View style={emergencyContactsStyles.placeholder} />
      </View>
      <ScrollView style={emergencyContactsStyles.content} showsVerticalScrollIndicator={false}>
        <View style={[emergencyContactsStyles.infoCard, { backgroundColor: `${COLORS.primary}10` }]}>
          <Ionicons name="information-circle" size={24} color={COLORS.primary} />
          <Text style={[emergencyContactsStyles.infoText, { color: COLORS.text }]}>These contacts will be notified when you trigger an SOS alert.</Text>
        </View>
        {showAddForm ? renderAddForm() : (
          <TouchableOpacity style={[emergencyContactsStyles.addButton, { borderColor: COLORS.primary }]} onPress={() => setShowAddForm(true)}>
            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
            <Text style={[emergencyContactsStyles.addButtonText, { color: COLORS.primary }]}>Add Emergency Contact</Text>
          </TouchableOpacity>
        )}
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : contacts.length > 0 ? (
          <View style={emergencyContactsStyles.contactList}>
            <Text style={[emergencyContactsStyles.sectionTitle, { color: COLORS.textLight }]}>Your Contacts ({contacts.length})</Text>
            {contacts.map(renderContactCard)}
          </View>
        ) : !showAddForm && (
          <View style={emergencyContactsStyles.emptyState}>
            <View style={[emergencyContactsStyles.emptyIcon, { backgroundColor: `${COLORS.primary}10` }]}><Ionicons name="people-outline" size={48} color={COLORS.textLight} /></View>
            <Text style={[emergencyContactsStyles.emptyTitle, { color: COLORS.text }]}>No Contacts Yet</Text>
            <Text style={[emergencyContactsStyles.emptyText, { color: COLORS.textLight }]}>Add emergency contacts who can help if you're in trouble on the trail.</Text>
          </View>
        )}
        <View style={emergencyContactsStyles.quickAccess}>
          <Text style={[emergencyContactsStyles.quickAccessTitle, { color: COLORS.textLight }]}>Quick Access</Text>
          <TouchableOpacity style={[emergencyContactsStyles.quickAccessItem, { backgroundColor: COLORS.white }]} onPress={() => Linking.openURL('tel:911')}>
            <View style={[emergencyContactsStyles.quickAccessIcon, { backgroundColor: '#EF4444' }]}><Ionicons name="call" size={20} color="#fff" /></View>
            <View style={emergencyContactsStyles.quickAccessText}><Text style={[emergencyContactsStyles.quickAccessName, { color: COLORS.text }]}>Call 911</Text><Text style={[emergencyContactsStyles.quickAccessDesc, { color: COLORS.textLight }]}>Emergency services</Text></View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
          <TouchableOpacity style={[emergencyContactsStyles.quickAccessItem, { backgroundColor: COLORS.white }]} onPress={() => Linking.openURL('tel:+19702456171')}>
            <View style={[emergencyContactsStyles.quickAccessIcon, { backgroundColor: COLORS.primary }]}><Ionicons name="shield" size={20} color="#fff" /></View>
            <View style={emergencyContactsStyles.quickAccessText}><Text style={[emergencyContactsStyles.quickAccessName, { color: COLORS.text }]}>Rocky Mountain NP Rangers</Text><Text style={[emergencyContactsStyles.quickAccessDesc, { color: COLORS.textLight }]}>(970) 245-6171</Text></View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}