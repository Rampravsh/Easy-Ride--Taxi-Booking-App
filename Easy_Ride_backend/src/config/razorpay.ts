import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import logger from '../shared/utils/logger';

dotenv.config();

let razorpayInstance: any;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  logger.info('Razorpay initialized successfully');
} else {
  logger.warn('Razorpay keys missing. Payment features may not work.');
  // Create a proxy to provide a helpful error if someone tries to use it
  razorpayInstance = new Proxy({}, {
    get: (_target, prop) => {
      return new Proxy({}, {
        get: (_targetInner, propInner) => {
          return () => {
            throw new Error(`Razorpay is not initialized. Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in .env`);
          };
        }
      });
    }
  });
}

export default razorpayInstance;

