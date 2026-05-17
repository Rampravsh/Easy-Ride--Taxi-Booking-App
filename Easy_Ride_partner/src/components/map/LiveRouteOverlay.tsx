import React from 'react';
import { Polyline } from 'react-native-maps';
import { useTheme } from '../../theme';

interface LiveRouteOverlayProps {
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  lineColor?: string;
}

export const LiveRouteOverlay = ({
  origin,
  destination,
  lineColor,
}: LiveRouteOverlayProps) => {
  const { theme } = useTheme();

  // Create a simple, realistic curved/multi-point path representation in Bengaluru
  // to simulate actual street navigating turns between points!
  const routePoints = [
    origin,
    { latitude: (origin.latitude + destination.latitude) / 2 + 0.002, longitude: (origin.longitude + destination.longitude) / 2 - 0.003 },
    { latitude: (origin.latitude + destination.latitude) / 2 - 0.001, longitude: (origin.longitude + destination.longitude) / 2 + 0.004 },
    destination
  ];

  return (
    <Polyline
      coordinates={routePoints}
      strokeColor={lineColor || theme.colors.primary}
      strokeWidth={5}
      lineCap="round"
      lineJoin="round"
    />
  );
};

export default LiveRouteOverlay;
