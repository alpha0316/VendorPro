interface ImportMetaEnv {
  VITE_GOOGLE_MAPS_KEY: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

export interface GeoResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  source: 'google' | 'mapbox';
}

export const googleGeocode = async (
  query: string
): Promise<GeoResult | null> => {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      query
    )}&key=${GOOGLE_KEY}`
  );

  const data = await res.json();

  if (data.status !== 'OK' || !data.results.length) return null;

  const r = data.results[0];

  return {
    lat: r.geometry.location.lat,
    lng: r.geometry.location.lng,
    formattedAddress: r.formatted_address,
    source: 'google'
  };
};
