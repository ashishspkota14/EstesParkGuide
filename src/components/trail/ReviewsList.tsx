import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useColors } from '../../context/ThemeContext';
import { reviewsListStyles } from '../../styles/components/reviewsList.styles';
import ReviewForm from './ReviewForm';

interface ReviewsListProps {
  reviews: any[];
  trailId: string;
  onReviewChanged: () => void;
}

export default function ReviewsList({ reviews, trailId, onReviewChanged }: ReviewsListProps) {
  const { user } = useAuth();
  const COLORS = useColors();
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [userReview, setUserReview] = useState<any>(null);

  useEffect(() => {
    if (user && reviews) {
      const existing = reviews.find(r => r.profiles?.id === user.id);
      setUserReview(existing || null);
    } else {
      setUserReview(null);
    }
  }, [user, reviews]);

  const handleWriteReview = () => {
    if (!user) {
      router.push({
        pathname: '/(auth)/login',
        params: { returnTo: 'trail', trailId: trailId }
      });
      return;
    }
    setShowForm(true);
  };

  const handleEditReview = () => {
    setEditingReview(userReview);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingReview(null);
    onReviewChanged();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const renderStars = (rating: number) => {
    return (
      <View style={reviewsListStyles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={14}
            color={star <= rating ? '#FFB800' : '#ddd'}
          />
        ))}
      </View>
    );
  };

  const renderReview = ({ item }: { item: any }) => {
    const isOwnReview = user && item.profiles?.id === user.id;
    const userName = item.profiles?.full_name || 'Anonymous Hiker';
    const userInitial = userName.charAt(0).toUpperCase();
    const reviewPhotos = item.review_photos || [];

    return (
      <View style={[reviewsListStyles.reviewCard, { backgroundColor: COLORS.white }]}>
        <View style={reviewsListStyles.reviewHeader}>
          <View style={reviewsListStyles.userRow}>
            {item.profiles?.avatar_url ? (
              <Image source={{ uri: item.profiles.avatar_url }} style={reviewsListStyles.avatar} />
            ) : (
              <View style={[reviewsListStyles.avatarPlaceholder, { backgroundColor: COLORS.primary }]}>
                <Text style={reviewsListStyles.avatarText}>{userInitial}</Text>
              </View>
            )}
            <View style={reviewsListStyles.userInfo}>
              <Text style={[reviewsListStyles.userName, { color: COLORS.text }]}>{userName}</Text>
              {renderStars(item.rating)}
            </View>
          </View>
          <View style={reviewsListStyles.reviewMeta}>
            <Text style={[reviewsListStyles.reviewDate, { color: COLORS.textLight }]}>
              {formatDate(item.created_at)}
            </Text>
            {isOwnReview && (
              <TouchableOpacity onPress={handleEditReview} style={reviewsListStyles.editButton}>
                <Ionicons name="create-outline" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={[reviewsListStyles.reviewText, { color: COLORS.text }]}>{item.comment}</Text>

        {reviewPhotos.length > 0 && (
          <View style={reviewsListStyles.photosGrid}>
            {reviewPhotos.slice(0, 3).map((photo: any, index: number) => (
              <Image
                key={index}
                source={{ uri: photo.photo_url }}
                style={reviewsListStyles.reviewPhoto}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  if (showForm) {
    return (
      <View style={[reviewsListStyles.container, { backgroundColor: COLORS.white }]}>
        <ReviewForm
          trailId={trailId}
          existingReview={editingReview}
          onSubmitSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </View>
    );
  }

  return (
    <View style={[reviewsListStyles.container, { backgroundColor: COLORS.white }]}>
      <View style={reviewsListStyles.header}>
        <Text style={[reviewsListStyles.title, { color: COLORS.text }]}>
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </Text>
      </View>

      {/* Write/Edit Review Button */}
      <View style={reviewsListStyles.writeReviewSection}>
        {user && userReview ? (
          <TouchableOpacity
            style={[reviewsListStyles.editPrompt, { backgroundColor: `${COLORS.primary}15` }]}
            onPress={handleEditReview}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={18} color={COLORS.primary} />
            <Text style={[reviewsListStyles.editPromptText, { color: COLORS.primary }]}>
              Edit Your Review
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[reviewsListStyles.writePrompt, { backgroundColor: COLORS.primary }]}
            onPress={handleWriteReview}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={18} color={COLORS.white} />
            <Text style={reviewsListStyles.writePromptText}>Write a Review</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderReview}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      ) : (
        <View style={reviewsListStyles.emptyState}>
          <View style={[reviewsListStyles.emptyIconWrap, { backgroundColor: `${COLORS.primary}15` }]}>
            <Ionicons name="chatbubbles-outline" size={40} color={COLORS.primary} />
          </View>
          <Text style={[reviewsListStyles.emptyTitle, { color: COLORS.text }]}>No Reviews Yet</Text>
          <Text style={[reviewsListStyles.emptyText, { color: COLORS.textLight }]}>
            Be the first to share your experience on this trail!
          </Text>
        </View>
      )}
    </View>
  );
}