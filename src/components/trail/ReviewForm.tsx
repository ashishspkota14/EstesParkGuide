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

  const pickImage = async () => {
    if (photos.length >= 3) {
      Alert.alert('Limit Reached', 'You can upload a maximum of 3 photos');
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

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Comment Required', 'Please write a review');
      return;
    }

    setSubmitting(true);

    try {
      if (existingReview) {
        // Update existing review
        const { error } = await supabase
          .from('trail_reviews')
          .update({
            rating,
            comment: comment.trim(),
          })
          .eq('id', existingReview.id);

        if (error) throw error;

        // Update photos (delete old, insert new)
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
        if (photos.length > 0) {
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
      Alert.alert('Error', error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={reviewFormStyles.container}>
      <View style={reviewFormStyles.header}>
        <Text style={reviewFormStyles.title}>
          {existingReview ? 'Edit Your Review' : 'Write a Review'}
        </Text>
        {onCancel && (
          <TouchableOpacity onPress={onCancel}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        )}
      </View>

      {/* Star Rating */}
      <View style={reviewFormStyles.ratingContainer}>
        <Text style={reviewFormStyles.label}>Rating *</Text>
        <View style={reviewFormStyles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={36}
                color={star <= rating ? '#FFB800' : '#ddd'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Comment */}
      <View style={reviewFormStyles.commentContainer}>
        <Text style={reviewFormStyles.label}>Your Review *</Text>
        <TextInput
          style={reviewFormStyles.commentInput}
          multiline
          numberOfLines={6}
          placeholder="Share your experience on this trail..."
          placeholderTextColor={COLORS.textLight}
          value={comment}
          onChangeText={setComment}
          textAlignVertical="top"
        />
      </View>

      {/* Photo Upload */}
      <View style={reviewFormStyles.photosContainer}>
        <Text style={reviewFormStyles.label}>Photos (Max 3)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={reviewFormStyles.photosRow}>
            {photos.map((photo, index) => (
              <View key={index} style={reviewFormStyles.photoWrapper}>
                <Image source={{ uri: photo }} style={reviewFormStyles.photo} />
                <TouchableOpacity
                  style={reviewFormStyles.removePhoto}
                  onPress={() => removePhoto(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
            {photos.length < 3 && (
              <TouchableOpacity
                style={reviewFormStyles.addPhoto}
                onPress={pickImage}
                activeOpacity={0.7}
              >
                <Ionicons name="camera-outline" size={32} color={COLORS.textLight} />
                <Text style={reviewFormStyles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[reviewFormStyles.submitButton, submitting && reviewFormStyles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
        activeOpacity={0.8}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={reviewFormStyles.submitButtonText}>
            {existingReview ? 'Update Review' : 'Post Review'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}