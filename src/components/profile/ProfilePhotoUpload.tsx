import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase/client';
import { profilePhotoStyles } from '../../styles/components/profilePhoto.styles';

interface ProfilePhotoUploadProps {
  currentPhoto: string | null;
  onPhotoUpdated: () => void;
}

export default function ProfilePhotoUpload({ currentPhoto, onPhotoUpdated }: ProfilePhotoUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const getDefaultAvatar = () => {
    const name = user?.email?.split('@')[0] || 'Hiker';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2d5a3f&color=fff&size=200`;
  };

  const handlePickImage = async () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose a photo source',
      [
        {
          text: 'Camera',
          onPress: () => pickImage('camera'),
        },
        {
          text: 'Photo Library',
          onPress: () => pickImage('library'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const pickImage = async (source: 'camera' | 'library') => {
    try {
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Camera permission is required');
          return;
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Photo library permission is required');
          return;
        }
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true, // Get base64 directly from picker
      };

      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets[0] && result.assets[0].base64) {
        await uploadImage(result.assets[0].base64);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImage = async (base64: string) => {
    if (!user?.id) return;

    try {
      setUploading(true);

      const fileName = `avatar_${user.id}_${Date.now()}.jpg`;
      const filePath = `avatars/${fileName}`;

      // Decode base64 to ArrayBuffer and upload
      const arrayBuffer = decode(base64);
      
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      Alert.alert('Success', 'Profile photo updated!');
      onPhotoUpdated();

    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error.message || 'Could not upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={profilePhotoStyles.container}>
      <TouchableOpacity 
        onPress={handlePickImage} 
        disabled={uploading}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: currentPhoto || getDefaultAvatar() }}
          style={profilePhotoStyles.avatar}
        />
        
        <View style={profilePhotoStyles.cameraOverlay}>
          {uploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="camera" size={18} color="#fff" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}