import { supabase } from '../config/database.js';

/**
 * Get all favorites for a user
 */
export async function getUserFavorites(req, res) {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        created_at,
        trails (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Format response to include trail data
    const favorites = data.map(fav => ({
      ...fav.trails,
      favorite_id: fav.id,
      favorited_at: fav.created_at
    }));

    res.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch favorites'
    });
  }
}

/**
 * Add trail to favorites
 */
export async function addFavorite(req, res) {
  try {
    const { userId, trailId } = req.body;

    if (!userId || !trailId) {
      return res.status(400).json({
        success: false,
        error: 'User ID and Trail ID required'
      });
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('trail_id', trailId)
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Trail already in favorites'
      });
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, trail_id: trailId }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message: 'Trail added to favorites'
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add favorite'
    });
  }
}

/**
 * Remove trail from favorites
 */
export async function removeFavorite(req, res) {
  try {
    const { userId, trailId } = req.params;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('trail_id', trailId);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Trail removed from favorites'
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove favorite'
    });
  }
}

/**
 * Check if trail is favorited
 */
export async function checkFavorite(req, res) {
  try {
    const { userId, trailId } = req.params;

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('trail_id', trailId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json({
      success: true,
      isFavorited: !!data
    });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check favorite status'
    });
  }
}