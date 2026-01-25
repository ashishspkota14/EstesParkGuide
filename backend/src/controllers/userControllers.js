const supabase = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Get user profile by ID
 */
async function getUserProfile(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return errorResponse(res, error.message, 404);
    }

    if (!data) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, data, 'User profile retrieved successfully');
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return errorResponse(res, 'Failed to get user profile', 500);
  }
}

/**
 * Get current user profile (authenticated)
 */
async function getCurrentUser(req, res) {
  try {
    const userId = req.user?.id; // From auth middleware

    if (!userId) {
      return errorResponse(res, 'Not authenticated', 401);
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return errorResponse(res, error.message, 404);
    }

    return successResponse(res, data, 'Current user retrieved successfully');
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return errorResponse(res, 'Failed to get current user', 500);
  }
}

/**
 * Update user profile
 */
async function updateUserProfile(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Check if user is updating their own profile
    if (userId !== id) {
      return errorResponse(res, 'Unauthorized to update this profile', 403);
    }

    const { full_name, bio, location, hiking_level, favorite_season, avatar_url } = req.body;

    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location;
    if (hiking_level !== undefined) updates.hiking_level = hiking_level;
    if (favorite_season !== undefined) updates.favorite_season = favorite_season;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    if (Object.keys(updates).length === 0) {
      return errorResponse(res, 'No fields to update', 400);
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(res, data, 'Profile updated successfully');
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return errorResponse(res, 'Failed to update profile', 500);
  }
}

/**
 * Get user's hiking statistics
 */
async function getUserStats(req, res) {
  try {
    const { id } = req.params;

    // Get user basic info
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('total_hikes, hiking_level')
      .eq('id', id)
      .single();

    if (userError) {
      return errorResponse(res, 'User not found', 404);
    }

    // Get favorites count
    const { count: favoritesCount, error: favError } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', id);

    // Get reviews count
    const { count: reviewsCount, error: revError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', id);

    const stats = {
      total_hikes: userData.total_hikes || 0,
      hiking_level: userData.hiking_level || 'beginner',
      favorites_count: favoritesCount || 0,
      reviews_count: reviewsCount || 0,
    };

    return successResponse(res, stats, 'User stats retrieved successfully');
  } catch (error) {
    console.error('Error in getUserStats:', error);
    return errorResponse(res, 'Failed to get user stats', 500);
  }
}

/**
 * Delete user account
 */
async function deleteUserAccount(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Check if user is deleting their own account
    if (userId !== id) {
      return errorResponse(res, 'Unauthorized to delete this account', 403);
    }

    // Delete from users table (cascade will handle related records)
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      return errorResponse(res, error.message, 400);
    }

    return successResponse(res, null, 'Account deleted successfully');
  } catch (error) {
    console.error('Error in deleteUserAccount:', error);
    return errorResponse(res, 'Failed to delete account', 500);
  }
}

module.exports = {
  getUserProfile,
  getCurrentUser,
  updateUserProfile,
  getUserStats,
  deleteUserAccount,
};