import axios from 'axios';
import { ENV } from '../config/env.js';

// GET /api/weather - Get current weather for Estes Park
export const getCurrentWeather = async (req, res) => {
  try {
    // Default to Estes Park coordinates
    const lat = req.query.lat || 40.3772;
    const lon = req.query.lon || -105.5217;

    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: lat,
        lon: lon,
        appid: ENV.OPENWEATHER_API_KEY,
        units: 'imperial' // Fahrenheit
      }
    });

    const data = response.data;

    res.status(200).json({
      success: true,
      data: {
        temperature: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        temp_min: Math.round(data.main.temp_min),
        temp_max: Math.round(data.main.temp_max),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        description: data.weather[0].description,
        main: data.weather[0].main,
        icon: data.weather[0].icon,
        wind_speed: Math.round(data.wind.speed),
        wind_deg: data.wind.deg,
        clouds: data.clouds.all,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        location: data.name,
        timestamp: data.dt
      }
    });
  } catch (err) {
    console.error('Error fetching weather:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch weather data',
      message: err.message
    });
  }
};

// GET /api/weather/forecast - Get 5-day forecast
export const getForecast = async (req, res) => {
  try {
    // Default to Estes Park coordinates
    const lat = req.query.lat || 40.3772;
    const lon = req.query.lon || -105.5217;

    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        lat: lat,
        lon: lon,
        appid: ENV.OPENWEATHER_API_KEY,
        units: 'imperial',
        cnt: 40 // 5 days, 8 forecasts per day
      }
    });

    const data = response.data;

    // Group forecasts by day
    const dailyForecasts = {};
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date: date,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          wind_speed: item.wind.speed,
          forecasts: []
        };
      } else {
        // Update min/max temps
        dailyForecasts[date].temp_min = Math.min(dailyForecasts[date].temp_min, item.main.temp_min);
        dailyForecasts[date].temp_max = Math.max(dailyForecasts[date].temp_max, item.main.temp_max);
      }
      
      dailyForecasts[date].forecasts.push({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric' }),
        temp: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon
      });
    });

    // Convert to array and round temps
    const forecast = Object.values(dailyForecasts).map(day => ({
      ...day,
      temp_min: Math.round(day.temp_min),
      temp_max: Math.round(day.temp_max)
    }));

    res.status(200).json({
      success: true,
      data: forecast
    });
  } catch (err) {
    console.error('Error fetching forecast:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch forecast data',
      message: err.message
    });
  }
};

// GET /api/weather/alerts - Get weather alerts for area
export const getWeatherAlerts = async (req, res) => {
  try {
    const lat = req.query.lat || 40.3772;
    const lon = req.query.lon || -105.5217;

    const response = await axios.get('https://api.openweathermap.org/data/3.0/onecall', {
      params: {
        lat: lat,
        lon: lon,
        appid: ENV.OPENWEATHER_API_KEY,
        exclude: 'minutely,hourly,daily'
      }
    });

    const alerts = response.data.alerts || [];

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts.map(alert => ({
        event: alert.event,
        start: alert.start,
        end: alert.end,
        description: alert.description,
        sender: alert.sender_name
      }))
    });
  } catch (err) {
    console.error('Error fetching alerts:', err.message);
    res.status(200).json({
      success: true,
      count: 0,
      data: [],
      message: 'No alerts or API limitation'
    });
  }
};