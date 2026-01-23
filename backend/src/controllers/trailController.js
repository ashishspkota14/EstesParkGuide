import { supabase } from '../config/database.js';

// GET /api/trails - Get all trails
export const getAllTrails = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('trails')
      .select('*')
      .eq('is_active', true)
      .order('popularity_rank', { ascending: true });

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (err) {
    console.error('Error fetching trails:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trails',
      message: err.message
    });
  }
};

// GET /api/trails/:id - Get single trail by ID
export const getTrailById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('trails')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Trail not found'
        });
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (err) {
    console.error('Error fetching trail:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trail',
      message: err.message
    });
  }
};

// GET /api/trails/slug/:slug - Get trail by slug (URL-friendly)
export const getTrailBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('trails')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Trail not found'
        });
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (err) {
    console.error('Error fetching trail:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trail',
      message: err.message
    });
  }
};

// GET /api/trails/difficulty/:difficulty - Filter by difficulty
export const getTrailsByDifficulty = async (req, res) => {
  try {
    const { difficulty } = req.params;

    // Validate difficulty
    const validDifficulties = ['easy', 'moderate', 'hard'];
    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid difficulty. Must be: easy, moderate, or hard'
      });
    }

    const { data, error } = await supabase
      .from('trails')
      .select('*')
      .eq('difficulty', difficulty.toLowerCase())
      .eq('is_active', true)
      .order('popularity_rank', { ascending: true });

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (err) {
    console.error('Error fetching trails by difficulty:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trails',
      message: err.message
    });
  }
};

// GET /api/trails/featured - Get featured/popular trails
export const getFeaturedTrails = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const { data, error } = await supabase
      .from('trails')
      .select('*')
      .eq('is_active', true)
      .not('popularity_rank', 'is', null)
      .order('popularity_rank', { ascending: true })
      .limit(limit);

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (err) {
    console.error('Error fetching featured trails:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured trails',
      message: err.message
    });
  }
};