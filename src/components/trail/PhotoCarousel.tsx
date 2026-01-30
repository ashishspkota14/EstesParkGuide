import React, { useState, useRef } from 'react';
import { View, Image, ScrollView, Dimensions, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { photoCarouselStyles } from '../../styles/components/photoCarousel.styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PhotoCarouselProps {
  photos: string[] | any; // Can be array of URLs or trail object with image_main, image_2, image_3
  reviewPhotos?: string[]; // Optional: user-uploaded photos from reviews
}

export default function PhotoCarousel({ photos, reviewPhotos = [] }: PhotoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Convert photos prop or use trail's separate image columns
  let trailPhotos: string[] = [];
  
  if (Array.isArray(photos) && photos.length > 0) {
    trailPhotos = photos;
  } else if (typeof photos === 'object' && photos !== null) {
    // Handle trail object with image_main, image_2, image_3
    const trail = photos as any;
    trailPhotos = [
      trail.image_main,
      trail.image_2,
      trail.image_3
    ].filter(Boolean); // Remove nulls
  }

  // Combine trail photos + review photos (review photos come after trail photos)
  // If you want review photos first, swap the order: [...reviewPhotos, ...trailPhotos]
  let displayPhotos: string[] = [...trailPhotos, ...reviewPhotos];

  // Track which photos are from reviews (for showing badge)
  const trailPhotoCount = trailPhotos.length;
  const isReviewPhoto = (index: number) => index >= trailPhotoCount;
  
  // Fallback to placeholder if no images at all
  if (displayPhotos.length === 0) {
    displayPhotos = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800'
    ];
  }

  const handleScroll = (event: any) => {
    const slideSize = SCREEN_WIDTH;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setActiveIndex(index);
  };

  return (
    <View style={photoCarouselStyles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {displayPhotos.map((photo, index) => (
          <Image
            key={index}
            source={{ uri: photo }}
            style={photoCarouselStyles.photo}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* User Photo Badge - shows when viewing a review photo */}
      {reviewPhotos.length > 0 && isReviewPhoto(activeIndex) && (
        <View style={photoCarouselStyles.userPhotoBadge}>
          <Ionicons name="person" size={12} color="#fff" />
          <Text style={photoCarouselStyles.userPhotoText}>User Photo</Text>
        </View>
      )}

      {/* Pagination Dots */}
      <View style={photoCarouselStyles.pagination}>
        {displayPhotos.map((_, index) => (
          <View
            key={index}
            style={[
              photoCarouselStyles.dot,
              index === activeIndex && photoCarouselStyles.activeDot,
              // Optional: different color for review photo dots
              isReviewPhoto(index) && photoCarouselStyles.reviewDot,
              isReviewPhoto(index) && index === activeIndex && photoCarouselStyles.reviewDotActive
            ]}
          />
        ))}
      </View>

      {/* Photo Count Badge */}
      <View style={photoCarouselStyles.countBadge}>
        <Ionicons name="images" size={16} color="#fff" />
        <Text style={photoCarouselStyles.countText}>
          {activeIndex + 1} / {displayPhotos.length}
        </Text>
      </View>
    </View>
  );
}