import express from 'express';
import { supabase } from '../config/database.js';

const router = express.Router();

/**
 * Middleware to authenticate user
 */
async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ success: false, error: 'Authentication failed' });
  }
}

/**
 * GET /api/users/me - Get current user
 */
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ success: false, error: 'Failed to get user' });
  }
});

/**
 * GET /api/users/:id - Get user by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, avatar_url, bio, location, hiking_level, total_hikes')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ success: false, error: 'Failed to get user' });
  }
});

/**
 * PUT /api/users/:id - Update user profile
 */
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const { full_name, bio, location, hiking_level, favorite_season, avatar_url } = req.body;

    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location;
    if (hiking_level !== undefined) updates.hiking_level = hiking_level;
    if (favorite_season !== undefined) updates.favorite_season = favorite_season;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update user' });
  }
});

/**
 * GET /api/users/:id/stats - Get user stats
 */
router.get('/:id/stats', async (req, res) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('total_hikes, hiking_level')
      .eq('id', req.params.id)
      .single();

    if (userError) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const { count: favoritesCount } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.params.id);

    const stats = {
      total_hikes: userData.total_hikes || 0,
      hiking_level: userData.hiking_level || 'beginner',
      favorites_count: favoritesCount || 0,
    };

    return res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    return res.status(500).json({ success: false, error: 'Failed to get stats' });
  }
});

export default router;