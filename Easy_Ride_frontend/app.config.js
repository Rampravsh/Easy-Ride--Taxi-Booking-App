module.exports = ({ config }) => {
  // Dynamically resolve the Google Maps API key from .env environment variables loaded by Expo CLI
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  console.log(`🛡️ [app.config.js] Injecting dynamic native configurations from environment variables...`);
  
  const updatedConfig = { ...config };

  if (googleMapsApiKey && googleMapsApiKey !== "YOUR_GOOGLE_MAPS_API_KEY") {
    console.log(`✅ [app.config.js] Google Maps API key injected successfully.`);
    if (!updatedConfig.android) updatedConfig.android = {};
    if (!updatedConfig.android.config) updatedConfig.android.config = {};
    updatedConfig.android.config.googleMaps = {
      apiKey: googleMapsApiKey,
    };
  } else {
    console.warn(`⚠️ [app.config.js] WARNING: EXPO_PUBLIC_GOOGLE_MAPS_API_KEY is undefined or placeholder in .env!`);
    // Remove the placeholder key from configuration so it does not override Expo Go's default key
    if (updatedConfig.android?.config?.googleMaps) {
      delete updatedConfig.android.config.googleMaps;
    }
  }

  return updatedConfig;
};
