import axios from 'axios';

const MAPBOX_KEY = process.env.NEXT_PUBLIC_MAPBOX_KEY;

export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
      {
        params: {
          access_token: MAPBOX_KEY,
          limit: 1,
        },
      }
    );

    if (response.data.features.length > 0) {
      const [lng, lat] = response.data.features[0].center;
      return { lat, lng };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => reject(error)
    );
  });
};
