module.exports = ({ config }) => {
  // Dynamically resolve the Google Maps API key from .env environment variables loaded by Expo CLI
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  console.log(`🛡️ [app.config.js] Injecting dynamic native configurations from environment variables...`);
  if (!googleMapsApiKey) {
    console.warn(`⚠️ [app.config.js] WARNING: EXPO_PUBLIC_GOOGLE_MAPS_API_KEY is undefined in .env! Maps will not initialize.`);
  } else {
    console.log(`✅ [app.config.js] Google Maps API key injected successfully.`);
  }

  return {
    ...config,
    android: {
      ...config.android,
      config: {
        ...config.android?.config,
        googleMaps: {
          apiKey: googleMapsApiKey,
        },
      },
    },
  };
};
