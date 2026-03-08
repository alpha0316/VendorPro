import './../App.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Tesseract from 'tesseract.js';


interface ExtractedOrder {
  image: File;
  rawText: string;
  name: string;
  phone: string;
  product: string;
  amount: string;
  location: string;
  locationStatus?: 'valid' | 'low_confidence' | 'invalid';
  latitude?: number;
  longitude?: number;
  resolvedLocationName?: string;
  geocodingProvider?: string;
}

interface OrderImagesProps {
  goToPreparedList: (orders: ExtractedOrder[]) => void;
}

/* ==================== HOSTEL NORMALIZATION MAP ==================== */
const HOSTEL_NORMALIZATION_MAP: Record<string, string> = {
  // Very common ones
  'brunei': 'Brunei Complex, Ayeduase, Kumasi, Ghana',
  'bruni': 'Brunei Complex, Ayeduase, Kumasi, Ghana',
  'evandy': 'Evandy Annex, Bomso, Kumasi, Ghana',
  'evandi': 'Evandy Annex, Bomso, Kumasi, Ghana',
  'wagyingo': 'Wagyingo Hostel, Ayeduase, Kumasi, Ghana',
  'wagyengo': 'Wagyingo Hostel, Ayeduase, Kumasi, Ghana',

  // Very frequent in KNUST area
  'gaza': 'Gaza, Wilkado Hostel area, Kumasi, Ghana',
  'bomso': 'Bomso, Kumasi, Ghana',
  'kotei': 'Kotei, Kumasi, Ghana',
  'findgrace': 'Findgrace, Kotei, Kumasi, Ghana',
  'ayeduase': 'Ayeduase, Kumasi, Ghana',
  'ayduase': 'Ayeduase, Kumasi, Ghana',
  'new site': 'Ayeduase New Site, Kumasi, Ghana',

  // Popular hostels
  'providence': 'Providence Hostel, Ayeduase, Kumasi, Ghana',
  'westend': 'Westend Hostel, Ayeduase, Kumasi, Ghana',
  'ultimate': 'Ultimate Hostel, Bomso, Kumasi, Ghana',
  'frontline': 'Frontline Court, Ayeduase, Kumasi, Ghana',
  'adom bi': 'Adom-Bi Hostel, Ayeduase, Kumasi, Ghana',
  'victory towers': 'Victory Towers Hostel, Kumasi, Ghana',
  'st theresa': 'St Theresa Hostel, Kumasi, Ghana',
  'besco': 'Besco Student Hostel, Kumasi, Ghana',
  'faith hostel': 'Faith Hostel, Ayeduase, Kumasi, Ghana',
  'gnc hostel': 'GNC Hostel, Ayeduase, Kumasi, Ghana',
  'queens court': "Queen's Court, Ayeduase, Kumasi, Ghana",
  'regency hostel': 'Regency Hostel, Ayeduase, Kumasi, Ghana',
  'ruby court': 'Ruby Court, Ayeduase, Kumasi, Ghana',
  'sarbah hall': 'Sarbah Hall, KNUST, Kumasi, Ghana',
  'independence hall': 'Independence Hall, KNUST, Kumasi, Ghana',
  'africa hall': 'Africa Hall, KNUST, Kumasi, Ghana',
  'queens hall': "Queen's Hall, KNUST, Kumasi, Ghana",
  'casford hall': 'Casford Hall, Kumasi, Ghana',
  'valco hall': 'Valco Hall, Kumasi, Ghana',

  // Campus areas
  'knust': 'KNUST Main Campus, Kumasi, Ghana',
  'tech junction': 'Tech Junction, Kumasi, Ghana',
  'atonsu': 'Atonsu, Kumasi, Ghana',
  'abuakwa': 'Abuakwa, Kumasi, Ghana',
  'ahodwo': 'Ahodwo, Kumasi, Ghana',
  'asuoyeboa': 'Asuoyeboa, Kumasi, Ghana',
  'tarkwa': 'Tarkwa, Kumasi, Ghana',

  // Common misspellings
  'evincy': 'Evandy Annex, Bomso, Kumasi, Ghana',
  'bruny': 'Brunei Complex, Ayeduase, Kumasi, Ghana',
  'wayingo': 'Wagyingo Hostel, Ayeduase, Kumasi, Ghana',
  'wajingo': 'Wagyingo Hostel, Ayeduase, Kumasi, Ghana',
  'bonso': 'Bomso, Kumasi, Ghana',
  'ayiduase': 'Ayeduase, Kumasi, Ghana',
  'ayeduazi': 'Ayeduase, Kumasi, Ghana',
};

