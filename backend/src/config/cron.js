import cron from 'node-cron';
import http from 'http';
import https from 'https';
import { ENV } from './env.js';

// Cron job to keep Render free tier awake (ping every 14 minutes)
const keepAliveJob = cron.schedule('*/14 * * * *', () => {
  if (!ENV.ENABLE_CRON) {
    return;
  }

  const url = `${ENV.API_URL}/api/health`;
  
  // Use http or https based on URL protocol
  const client = url.startsWith('https') ? https : http;
  
  client.get(url, (res) => {
    if (res.statusCode === 200) {
      console.log('✅ Keep-alive ping successful');
    } else {
      console.log(`⚠️ Keep-alive ping failed: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error('❌ Keep-alive ping error:', err.message);
  });
}, {
  scheduled: false // Don't start automatically
});

// Start the cron job
export const startCronJob = () => {
  if (ENV.ENABLE_CRON) {
    keepAliveJob.start();
    console.log('✅ Cron job started (keep-alive ping every 14 minutes)');
  } else {
    console.log('ℹ️ Cron job disabled');
  }
};

// Stop the cron job
export const stopCronJob = () => {
  keepAliveJob.stop();
  console.log('⏹️ Cron job stopped');
};

export default keepAliveJob;