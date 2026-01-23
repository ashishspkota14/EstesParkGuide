import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Export all environment variables in one place
export const ENV = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  API_URL: process.env.API_URL || 'http://localhost:3000',

  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,

  // OpenWeatherMap
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
  
  // Estes Park coordinates
  ESTES_PARK_LAT: 40.3772,
  ESTES_PARK_LON: -105.5217,

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:19006'],

  // Cron
  ENABLE_CRON: process.env.ENABLE_CRON === 'true',
};

// Validate required environment variables
const required = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'OPENWEATHER_API_KEY',
];

for (const key of required) {
  if (!ENV[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

export default ENV;