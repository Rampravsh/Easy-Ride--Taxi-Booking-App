import * as geolib from 'geolib';

/**
 * Calculate distance between two points in meters
 */
export const calculateDistance = (
  start: { latitude: number; longitude: number },
  end: { latitude: number; longitude: number }
) => {
  return geolib.getDistance(start, end);
};
