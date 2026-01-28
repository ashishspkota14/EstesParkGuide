import express from 'express';
import {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite
} from '../controllers/favoriteController.js';

const router = express.Router();

/**
 * GET /api/favorites/:userId
 * Get all favorites for a user
 */
router.get('/:userId', getUserFavorites);

/**
 * POST /api/favorites
 * Add trail to favorites
 */
router.post('/', addFavorite);

/**
 * DELETE /api/favorites/:userId/:trailId
 * Remove trail from favorites
 */
router.delete('/:userId/:trailId', removeFavorite);

/**
 * GET /api/favorites/:userId/:trailId/check
 * Check if trail is favorited
 */
router.get('/:userId/:trailId/check', checkFavorite);

export default router;