/* ==================== PRODUCT CATALOG ==================== */
const MENU_PRODUCTS = [
  { name: 'Chicken Shawarma', price: 35.00, keywords: ['shawarma', 'sharwama', 'chicken shawarma'] },
  { name: 'Chicken Loaded Fries', price: 65.00, keywords: ['loaded fries', 'chicken loaded'] },
  { name: 'Super Loaded Fries', price: 80.00, keywords: ['super loaded'] },
  { name: 'Extra Cheese', price: 10.00, keywords: ['cheese'] },
  { name: 'Honey Glazed Chicken (6pcs)', price: 50.00, keywords: ['honey glazed', 'honey wings'] },
  { name: 'Spicy Chicken (6pcs)', price: 50.00, keywords: ['spicy chicken', 'spicy wings'] },
  { name: 'BBQ Glazed Chicken (6pcs)', price: 50.00, keywords: ['bbq glazed', 'bbq wings'] },
  { name: 'Fries', price: 25.00, keywords: ['fries', 'chips'] },
  { name: 'Indomie', price: 35.00, keywords: ['indomie'] },
];

const KNUST_COORDS = { lat: 6.6745, lng: -1.5653 };

// FIX 6: Single, authoritative quantity-parsing helper used everywhere.
// Handles "3x", "3 x", "3" prefix patterns consistently.
const parseQuantity = (line: string): number => {
  const match = line.match(/^(\d+)\s*x\s*/i) || line.match(/^(\d+)\s+/);
  return match ? parseInt(match[1], 10) : 1;
};

const CHECKMARK_REGEX = /[✓✔✅]/;
const GHANA_PREFIXES = '(?:20|23|24|25|26|27|28|50|53|54|55|56|57|59)';
const PHONE_REGEX = new RegExp(
  `(?:\\+?\\s?233\\s?${GHANA_PREFIXES}\\s?\\d{3}\\s?\\d{4}|0${GHANA_PREFIXES}\\s?\\d{3}\\s?\\d{4})`
);
const POSSIBLE_PHONE_REGEX = /(?:\+?\s?233|0)[\d\s]{7,14}/;
const PRODUCT_HINT_REGEX = /(shawarma|wings?|wing|indomie|fries|loaded|cheese|set|pcs?|piece|chicken|bbq|spicy|honey)/i;
const LOCATION_HINT_REGEX = /(pick[\s-]?up|hostel|hall|complex|annex|kotei|bomso|ayeduase|knust|findgrace|brunei|evandy|wagyingo|gaza|new site)/i;

const cleanOrderLine = (line: string): string =>
  line.replace(/\s+/g, ' ').replace(CHECKMARK_REGEX, '').trim();

const normalizePhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('233')) {
    return `0${digits.slice(3)}`;
  }
  if (digits.length === 10 && digits.startsWith('0')) {
    return digits;
  }
  return phone.replace(/\s+/g, '');
};

const normalizeOcrLines = (text: string): string[] =>
  text
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .filter(line => !/^\d{1,2}:\d{2}$/.test(line))
    .filter(line => line !== '...')
    .filter(line => !/^[oO0]{2,}$/.test(line));

const sanitizeOcrLine = (line: string): string =>
  line.replace(/\s+/g, ' ').trim();

const isLikelyLocationLine = (line: string): boolean => {
  if (LOCATION_HINT_REGEX.test(line)) return true;
  const lower = line.toLowerCase();
  return Object.keys(HOSTEL_NORMALIZATION_MAP).some(key => lower.includes(key));
};

const isLikelyProductLine = (line: string): boolean => PRODUCT_HINT_REGEX.test(line);

