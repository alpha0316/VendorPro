/// <reference types="vite/client" />
const MAPBOX_KEY = import.meta.env.VITE_MAPBOX_KEY;

type GeoResult = {
  lat: number;
  lng: number;
  formattedAddress: string;
  source: string;
};

export const mapboxGeocode = async (
  query: string
): Promise<GeoResult | null> => {
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${MAPBOX_KEY}&limit=1`
  );

  const data = await res.json();

  if (!data.features?.length) return null;

  const f = data.features[0];

  return {
    lat: f.center[1],
    lng: f.center[0],
    formattedAddress: f.place_name,
    source: 'mapbox'
  };
};
