import express from 'express';
import {
  getCurrentWeather,
  getForecast,
  getWeatherAlerts
} from '../controllers/weatherController.js';

const router = express.Router();

// GET /api/weather - Get current weather
router.get('/', getCurrentWeather);

// GET /api/weather/forecast - Get 5-day forecast
router.get('/forecast', getForecast);

// GET /api/weather/alerts - Get weather alerts
router.get('/alerts', getWeatherAlerts);

export default router;