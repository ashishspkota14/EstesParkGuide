import express from 'express';

const router = express.Router();

// Health check endpoint (for cron job keep-alive)
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

export default router;