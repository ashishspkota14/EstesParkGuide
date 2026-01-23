import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
  secure: true
});

// Test connection - just verify config is set
export const testCloudinaryConnection = async () => {
  try {
    // Just check if credentials are configured
    if (!ENV.CLOUDINARY_CLOUD_NAME || !ENV.CLOUDINARY_API_KEY || !ENV.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary credentials not configured');
    }
    
    // Verify the config
    const config = cloudinary.config();
    if (config.cloud_name && config.api_key && config.api_secret) {
      console.log('✅ Cloudinary configured successfully');
      return true;
    } else {
      throw new Error('Cloudinary configuration incomplete');
    }
  } catch (err) {
    console.error('Cloudinary connection failed:', err.message);
    return false;
  }
};

// Helper function to upload image
export const uploadImage = async (imagePath, folder = 'estes-park') => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: folder,
      resource_type: 'auto'
    });
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (err) {
    console.error('Image upload failed:', err.message);
    throw err;
  }
};

export default cloudinary;