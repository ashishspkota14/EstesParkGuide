import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { reviewsListStyles } from '../../styles/components/reviewsList.styles';
import { COLORS } from '../../constants/colors';
import ReviewForm from './ReviewForm';

interface ReviewsListProps {
  reviews: any[];
  trailId: string;
  onReviewChanged: () => void;
}

export default function ReviewsList({ reviews, trailId, onReviewChanged }: ReviewsListProps) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [userReview, setUserReview] = useState<any>(null);

  useEffect(() => {
    if (user && reviews) {
      const existing = reviews.find(r => r.users?.id === user.id);
      setUserReview(existing || null);
    }
  }, [user, reviews]);

  const handleEditReview = () => {
    setEditingReview(userReview);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingReview(null);
    onReviewChanged();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const renderReview = ({ item }: { item: any }) => {
    const isOwnReview = user && item.users?.id === user.id;
    const userName = item.users?.full_name || item.users?.email?.split('@')[0] || 'Anonymous';
    const userInitial = userName.charAt(0).toUpperCase();
    const reviewPhotos = item.review_photos || [];

    return (
      <View style={reviewsListStyles.reviewCard}>
        <View style={reviewsListStyles.reviewHeader}>
          <View style={reviewsListStyles.userRow}>
            {item.users?.avatar_url ? (
              <Image source={{ uri: item.users.avatar_url }} style={reviewsListStyles.avatar} />
            ) : (
              <View style={reviewsListStyles.avatarPlaceholder}>
                <Text style={reviewsListStyles.avatarText}>{userInitial}</Text>
              </View>
            )}
            <View style={reviewsListStyles.userInfo}>
              <Text style={reviewsListStyles.userName}>{userName}</Text>
              <View style={reviewsListStyles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= item.rating ? 'star' : 'star-outline'}
                    size={14}
                    color={star <= item.rating ? '#FFB800' : '#ddd'}
                  />
                ))}
              </View>
            </View>
          </View>
          <View style={reviewsListStyles.reviewMeta}>
            <Text style={reviewsListStyles.reviewDate}>{formatDate(item.created_at)}</Text>
            {isOwnReview && (
              <TouchableOpacity onPress={handleEditReview}>
                <Ionicons name="create-outline" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={reviewsListStyles.reviewText}>{item.comment}</Text>

        {reviewPhotos.length > 0 && (
          <View style={reviewsListStyles.photosGrid}>
            {reviewPhotos.slice(0, 3).map((photo: any, index: number) => (
              <Image
                key={index}
                source={{ uri: photo.photo_url }}
                style={reviewsListStyles.reviewPhoto}
              />
            ))}
            {reviewPhotos.length > 3 && (
              <View style={reviewsListStyles.morePhotos}>
                <Text style={reviewsListStyles.morePhotosText}>+{reviewPhotos.length - 3}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={reviewsListStyles.container}>
      <View style={reviewsListStyles.header}>
        <Text style={reviewsListStyles.title}>
          Reviews ({reviews.length})
        </Text>
      </View>

      {/* Write/Edit Review Section */}
      {user && (
        <View style={reviewsListStyles.writeReviewSection}>
          {showForm ? (
            <ReviewForm
              trailId={trailId}
              existingReview={editingReview}
              onSubmitSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingReview(null);
              }}
            />
          ) : userReview ? (
            <TouchableOpacity
              style={reviewsListStyles.editPrompt}
              onPress={handleEditReview}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={20} color={COLORS.primary} />
              <Text style={reviewsListStyles.editPromptText}>Edit your review</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={reviewsListStyles.writePrompt}
              onPress={() => setShowForm(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={20} color={COLORS.primary} />
              <Text style={reviewsListStyles.writePromptText}>Write a review</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderReview}
          scrollEnabled={false}
        />
      ) : (
        <View style={reviewsListStyles.emptyState}>
          <Ionicons name="chatbubble-outline" size={48} color={COLORS.border} />
          <Text style={reviewsListStyles.emptyTitle}>No Reviews Yet</Text>
          <Text style={reviewsListStyles.emptyText}>
            Be the first to share your experience on this trail!
          </Text>
        </View>
      )}
    </View>
  );
}