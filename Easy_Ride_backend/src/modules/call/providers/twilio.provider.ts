import twilio from 'twilio';
import logger from '../../../shared/utils/logger';

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

export class TwilioProvider {
  private client: twilio.Twilio;
  private accountSid: string;
  private apiKeySid: string;
  private apiKeySecret: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.apiKeySid = process.env.TWILIO_API_KEY_SID || '';
    this.apiKeySecret = process.env.TWILIO_API_KEY_SECRET || '';
    
    if (this.accountSid && this.apiKeySid && this.apiKeySecret) {
      this.client = twilio(this.apiKeySid, this.apiKeySecret, { accountSid: this.accountSid });
      logger.info('✅ Twilio initialized successfully');
    } else {
      logger.warn('⚠️ Twilio keys missing. Call features will not work.');
      // Create a proxy for the client to provide helpful errors if called
      this.client = new Proxy({}, {
        get: (_target, prop) => {
          throw new Error(`Twilio is not initialized. Missing TWILIO_ACCOUNT_SID, TWILIO_API_KEY_SID, or TWILIO_API_KEY_SECRET in .env`);
        }
      }) as any;
    }
  }


  /**
   * Generate Access Token for a user to join a room
   */
  generateToken(identity: string, roomName: string) {
    try {
      const token = new AccessToken(
        this.accountSid,
        this.apiKeySid,
        this.apiKeySecret,
        { identity }
      );

      const videoGrant = new VideoGrant({ room: roomName });
      token.addGrant(videoGrant);

      return token.toJwt();
    } catch (error) {
      logger.error('Twilio Token Generation Error:', error);
      throw error;
    }
  }

  /**
   * Create a Video Room
   */
  async createRoom(roomName: string) {
    try {
      const room = await this.client.video.v1.rooms.create({
        uniqueName: roomName,
        type: 'peer-to-peer', // or 'group'
      });
      return room;
    } catch (error) {
      logger.error('Twilio Room Creation Error:', error);
      throw error;
    }
  }

  /**
   * Complete/End a Room
   */
  async endRoom(roomSid: string) {
    try {
      const room = await this.client.video.v1.rooms(roomSid).update({ status: 'completed' });
      return room;
    } catch (error) {
      logger.error('Twilio Room End Error:', error);
      throw error;
    }
  }
}
