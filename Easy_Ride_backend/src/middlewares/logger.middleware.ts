import morgan, { StreamOptions } from 'morgan';
import logger from '../shared/utils/logger';

/**
 * Override the stream method by telling Morgan to use our custom logger 
 * instead of the console.log.
 */
const stream: StreamOptions = {
  // Use the http severity
  write: (message) => logger.http(message.trim()),
};

/**
 * Skip logging for certain conditions.
 * For example, skip logging in production for certain paths.
 */
const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

/**
 * Morgan middleware setup for HTTP request logging.
 */
const loggerMiddleware = morgan(
  // Define message format string.
  ':method :url :status :res[content-length] - :response-time ms',
  // Options: overwriting the stream logic.
  { stream }
);

export default loggerMiddleware;
