import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../services/supabase/client';
import { useAuth } from '../../context/AuthContext';
import { reviewFormStyles } from '../../styles/components/reviewForm.styles';
import { COLORS } from '../../constants/colors';

interface ReviewFormProps {
  trailId: string;
  existingReview?: any;
  onSubmitSuccess: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ trailId, existingReview, onSubmitSuccess, onCancel }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [photos, setPhotos] = useState<string[]>(existingReview?.review_photos?.map((p: any) => p.photo_url) || []);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEditing = !!existingReview;

  const pickImage = async () => {
    if (photos.length >= 3) {
      Alert.alert('Limit Reached', 'You can upload a maximum of 3 photos');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    if (photos.length >= 3) {
      Alert.alert('Limit Reached', 'You can upload a maximum of 3 photos');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const showPhotoOptions = () => {
    Alert.alert('Add Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Review Required', 'Please write a review comment');
      return;
    }

    if (comment.trim().length < 10) {
      Alert.alert('Review Too Short', 'Please write at least 10 characters');
      return;
    }

    setSubmitting(true);

    try {
      if (isEditing) {
        // Update existing review
        const { error } = await supabase
          .from('trail_reviews')
          .update({
            rating,
            comment: comment.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingReview.id)
          .eq('user_id', user?.id); // Security check

        if (error) throw error;

        // Update photos: delete old ones, insert new ones
        await supabase
          .from('review_photos')
          .delete()
          .eq('review_id', existingReview.id);

        if (photos.length > 0) {
          const photoInserts = photos.map(photo => ({
            review_id: existingReview.id,
            photo_url: photo,
          }));
          await supabase.from('review_photos').insert(photoInserts);
        }

        Alert.alert('Success', 'Your review has been updated!');
      } else {
        // Create new review
        const { data: reviewData, error: reviewError } = await supabase
          .from('trail_reviews')
          .insert({
            trail_id: trailId,
            user_id: user?.id,
            rating,
            comment: comment.trim(),
          })
          .select()
          .single();

        if (reviewError) throw reviewError;

        // Insert photos
        if (photos.length > 0 && reviewData) {
          const photoInserts = photos.map(photo => ({
            review_id: reviewData.id,
            photo_url: photo,
          }));
          await supabase.from('review_photos').insert(photoInserts);
        }

        Alert.alert('Success', 'Your review has been posted!');
      }

      onSubmitSuccess();
    } catch (error: any) {
      console.error('Review submit error:', error);
      
      // Handle duplicate review error
      if (error.code === '23505') {
        Alert.alert('Already Reviewed', 'You have already reviewed this trail. Please edit your existing review.');
      } else {
        Alert.alert('Error', error.message || 'Failed to submit review');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete your review? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              // Photos will be auto-deleted due to ON DELETE CASCADE
              const { error } = await supabase
                .from('trail_reviews')
                .delete()
                .eq('id', existingReview.id)
                .eq('user_id', user?.id); // Security check

              if (error) throw error;

              Alert.alert('Deleted', 'Your review has been deleted');
              onSubmitSuccess();
            } catch (error: any) {
              console.error('Delete error:', error);
              Alert.alert('Error', error.message || 'Failed to delete review');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={reviewFormStyles.container}>
      {/* Header */}
      <View style={reviewFormStyles.header}>
        <Text style={reviewFormStyles.title}>
          {isEditing ? 'Edit Your Review' : 'Write a Review'}
        </Text>
        {onCancel && (
          <TouchableOpacity onPress={onCancel} style={reviewFormStyles.closeButton}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        )}
      </View>

      {/* Star Rating */}
      <View style={reviewFormStyles.section}>
        <Text style={reviewFormStyles.label}>Your Rating</Text>
        <View style={reviewFormStyles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              activeOpacity={0.7}
              style={reviewFormStyles.starButton}
            >
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={38}
                color={star <= rating ? '#FFB800' : COLORS.border}
              />
            </TouchableOpacity>
          ))}
        </View>
        {rating > 0 && (
          <Text style={reviewFormStyles.ratingText}>
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </Text>
        )}
      </View>

      {/* Comment Input */}
      <View style={reviewFormStyles.section}>
        <Text style={reviewFormStyles.label}>Your Review</Text>
        <TextInput
          style={reviewFormStyles.textInput}
          multiline
          numberOfLines={5}
          placeholder="Share your experience on this trail... What did you enjoy? Any tips for other hikers?"
          placeholderTextColor={COLORS.textLight}
          value={comment}
          onChangeText={setComment}
          textAlignVertical="top"
          maxLength={1000}
        />
        <Text style={reviewFormStyles.charCount}>
          {comment.length}/1000
        </Text>
      </View>

      {/* Photo Upload */}
      <View style={reviewFormStyles.section}>
        <Text style={reviewFormStyles.label}>Add Photos (Optional)</Text>
        <Text style={reviewFormStyles.labelHint}>Share up to 3 photos from your hike</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={reviewFormStyles.photosScroll}>
          <View style={reviewFormStyles.photosRow}>
            {photos.map((photo, index) => (
              <View key={index} style={reviewFormStyles.photoWrapper}>
                <Image source={{ uri: photo }} style={reviewFormStyles.photoPreview} />
                <TouchableOpacity
                  style={reviewFormStyles.removePhotoButton}
                  onPress={() => removePhoto(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
            
            {photos.length < 3 && (
              <TouchableOpacity
                style={reviewFormStyles.addPhotoButton}
                onPress={showPhotoOptions}
                activeOpacity={0.7}
              >
                <Ionicons name="camera-outline" size={28} color={COLORS.primary} />
                <Text style={reviewFormStyles.addPhotoText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Action Buttons */}
      <View style={reviewFormStyles.actions}>
        {/* Submit Button */}
        <TouchableOpacity
          style={[
            reviewFormStyles.submitButton,
            (submitting || deleting) && reviewFormStyles.buttonDisabled
          ]}
          onPress={handleSubmit}
          disabled={submitting || deleting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} />
              <Text style={reviewFormStyles.submitButtonText}>
                {isEditing ? 'Update Review' : 'Post Review'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Delete Button (only when editing) */}
        {isEditing && (
          <TouchableOpacity
            style={[
              reviewFormStyles.deleteButton,
              (submitting || deleting) && reviewFormStyles.buttonDisabled
            ]}
            onPress={handleDelete}
            disabled={submitting || deleting}
            activeOpacity={0.8}
          >
            {deleting ? (
              <ActivityIndicator color="#E74C3C" />
            ) : (
              <>
                <Ionicons name="trash-outline" size={18} color="#E74C3C" />
                <Text style={reviewFormStyles.deleteButtonText}>Delete Review</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}