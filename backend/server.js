import express from 'express';
import cors from 'cors';
import { ENV } from './src/config/env.js';
import corsOptions from './src/config/cors.js';
import { testConnection } from './src/config/database.js';
import { testCloudinaryConnection } from './src/config/cloudinary.js';
import { startCronJob } from './src/config/cron.js';

// Import routes
import healthRoutes from './src/routes/health.js';
import trailRoutes from './src/routes/trails.js';
import weatherRoutes from './src/routes/weather.js';
import userRoutes from './src/routes/users.js';

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/trails', trailRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Estes Park Guide API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      trails: {
        all: '/api/trails',
        featured: '/api/trails/featured',
        byId: '/api/trails/:id',
        bySlug: '/api/trails/slug/:slug',
        byDifficulty: '/api/trails/difficulty/:difficulty'
      },
      weather: {
        current: '/api/weather',
        forecast: '/api/weather/forecast',
        alerts: '/api/weather/alerts'
      },
      users: {
        me: 'GET /api/users/me',
        profile: 'GET /api/users/:id',
        updateProfile: 'PUT /api/users/:id',
        stats: 'GET /api/users/:id/stats'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    console.log('Testing database connection...');
    await testConnection();

    // Test Cloudinary connection (optional)
    if (ENV.CLOUDINARY_CLOUD_NAME) {
      console.log('Testing Cloudinary connection...');
      await testCloudinaryConnection();
    }

    // Start cron job for keep-alive
    startCronJob();

    // Start listening
    app.listen(ENV.PORT, () => {
      console.log(`
╔═══════════════════════════════════════╗
║   🏔️  ESTES PARK GUIDE API           ║
║                                       ║
║   Server running on port ${ENV.PORT}        ║
║   Environment: ${ENV.NODE_ENV}           ║
║   URL: ${ENV.API_URL}   ║
║                                       ║
║   ✅ Auth Routes Enabled              ║
╚═══════════════════════════════════════╝
      `);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();