const isLikelyNameLine = (line: string): boolean => {
  const cleaned = cleanOrderLine(line);
  if (!cleaned || /\d/.test(cleaned)) return false;
  if (isLikelyLocationLine(cleaned) || isLikelyProductLine(cleaned)) return false;
  const words = cleaned.split(' ');
  if (words.length > 4) return false;
  return /^[A-Za-z][A-Za-z' -]{1,30}$/.test(cleaned);
};

const normalizeNameCandidate = (line: string): string =>
  cleanOrderLine(line)
    .replace(/[^A-Za-z' -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const isPossibleNameLine = (line: string): boolean => {
  const cleaned = normalizeNameCandidate(line);
  if (!cleaned || /\d/.test(cleaned)) return false;
  if (isLikelyLocationLine(cleaned) || isLikelyProductLine(cleaned)) return false;
  const words = cleaned.split(' ').filter(Boolean);
  if (words.length === 0 || words.length > 4) return false;
  return words.join('').length >= 3;
};

const parseExplicitPrice = (line: string): number | null => {
  const cleaned = line.replace(/[^\d.\s-]/g, ' ').trim();
  const match = cleaned.match(/(\d{1,4}(?:\.\d{1,2})?)\s*$/);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
};

const normalizeOcrPhoneChars = (value: string): string =>
  value
    .replace(/[Oo]/g, '0')
    .replace(/[Il|]/g, '1')
    .replace(/S/g, '5')
    .replace(/B/g, '8');

const extractPhoneCandidate = (line: string): string | null => {
  const normalizedLine = normalizeOcrPhoneChars(line);

  const strict = normalizedLine.match(PHONE_REGEX)?.[0];
  if (strict) return strict;

  const loose = normalizedLine.match(POSSIBLE_PHONE_REGEX)?.[0];
  if (!loose) return null;

  const digits = loose.replace(/\D/g, '');
  if (digits.length === 10 && digits.startsWith('0')) return loose;
  if (digits.length === 12 && digits.startsWith('233')) return loose;

  // OCR sometimes drops one digit; accept near matches for block grouping.
  if ((digits.length === 9 && digits.startsWith('0')) || (digits.length === 11 && digits.startsWith('233'))) {
    return loose;
  }

  return null;
};

const hasPhoneLine = (line: string): boolean => extractPhoneCandidate(line) !== null;

const isOrderAnchorLine = (line: string): boolean => {
  if (!line) return false;
  const cleaned = cleanOrderLine(line);
  if (!cleaned) return false;
  if (CHECKMARK_REGEX.test(line)) return true;
  return isLikelyNameLine(cleaned);
};

const OrderImages: React.FC<OrderImagesProps> = ({ goToPreparedList }) => {
  const [images, setImages] = useState<File[]>([]);
  const [orders, setOrders] = useState<ExtractedOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [ocrProgress, setOcrProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<'idle' | 'ocr' | 'geocoding'>('idle');
  const [, setValidatingLocations] = useState(false);
  const geocodedCountRef = useRef(0);
  const [, setGeocodedCount] = useState(0);

  const blobUrlsRef = useRef<Map<File, string>>(new Map());

  const getBlobUrl = useCallback((file: File): string => {
    let url = blobUrlsRef.current.get(file);
    if (!url) {
      url = URL.createObjectURL(file);
      blobUrlsRef.current.set(file, url);
    }
    return url;
  }, []);

  const revokeAllBlobUrls = useCallback(() => {
    blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    blobUrlsRef.current.clear();
  }, []);

  useEffect(() => {
    return () => revokeAllBlobUrls();
  }, [revokeAllBlobUrls]);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

  useEffect(() => {
    console.log('🔑 API Keys Status:');
    console.log('Google Maps Key loaded:', GOOGLE_MAPS_API_KEY ? `Yes (starts with: ${GOOGLE_MAPS_API_KEY.substring(0, 6)}...)` : 'No');
    console.log('Mapbox Token loaded:', MAPBOX_TOKEN ? `Yes (starts with: ${MAPBOX_TOKEN.substring(0, 6)}...)` : 'No');
    console.log('📍 Available hostels:', Object.keys(HOSTEL_NORMALIZATION_MAP).length);
  }, []);

  /* ==================== LOCATION NORMALIZATION ==================== */
  const normalizeLocation = (rawLocation: string): string => {
    if (!rawLocation || rawLocation.toLowerCase().includes('pick')) {
      return 'Pick-up';
    }

    const lowerLocation = rawLocation.toLowerCase().trim();

    for (const [key, normalized] of Object.entries(HOSTEL_NORMALIZATION_MAP)) {
      if (lowerLocation === key || lowerLocation.includes(key)) {
        console.log(`📍 Normalized "${rawLocation}" → "${normalized}"`);
        return normalized;
      }
    }

    if (lowerLocation.includes('complex') && !lowerLocation.includes('brunei')) {
      return `${rawLocation}, Kumasi, Ghana`;
    }

    if (lowerLocation.includes('hostel') || lowerLocation.includes('hall')) {
      return `${rawLocation}, Kumasi, Ghana`;
    }

    return `${rawLocation}, Kumasi, Ghana`;
  };

  /* ==================== GEOCODING SCORING SYSTEM ==================== */
  const calculateLocationScore = (
    lat: number,
    lng: number,
    placeName: string,
    searchLocation: string
  ): { score: number; distanceKm: number; details: string[] } => {
    let score = 0.5;
    const place = placeName.toLowerCase();
    const search = searchLocation.toLowerCase();
    const details: string[] = [];

    if (place.includes(search) || search.includes(place)) {
      score += 0.3;
      details.push('Text match');
    }

    if (place.includes('kumasi')) {
      score += 0.2;
      details.push('In Kumasi');
    }

    if (place.includes('knust')) {
      score += 0.25;
      details.push('KNUST area');
    }
    if (place.includes('ayeduase')) {
      score += 0.2;
      details.push('Ayeduase area');
    }

    if (place.includes('ashanti')) {
      score += 0.15;
      details.push('Ashanti region');
    }

    const R = 6371;
    const dLat = (lat - KNUST_COORDS.lat) * Math.PI / 180;
    const dLng = (lng - KNUST_COORDS.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(KNUST_COORDS.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    if (distance <= 3) {
      score += 0.3;
      details.push(`Very close to KNUST (${distance.toFixed(1)}km)`);
    } else if (distance <= 8) {
      score += 0.2;
      details.push(`Near KNUST (${distance.toFixed(1)}km)`);
    } else if (distance <= 15) {
      score += 0.1;
      details.push(`In Kumasi area (${distance.toFixed(1)}km)`);
    } else if (distance > 30) {
      score -= 0.4;
      details.push(`Too far from KNUST (${distance.toFixed(1)}km)`);
    }

    for (const key of Object.keys(HOSTEL_NORMALIZATION_MAP)) {
      if (place.includes(key)) {
        score += 0.25;
        details.push(`Matches known hostel: ${key}`);
        break;
      }
    }

    score = Math.min(Math.max(score, 0), 1.0);

    return { score, distanceKm: distance, details };
  };

  /* ==================== MULTI-PROVIDER GEOCODING WITH FALLBACK ==================== */
  const geocodeLocation = async (rawLocation: string): Promise<any> => {
    const fetchWithTimeout = async (url: string, init?: RequestInit, timeoutMs = 10000) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(url, { ...init, signal: controller.signal });
        return response;
      } finally {
        clearTimeout(timer);
      }
    };

    const normalizedLocation = normalizeLocation(rawLocation);

    if (normalizedLocation === 'Pick-up') {
      return {
        status: 'valid',
        provider: 'pickup',
        note: 'Pick-up order',
        placeName: 'Pick-up'
      };
    }

    console.log(`\n🔍 Geocoding: "${rawLocation}" → "${normalizedLocation}"`);

    const queries = Array.from(new Set([
      normalizedLocation,
      ...Object.entries(HOSTEL_NORMALIZATION_MAP)
        .filter(([key]) => rawLocation.toLowerCase().includes(key))
        .map(([, value]) => value)
    ])).slice(0, 2);

    if (queries.length > 1) {
      console.log(`📝 Alternative queries:`, queries.slice(1));
    }

    const allResults: any[] = [];

    if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.length > 10) {
      console.log(`🌐 Attempting Google Maps geocoding...`);
      for (const query of queries) {
        try {
          const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}&region=gh`;
          console.log(`   Query: ${query}`);

          const res = await fetchWithTimeout(url, undefined, 8000);
          const data = await res.json();

          console.log(`   Google API Status: ${data.status}`);

          if (data.status === 'OK' && data.results.length > 0) {
            console.log(`   ✅ Found ${data.results.length} result(s)`);
            for (const result of data.results.slice(0, 3)) {
              const lat = result.geometry.location.lat;
              const lng = result.geometry.location.lng;
              const { score, distanceKm, details } = calculateLocationScore(lat, lng, result.formatted_address, rawLocation);

              allResults.push({
                provider: 'google',
                lat,
                lng,
                placeName: result.formatted_address,
                score,
                distanceKm,
                details,
                confidence: result.geometry.location_type === 'ROOFTOP' ? 'high' : 'medium'
              });
            }
          } else if (data.status === 'ZERO_RESULTS') {
            console.log(`   ⚠️  No results found for: ${query}`);
          } else if (data.status === 'REQUEST_DENIED') {
            console.log(`   ❌ API Key rejected: ${data.error_message || 'Invalid key or permissions'}`);
          }
        } catch (error) {
          console.error('   ❌ Google Maps geocoding error:', error);
        }
      }
    } else {
      console.log(`🌐 Skipping Google Maps (API key missing or invalid)`);
    }

    if (MAPBOX_TOKEN && MAPBOX_TOKEN.length > 10 && allResults.length === 0) {
      console.log(`🌐 Attempting Mapbox geocoding...`);
      for (const query of queries) {
        try {
          const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&proximity=${KNUST_COORDS.lng},${KNUST_COORDS.lat}&country=GH&limit=3`;
          const res = await fetchWithTimeout(url, undefined, 8000);
          const data = await res.json();

          if (data.features?.length > 0) {
            console.log(`   ✅ Found ${data.features.length} result(s)`);
            for (const feature of data.features.slice(0, 3)) {
              const [lng, lat] = feature.center;
              const { score, distanceKm, details } = calculateLocationScore(lat, lng, feature.place_name, rawLocation);

              allResults.push({
                provider: 'mapbox',
                lat,
                lng,
                placeName: feature.place_name,
                score,
                distanceKm,
                details,
                confidence: feature.relevance > 0.9 ? 'high' : 'medium'
              });
            }
          }
        } catch (error) {
          console.error('   ❌ Mapbox geocoding error:', error);
        }
      }
    }

    if (allResults.length === 0) {
      for (const query of queries) {
        try {
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=3&countrycodes=gh`;
          const res = await fetchWithTimeout(url, {
            headers: { 'User-Agent': 'LoadedBitesApp/1.0' }
          }, 8000);
          const data = await res.json();

          if (data?.length > 0) {
            for (const result of data.slice(0, 3)) {
              const lat = parseFloat(result.lat);
              const lng = parseFloat(result.lon);
              const { score, distanceKm, details } = calculateLocationScore(lat, lng, result.display_name, rawLocation);

              allResults.push({
                provider: 'nominatim',
                lat,
                lng,
                placeName: result.display_name,
                score,
                distanceKm,
                details,
                confidence: 'medium'
              });
            }
          }
          await new Promise(resolve => setTimeout(resolve, 350));
        } catch (error) {
          console.error('Nominatim geocoding error:', error);
        }
      }
    }

    allResults.sort((a, b) => b.score - a.score);

    if (allResults.length > 0) {
      const best = allResults[0];

      let status: 'valid' | 'low_confidence' | 'invalid';
      if (best.score >= 0.8) {
        status = 'valid';
      } else if (best.score >= 0.6) {
        status = 'low_confidence';
      } else {
        status = 'invalid';
      }

      console.log(`✅ Best result for "${rawLocation}":`);
      console.log(`   Provider: ${best.provider}`);
      console.log(`   Location: ${best.placeName}`);
      console.log(`   Coordinates: ${best.lat.toFixed(6)}, ${best.lng.toFixed(6)}`);
      console.log(`   Score: ${(best.score * 100).toFixed(1)}%`);
      console.log(`   Distance from KNUST: ${best.distanceKm.toFixed(1)}km`);
      console.log(`   Details: ${best.details.join(', ')}`);

      return {
        status,
        lat: best.lat,
        lng: best.lng,
        placeName: best.placeName,
        provider: best.provider,
        score: best.score,
        distanceKm: best.distanceKm,
        details: best.details,
        normalizedLocation
      };
    }

    console.log(`❌ No geocoding results found for: "${rawLocation}"`);
    return {
      status: 'invalid',
      normalizedLocation
    };
  };

  /* ==================== ORDER PARSING ==================== */
const splitIntoOrders = (text: string): string[] => {
    const orders: string[] = [];
    const raw = text.split('\n').map(sanitizeOcrLine);

    const chunks: string[][] = [];
    let currentChunk: string[] = [];
    for (const line of raw) {
      if (!line) {
        if (currentChunk.length > 0) {
          chunks.push(currentChunk);
          currentChunk = [];
        }
        continue;
      }
      if (/^\d{1,2}:\d{2}$/.test(line) || line === '...' || /^[oO0]{2,}$/.test(line)) {
        continue;
      }
      currentChunk.push(line);
    }
    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    const splitChunkByAnchors = (lines: string[]): string[] => {
      const anchorIndexes: number[] = [];
      const phoneIndexes: number[] = [];

      for (let i = 0; i < lines.length; i++) {
        if (hasPhoneLine(lines[i])) {
          phoneIndexes.push(i);
        }
      }

      if (phoneIndexes.length > 0) {
        const phoneAnchors = phoneIndexes.map(phoneIndex => {
          const prevIndex = phoneIndex - 1;
          if (prevIndex >= 0 && isPossibleNameLine(lines[prevIndex])) {
            return prevIndex;
          }
          return phoneIndex;
        });

        const uniquePhoneAnchors = Array.from(new Set(phoneAnchors)).sort((a, b) => a - b);
        const phoneBlocks: string[] = [];
        for (let i = 0; i < uniquePhoneAnchors.length; i++) {
          const start = uniquePhoneAnchors[i];
          const endExclusive = i < uniquePhoneAnchors.length - 1 ? uniquePhoneAnchors[i + 1] : lines.length;
          const blockLines = lines.slice(start, endExclusive);
          if (blockLines.some(line => hasPhoneLine(line))) {
            phoneBlocks.push(blockLines.join('\n'));
          }
        }

        if (phoneBlocks.length >= 2) {
          return phoneBlocks;
        }
      }

      for (let i = 0; i < lines.length; i++) {
        if (!isOrderAnchorLine(lines[i])) continue;

        if (!CHECKMARK_REGEX.test(lines[i])) {
          const neighborhood = lines.slice(i + 1, i + 4);
          if (!neighborhood.some(line => hasPhoneLine(line))) continue;
        }

        const prevAnchor = anchorIndexes[anchorIndexes.length - 1];
        if (prevAnchor !== undefined) {
          const prev = cleanOrderLine(lines[prevAnchor]).toLowerCase();
          const current = cleanOrderLine(lines[i]).toLowerCase();
          if (prev === current) continue;
        }

        anchorIndexes.push(i);
      }

      if (anchorIndexes.length === 0) {
        const fallbackBlock = lines.join('\n');
        return lines.some(line => hasPhoneLine(line)) ? [fallbackBlock] : [];
      }

      const blocks: string[] = [];
      for (let i = 0; i < anchorIndexes.length; i++) {
        const start = anchorIndexes[i];
        const endExclusive = i < anchorIndexes.length - 1 ? anchorIndexes[i + 1] : lines.length;
        const block = lines.slice(start, endExclusive).join('\n');
        if (lines.slice(start, endExclusive).some(line => hasPhoneLine(line))) {
          blocks.push(block);
        }
      }
      return blocks;
    };

    for (const chunk of chunks) {
      const chunkBlocks = splitChunkByAnchors(chunk);
      orders.push(...chunkBlocks);
    }

    return orders;
  };

  const parseOrderBlock = (text: string): Omit<ExtractedOrder, 'image' | 'rawText'> => {
    const lines = normalizeOcrLines(text);

    let name = '';
    let phone = '';

    let phoneIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      const phoneCandidate = extractPhoneCandidate(lines[i]);
      if (!phoneCandidate) continue;
      phone = normalizePhone(phoneCandidate);
      phoneIndex = i;
      break;
    }

    const checkmarkIndex = lines.findIndex(line => CHECKMARK_REGEX.test(line));
    if (checkmarkIndex >= 0) {
      const checkmarkCandidate = normalizeNameCandidate(lines[checkmarkIndex]);
      if (
        checkmarkCandidate &&
        isPossibleNameLine(checkmarkCandidate) &&
        !isLikelyProductLine(checkmarkCandidate) &&
        (phoneIndex === -1 || checkmarkIndex <= phoneIndex)
      ) {
        name = checkmarkCandidate;
      }
    }

    if (!name && phoneIndex > 0 && isPossibleNameLine(lines[phoneIndex - 1])) {
      name = normalizeNameCandidate(lines[phoneIndex - 1]);
    }

    if (!name && phoneIndex > 0) {
      const beforePhone = lines.slice(Math.max(0, phoneIndex - 3), phoneIndex).find(isPossibleNameLine);
      if (beforePhone) {
        name = normalizeNameCandidate(beforePhone);
      }
    }

    if (!name) {
      const fallbackName = lines.find(line => isPossibleNameLine(line));
      name = fallbackName ? normalizeNameCandidate(fallbackName) : 'Unknown';
    }

    const locationCandidates: string[] = [];
    const itemCandidates: string[] = [];
    const productTaggedCheckmarkLine =
      checkmarkIndex >= 0 && isLikelyProductLine(cleanOrderLine(lines[checkmarkIndex]))
        ? cleanOrderLine(lines[checkmarkIndex])
        : '';

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const line = cleanOrderLine(rawLine);
      if (!line) continue;
      if (line === name) continue;
      if (hasPhoneLine(line)) continue;
      if (phoneIndex >= 0 && i < phoneIndex && i !== checkmarkIndex) continue;

      if (/pick[\s-]?up/i.test(line)) {
        locationCandidates.push('Pick-up');
        continue;
      }

      if (isLikelyLocationLine(line)) {
        locationCandidates.push(line);
        continue;
      }

      if (isLikelyProductLine(line)) {
        itemCandidates.push(line);
      }
    }

    if (productTaggedCheckmarkLine && !itemCandidates.includes(productTaggedCheckmarkLine)) {
      itemCandidates.unshift(productTaggedCheckmarkLine);
    }

    const dedupedLocations = Array.from(new Set(locationCandidates));
    const location = dedupedLocations.length > 0
      ? dedupedLocations[dedupedLocations.length - 1]
      : 'Pick-up';

    const parsedItems: string[] = [];
    let explicitTotal = 0;
    let hasExplicitPrice = false;
    let inferredTotal = 0;

    for (const line of itemCandidates) {
      const quantity = parseQuantity(line);
      const matchedProduct = MENU_PRODUCTS.find(product =>
        product.keywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()))
      );

      if (matchedProduct) {
        parsedItems.push(quantity > 1 ? `${quantity} ${matchedProduct.name}` : matchedProduct.name);
      } else {
        parsedItems.push(line.replace(/[-–]\s*\d+(?:\.\d{1,2})?\s*$/g, '').trim());
      }

      const explicitPrice = parseExplicitPrice(line);
      if (explicitPrice !== null && explicitPrice > 0) {
        explicitTotal += explicitPrice;
        hasExplicitPrice = true;
      } else if (matchedProduct) {
        inferredTotal += matchedProduct.price * quantity;
      }
    }

    const finalAmount = hasExplicitPrice ? explicitTotal : inferredTotal;

    return {
      name,
      phone: phone || 'No phone',
      product: parsedItems.join(', ') || 'Unknown product',
      amount: finalAmount > 0 ? finalAmount.toFixed(2) : '',
      location
    };
  };

  /* ==================== MAIN PROCESSING ==================== */
  const process = async () => {
    if (images.length === 0) return;

    setOrders([]);
    geocodedCountRef.current = 0;
    setGeocodedCount(0);
    setOcrProgress(0);
    setProcessingStage('ocr');

    setLoading(true);
    setProgress({ current: 0, total: images.length });

    const allExtracted: ExtractedOrder[] = [];

    for (let i = 0; i < images.length; i++) {
      setProgress({ current: i + 1, total: images.length });

      try {
        const result = await Tesseract.recognize(images[i], 'eng', {
          logger: (message) => {
            if (message.status === 'recognizing text' && typeof message.progress === 'number') {
              setOcrProgress(Math.round(message.progress * 100));
            }
          }
        });
        const orderBlocks = splitIntoOrders(result.data.text);

        orderBlocks.forEach(block => {
          const parsed = parseOrderBlock(block);
          allExtracted.push({
            image: images[i],
            rawText: block,
            ...parsed
          });
        });
      } catch (error) {
        console.error(`Error processing image ${i}:`, error);
      }
    }

    setOrders(allExtracted);
    setLoading(false);

    if (allExtracted.length > 0) {
      setProcessingStage('geocoding');
      setValidatingLocations(true);
      const updatedOrders = [...allExtracted];

      for (let i = 0; i < updatedOrders.length; i++) {
        const order = updatedOrders[i];

        if (order.location) {
          console.log(`\n📍 Validating location for ${order.name}: ${order.location}`);
          const geocodeResult = await geocodeLocation(order.location);

          updatedOrders[i] = {
            ...order,
            locationStatus: geocodeResult.status,
            latitude: geocodeResult.lat,
            longitude: geocodeResult.lng,
            resolvedLocationName: geocodeResult.placeName,
            geocodingProvider: geocodeResult.provider
          };

          geocodedCountRef.current += 1;
          setGeocodedCount(geocodedCountRef.current);

          setOrders([...updatedOrders]);

          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      setValidatingLocations(false);
    }

    setProcessingStage('idle');
    setOcrProgress(0);
  };

  /* ==================== UI COMPONENTS ==================== */

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    const file = images[index];
    const url = blobUrlsRef.current.get(file);
    if (url) {
      URL.revokeObjectURL(url);
      blobUrlsRef.current.delete(file);
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePrepareOrderList = () => {
    goToPreparedList(orders);
  };


  return (
    <main className="flex w-full flex-col gap-4 mx-auto px-4 sm:px-6 md:px-8">
      {/* Header */}
      <div className='flex items-center justify-between w-full max-w-7xl mx-auto mt-4 sm:mt-6 md:mt-8'>
        <div className="flex items-center cursor-pointer">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-4 sm:h-5 w-2.5 sm:w-3"
          />
          <span className="text-red-600 text-base sm:text-lg font-bold">B</span>
          <span className="text-black/50 text-base sm:text-lg font-bold">ites.</span>
        </div>

        <div className="h-5 sm:h-6 px-1 sm:px-1.5 py-1.5 sm:py-2.5 bg-orange-400 rounded-[50px] flex items-center justify-center">
          <div className="text-center text-white text-xs">R 👩🏽‍🍳</div>
        </div>
      </div>

      {/* Image Upload Section - Responsive Grid */}
      <section className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Upload Button */}
          <label className="flex flex-col items-center justify-center aspect-square w-full border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 p-2">
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-1 sm:mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-xs sm:text-sm text-gray-600 font-medium text-center">Upload</span>
          </label>

          {/* Uploaded Images */}
          {images.map((file, index) => (
            <div key={index} className="relative aspect-square w-full group">
              <img
                src={getBlobUrl(file)}
                alt={`Order ${index + 1}`}
                className="w-full h-full object-cover rounded-xl border"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black/80 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Action Buttons - Extract and Go to Prepared List */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-7xl mx-auto mt-4">
        {/* Process Button */}
        {images.length > 0 && orders.length === 0 && !loading && (
          <button
            onClick={process}
            className="bg-orange-400 hover:bg-orange-700 text-white px-6 sm:px-10 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-medium"
          >
            Extract Orders from {images.length} {images.length === 1 ? 'Image' : 'Images'}
          </button>
        )}

        {/* Go to Prepared List Button - Show when orders are extracted */}
        {orders.length > 0 && (
          <button
            onClick={handlePrepareOrderList}
            className="bg-orange-400 hover:bg-orange-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-medium flex items-center justify-center gap-2"
          >
     
            View Prepared List 
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 w-full max-w-7xl mx-auto">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-700 font-medium text-sm sm:text-base text-center px-4">
            {processingStage === 'ocr'
              ? `Extracting text from image ${progress.current} of ${progress.total} (${ocrProgress}%)...`
              : `Processing image ${progress.current} of ${progress.total}...`}
          </p>
          {progress.current > 0 && progress.total > 0 && (
            <div className="w-48 sm:w-64 bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              ></div>
            </div>
          )}
        </div>
      )}

      {/* Extracted Orders */}
      {/* {orders.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 w-full max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Extracted Orders ({orders.length})</h2>
            <div className="flex gap-2">
              <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 text-xs sm:text-sm rounded-full">
                {orders.filter(o => o.locationStatus === 'valid').length} Valid
              </span>
              <span className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-800 text-xs sm:text-sm rounded-full">
                {orders.filter(o => o.locationStatus === 'low_confidence').length} Low Confidence
              </span>
            </div>
          </div>

          <div className="space-y-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2">
            {orders.map((order, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:border-blue-300 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm sm:text-base">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-base sm:text-lg">{order.name}</h3>
                      <p className="text-gray-600 font-mono text-xs sm:text-sm">{order.phone}</p>
                    </div>
                  </div>
                  <LocationBadge status={order.locationStatus} provider={order.geocodingProvider} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Products</p>
                    <p className="font-medium text-sm sm:text-base">{order.product}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="font-bold text-base sm:text-lg">GHC{order.amount || '0.00'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Delivery Location</p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                      <p className="font-medium text-sm sm:text-base">{order.location}</p>
                      {order.resolvedLocationName && order.resolvedLocationName !== order.location && (
                        <span className="text-xs text-gray-500">→ {order.resolvedLocationName}</span>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Coordinates</p>
                    {order.latitude && order.longitude ? (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                        <p className="font-mono text-xs sm:text-sm break-all">
                          {order.latitude.toFixed(6)}, {order.longitude.toFixed(6)}
                        </p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${order.latitude},${order.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm"
                        >
                          View Map ↗
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-xs sm:text-sm">Not geocoded</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

   
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button
              onClick={handlePrepareOrderList}
              className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Prepare Order List ({orders.length})
            </button>

            {orders.filter(o => o.latitude && o.longitude).length > 0 && (
              <button
                onClick={handleViewAllOnMap}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                View Route ({orders.filter(o => o.latitude).length})
              </button>
            )}
          </div>
        </section>
      )} */}
    </main>
  );
};

export default OrderImages;