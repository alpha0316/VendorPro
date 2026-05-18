export interface ExtractedOrder {
  image?: File;
  rawText?: string;
  name: string;
  phone: string;
  product: string;
  amount: string;
  location: string;
}

export const MENU_PRODUCTS = [
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

const CHECKMARK_REGEX = /[✓✔✅]/;
const GHANA_PREFIXES = '(?:20|23|24|25|26|27|28|50|53|54|55|56|57|59)';
const PHONE_REGEX = new RegExp(
  `(?:\\+?\\s?233\\s?${GHANA_PREFIXES}\\s?\\d{3}\\s?\\d{4}|0${GHANA_PREFIXES}\\s?\\d{3}\\s?\\d{4})`
);
const POSSIBLE_PHONE_REGEX = /(?:\+?\s?233|0)[\d\s]{7,14}/;
const PRODUCT_HINT_REGEX = /(shawarma|wings?|wing|indomie|fries|loaded|cheese|set|pcs?|piece|chicken|bbq|spicy|honey)/i;
const LOCATION_HINT_REGEX = /(pick[\s-]?up|hostel|hall|complex|annex|kotei|bomso|ayeduase|knust|findgrace|brunei|evandy|wagyingo|gaza|new site)/i;

const HOSTEL_NORMALIZATION_MAP: Record<string, string> = {
  'brunei': 'Brunei Complex, Ayeduase, Kumasi, Ghana',
  'bruni': 'Brunei Complex, Ayeduase, Kumasi, Ghana',
  'evandy': 'Evandy Annex, Bomso, Kumasi, Ghana',
  'evandi': 'Evandy Annex, Bomso, Kumasi, Ghana',
  'wagyingo': 'Wagyingo Hostel, Ayeduase, Kumasi, Ghana',
  'wagyengo': 'Wagyingo Hostel, Ayeduase, Kumasi, Ghana',
  'gaza': 'Gaza, Wilkado Hostel area, Kumasi, Ghana',
  'bomso': 'Bomso, Kumasi, Ghana',
  'kotei': 'Kotei, Kumasi, Ghana',
  'findgrace': 'Findgrace, Kotei, Kumasi, Ghana',
  'ayeduase': 'Ayeduase, Kumasi, Ghana',
  'ayduase': 'Ayeduase, Kumasi, Ghana',
  'new site': 'Ayeduase New Site, Kumasi, Ghana',
  'providence': 'Providence Hostel, Ayeduase, Kumasi, Ghana',
  'westend': 'Westend Hostel, Ayeduase, Kumasi, Ghana',
  'ultimate': 'Ultimate Hostel, Bomso, Kumasi, Ghana',
  'frontline': 'Frontline Court, Ayeduase, Kumasi, Ghana',
  'adom bi': 'Adom-Bi Hostel, Ayeduase, Kumasi, Ghana',
  'victory towers': 'Victory Towers Hostel, Kumasi, Ghana',
};

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
  return isPossibleNameLine(cleaned);
};

const parseQuantity = (line: string): number => {
  const match = line.match(/^(\d+)\s*x\s*/i) || line.match(/^(\d+)\s+/);
  return match ? parseInt(match[1], 10) : 1;
};

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

export const parseOrdersFromText = (text: string): ExtractedOrder[] => {
  const blocks = splitIntoOrders(text);
  return blocks.map(block => {
    const parsed = parseOrderBlock(block);
    return { image: undefined, rawText: block, ...parsed };
  });
};
