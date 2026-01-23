import express from 'express';
import {
  getAllTrails,
  getTrailById,
  getTrailBySlug,
  getTrailsByDifficulty,
  getFeaturedTrails
} from '../controllers/trailController.js';

const router = express.Router();

// GET /api/trails - Get all trails
router.get('/', getAllTrails);

// GET /api/trails/featured - Get featured trails (must be before /:id)
router.get('/featured', getFeaturedTrails);

// GET /api/trails/difficulty/:difficulty - Filter by difficulty
router.get('/difficulty/:difficulty', getTrailsByDifficulty);

// GET /api/trails/slug/:slug - Get trail by slug
router.get('/slug/:slug', getTrailBySlug);

// GET /api/trails/:id - Get single trail by ID
router.get('/:id', getTrailById);

export default router;