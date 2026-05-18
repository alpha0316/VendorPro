import { useState, useEffect, useRef, useCallback } from 'react';
import './../App.css';
import DynamicLogo from '../components/DynamicLogo';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

/* ════════════════════════════════════════════════════════════
   SHARED TYPES  (mirrors OrderImages / PreparedList)
════════════════════════════════════════════════════════════ */
interface ExtractedOrder {
  image?: File;
  rawText?: string;
  name: string;
  phone: string;
  product: string;
  amount: string;
  location: string;
}

/* ════════════════════════════════════════════════════════════
   SHARED PARSING HELPERS  (same logic as OrderImages.tsx)
════════════════════════════════════════════════════════════ */
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
  'knust': 'KNUST Main Campus, Kumasi, Ghana',
  'tech junction': 'Tech Junction, Kumasi, Ghana',
  'atonsu': 'Atonsu, Kumasi, Ghana',
  'evincy': 'Evandy Annex, Bomso, Kumasi, Ghana',
  'bruny': 'Brunei Complex, Ayeduase, Kumasi, Ghana',
  'bonso': 'Bomso, Kumasi, Ghana',
};

const MENU_PRODUCTS = [
  { name: 'Chicken Shawarma',       price: 35.00, keywords: ['shawarma', 'sharwama', 'chicken shawarma'] },
  { name: 'Chicken Loaded Fries',   price: 65.00, keywords: ['loaded fries', 'chicken loaded'] },
  { name: 'Super Loaded Fries',     price: 80.00, keywords: ['super loaded'] },
  { name: 'Extra Cheese',           price: 10.00, keywords: ['cheese'] },
  { name: 'Honey Glazed Chicken',   price: 50.00, keywords: ['honey glazed', 'honey wings'] },
  { name: 'Spicy Chicken',          price: 50.00, keywords: ['spicy chicken', 'spicy wings'] },
  { name: 'BBQ Glazed Chicken',     price: 50.00, keywords: ['bbq glazed', 'bbq wings'] },
  { name: 'Fries',                  price: 25.00, keywords: ['fries', 'chips'] },
  { name: 'Indomie',                price: 35.00, keywords: ['indomie'] },
];

const CHECKMARK_REGEX = /[✓✔✅]/;
const GHANA_PREFIXES = '(?:20|23|24|25|26|27|28|50|53|54|55|56|57|59)';
const PHONE_REGEX = new RegExp(
  `(?:\\+?\\s?233\\s?${GHANA_PREFIXES}\\s?\\d{3}\\s?\\d{4}|0${GHANA_PREFIXES}\\s?\\d{3}\\s?\\d{4})`
);
const POSSIBLE_PHONE_REGEX = /(?:\+?\s?233|0)[\d\s]{7,14}/;
const PRODUCT_HINT_REGEX = /(shawarma|wings?|indomie|fries|loaded|cheese|set|pcs?|chicken|bbq|spicy|honey)/i;
const LOCATION_HINT_REGEX = /(pick[\s-]?up|hostel|hall|complex|annex|kotei|bomso|ayeduase|knust|findgrace|brunei|evandy|wagyingo|gaza|new site)/i;

const cleanLine = (l: string) => l.replace(/\s+/g, ' ').replace(CHECKMARK_REGEX, '').trim();
const sanitize  = (l: string) => l.replace(/\s+/g, ' ').trim();

const normalizeOcrPhoneChars = (v: string) =>
  v.replace(/[Oo]/g,'0').replace(/[Il|]/g,'1').replace(/S/g,'5').replace(/B/g,'8');

const normalizePhone = (p: string): string => {
  const d = p.replace(/\D/g,'');
  if (d.length === 12 && d.startsWith('233')) return `0${d.slice(3)}`;
  if (d.length === 10 && d.startsWith('0')) return d;
  return p.replace(/\s+/g,'');
};

const extractPhoneCandidate = (line: string): string | null => {
  const n = normalizeOcrPhoneChars(line);
  const strict = n.match(PHONE_REGEX)?.[0];
  if (strict) return strict;
  const loose = n.match(POSSIBLE_PHONE_REGEX)?.[0];
  if (!loose) return null;
  const d = loose.replace(/\D/g,'');
  if ((d.length===10&&d.startsWith('0'))||(d.length===12&&d.startsWith('233'))) return loose;
  if ((d.length===9&&d.startsWith('0'))||(d.length===11&&d.startsWith('233'))) return loose;
  return null;
};

const hasPhoneLine = (l: string) => extractPhoneCandidate(l) !== null;

const isLikelyLocation = (l: string): boolean => {
  if (LOCATION_HINT_REGEX.test(l)) return true;
  const low = l.toLowerCase();
  return Object.keys(HOSTEL_NORMALIZATION_MAP).some(k => low.includes(k));
};

const isLikelyProduct = (l: string) => PRODUCT_HINT_REGEX.test(l);

const normalizeName = (l: string) =>
  cleanLine(l).replace(/[^A-Za-z' -]/g,' ').replace(/\s+/g,' ').trim();

const isPossibleName = (l: string): boolean => {
  const c = normalizeName(l);
  if (!c || /\d/.test(c)) return false;
  if (isLikelyLocation(c) || isLikelyProduct(c)) return false;
  const words = c.split(' ').filter(Boolean);
  if (!words.length || words.length > 4) return false;
  return words.join('').length >= 3;
};

const parseQuantity = (line: string): number => {
  const m = line.match(/^(\d+)\s*x\s*/i) || line.match(/^(\d+)\s+/);
  return m ? parseInt(m[1], 10) : 1;
};

const parseExplicitPrice = (line: string): number | null => {
  const m = line.replace(/[^\d.\s-]/g,' ').trim().match(/(\d{1,4}(?:\.\d{1,2})?)\s*$/);
  if (!m) return null;
  const v = Number(m[1]);
  return Number.isFinite(v) ? v : null;
};

const normalizeOcrLines = (text: string): string[] =>
  text.split('\n')
    .map(l => l.replace(/\s+/g,' ').trim())
    .filter(Boolean)
    .filter(l => !/^\d{1,2}:\d{2}$/.test(l))
    .filter(l => l !== '...')
    .filter(l => !/^[oO0]{2,}$/.test(l));

const isOrderAnchor = (l: string): boolean => {
  if (!l) return false;
  const c = cleanLine(l);
  if (CHECKMARK_REGEX.test(l)) return true;
  if (!/\d/.test(c) && isLikelyLocation(c)) return false;
  if (isLikelyProduct(c)) return false;
  const words = c.split(' ');
  if (words.length > 4) return false;
  return /^[A-Za-z][A-Za-z' -]{1,30}$/.test(c);
};

/* ── Split raw text into per-person order blocks ── */
const splitIntoOrders = (text: string): string[] => {
  const orders: string[] = [];
  const raw = text.split('\n').map(sanitize);

  const chunks: string[][] = [];
  let cur: string[] = [];
  for (const line of raw) {
    if (!line) { if (cur.length) { chunks.push(cur); cur = []; } continue; }
    if (/^\d{1,2}:\d{2}$/.test(line) || line === '...' || /^[oO0]{2,}$/.test(line)) continue;
    cur.push(line);
  }
  if (cur.length) chunks.push(cur);

  const splitChunk = (lines: string[]): string[] => {
    const phoneIdxs: number[] = [];
    lines.forEach((l, i) => { if (hasPhoneLine(l)) phoneIdxs.push(i); });

    if (phoneIdxs.length > 0) {
      const anchors = Array.from(new Set(phoneIdxs.map(pi => {
        const prev = pi - 1;
        return (prev >= 0 && isPossibleName(lines[prev])) ? prev : pi;
      }))).sort((a,b)=>a-b);

      const blocks = anchors.map((start, i) => {
        const end = i < anchors.length - 1 ? anchors[i+1] : lines.length;
        return lines.slice(start, end);
      }).filter(b => b.some(l => hasPhoneLine(l)));

      if (blocks.length >= 2) return blocks.map(b => b.join('\n'));
    }

    const anchorIdxs: number[] = [];
    lines.forEach((l, i) => {
      if (!isOrderAnchor(l)) return;
      const neighborhood = lines.slice(i+1, i+4);
      if (!CHECKMARK_REGEX.test(l) && !neighborhood.some(hasPhoneLine)) return;
      anchorIdxs.push(i);
    });

    if (!anchorIdxs.length) {
      const fallback = lines.join('\n');
      return lines.some(hasPhoneLine) ? [fallback] : [];
    }

    return anchorIdxs.map((start, i) => {
      const end = i < anchorIdxs.length-1 ? anchorIdxs[i+1] : lines.length;
      const block = lines.slice(start, end);
      return block.some(hasPhoneLine) ? block.join('\n') : null;
    }).filter(Boolean) as string[];
  };

  for (const chunk of chunks) orders.push(...splitChunk(chunk));
  return orders;
};

/* ── Parse one order block into structured fields ── */
const parseOrderBlock = (text: string): Omit<ExtractedOrder, 'image' | 'rawText'> => {
  const lines = normalizeOcrLines(text);
  let name = '', phone = '', phoneIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const c = extractPhoneCandidate(lines[i]);
    if (c) { phone = normalizePhone(c); phoneIndex = i; break; }
  }

  const ckIdx = lines.findIndex(l => CHECKMARK_REGEX.test(l));
  if (ckIdx >= 0) {
    const c = normalizeName(lines[ckIdx]);
    if (c && isPossibleName(c) && !isLikelyProduct(c) && (phoneIndex === -1 || ckIdx <= phoneIndex))
      name = c;
  }
  if (!name && phoneIndex > 0 && isPossibleName(lines[phoneIndex-1]))
    name = normalizeName(lines[phoneIndex-1]);
  if (!name && phoneIndex > 0) {
    const bf = lines.slice(Math.max(0,phoneIndex-3), phoneIndex).find(isPossibleName);
    if (bf) name = normalizeName(bf);
  }
  if (!name) {
    const fb = lines.find(isPossibleName);
    name = fb ? normalizeName(fb) : 'Unknown';
  }

  const locationCandidates: string[] = [];
  const itemCandidates: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = cleanLine(lines[i]);
    if (!line || line === name || hasPhoneLine(line)) continue;
    if (phoneIndex >= 0 && i < phoneIndex && i !== ckIdx) continue;
    if (/pick[\s-]?up/i.test(line)) { locationCandidates.push('Pick-up'); continue; }
    if (isLikelyLocation(line)) { locationCandidates.push(line); continue; }
    if (isLikelyProduct(line)) itemCandidates.push(line);
  }

  const location = locationCandidates.length
    ? locationCandidates[locationCandidates.length-1]
    : 'Pick-up';

  const parsedItems: string[] = [];
  let explicitTotal = 0, inferredTotal = 0;
  let hasExplicit = false;

  for (const line of itemCandidates) {
    const qty = parseQuantity(line);
    const matched = MENU_PRODUCTS.find(p =>
      p.keywords.some(k => line.toLowerCase().includes(k.toLowerCase()))
    );
    parsedItems.push(matched
      ? (qty > 1 ? `${qty} ${matched.name}` : matched.name)
      : line.replace(/[-–]\s*\d+(?:\.\d{1,2})?\s*$/g,'').trim()
    );
    const ep = parseExplicitPrice(line);
    if (ep !== null && ep > 0) { explicitTotal += ep; hasExplicit = true; }
    else if (matched) inferredTotal += matched.price * qty;
  }

  const finalAmount = hasExplicit ? explicitTotal : inferredTotal;

  return {
    name,
    phone: phone || 'No phone',
    product: parsedItems.join(', ') || 'Unknown product',
    amount: finalAmount > 0 ? finalAmount.toFixed(2) : '',
    location,
  };
};

/* ── Parse full raw text → array of ExtractedOrders ── */
const parseRawText = (text: string): ExtractedOrder[] => {
  const blocks = splitIntoOrders(text.trim());
  if (!blocks.length) {
    // Treat entire text as one order if no blocks detected
    const single = parseOrderBlock(text);
    return [{ rawText: text, ...single }];
  }
  return blocks.map(block => ({ rawText: block, ...parseOrderBlock(block) }));
};


/* ════════════════════════════════════════════════════════════
   PASTE ANIMATION  (unchanged)
════════════════════════════════════════════════════════════ */
const PasteAnimation = () => (
  <div className="relative w-full flex flex-col items-center justify-center py-8 overflow-hidden select-none pointer-events-none">
    <div className="flex flex-col items-center gap-1.5 sm:gap-2 animate-container-float">
      {[
        { text: 'Jollof' },
        { text: 'Evandy Annex' },
        { text: 'Prince - 0559488203' },
      ].map((line, i) => (
        <div key={i} className="relative px-2 py-0.5">
          <div
            className="absolute inset-0 bg-[#007AFF]/20 rounded-sm z-0 animate-selection-expand"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
          <span className="relative z-10 text-[#333] text-xs sm:text-sm font-semibold tracking-tight">
            {line.text}
          </span>
          {i === 0 && (
            <div className="absolute -left-1 -top-1 w-2 h-2 bg-[#007AFF] rounded-full border-2 border-white animate-fade-in" />
          )}
          {i === 2 && (
            <div className="absolute -right-1 -bottom-1 w-2 h-2 bg-[#007AFF] rounded-full border-2 border-white animate-fade-in" />
          )}
        </div>
      ))}
    </div>

    {/* Floating copy/paste menu */}
    <div className="absolute bottom-2 left-105 -translate-x-1/2 flex items-center bg-white/95 backdrop-blur-md rounded-2xl border border-black/5 shadow-xl px-1 py-1 animate-menu-slide-up">
      <div className="flex items-center gap-2 px-3 py-1.5">
        <svg className="w-3.5 h-3.5 text-black/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <span className="text-[10px] sm:text-xs font-medium text-black/70">Copy</span>
      </div>
      <div className="w-px h-4 bg-black/10" />
      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/3 rounded-xl animate-pulse-subtle">
        <svg className="w-3.5 h-3.5 text-black/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" />
        </svg>
        <span className="text-[10px] sm:text-xs font-bold text-black">Paste</span>
      </div>
    </div>

    <style>{`
      @keyframes container-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      @keyframes selection-expand { 0%,20%{width:0;left:50%;opacity:0} 40%,80%{width:100%;left:0;opacity:1} 90%,100%{opacity:0} }
      @keyframes menu-slide-up { 0%,30%{opacity:0;transform:translate(-50%,12px)} 45%,85%{opacity:1;transform:translate(-50%,0)} 95%,100%{opacity:0;transform:translate(-50%,4px)} }
      @keyframes pulse-subtle { 0%,100%{background-color:rgba(0,0,0,0.03)} 50%{background-color:rgba(0,0,0,0.08)} }
      .animate-container-float  { animation: container-float 4s ease-in-out infinite; }
      .animate-selection-expand { animation: selection-expand 4s ease-in-out infinite; }
      .animate-menu-slide-up    { animation: menu-slide-up 4s ease-in-out infinite; }
      .animate-pulse-subtle     { animation: pulse-subtle 2s ease-in-out infinite; }
      .animate-fade-in          { animation: fadeIn 4s ease-in-out infinite; }
      @keyframes fadeIn { 0%,35%{opacity:0} 45%,80%{opacity:1} 90%,100%{opacity:0} }
    `}</style>
  </div>
);


/* ════════════════════════════════════════════════════════════
   RECORDING PULSE INDICATOR
════════════════════════════════════════════════════════════ */
const RecordingIndicator = ({ amplitude }: { amplitude: number }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full border border-red-200">
    <div className="relative flex items-center justify-center">
      <span
        className="absolute inline-flex rounded-full bg-red-400 opacity-75"
        style={{
          width: `${14 + amplitude * 10}px`,
          height: `${14 + amplitude * 10}px`,
          transition: 'width 0.1s, height 0.1s',
        }}
      />
      <span className="relative w-2.5 h-2.5 rounded-full bg-red-500" />
    </div>
    <span className="text-xs font-medium text-red-600">Recording…</span>
  </div>
);


/* ════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
════════════════════════════════════════════════════════════ */
interface AppProps {
  goToPreparedList: (orders: ExtractedOrder[]) => void;
  goToHome: () => void;
}

function App({ goToPreparedList, goToHome }: AppProps) {
  const [rawText, setRawText]               = useState('');
  const [isRecording, setIsRecording]       = useState(false);
  const [amplitude, setAmplitude]           = useState(0);
  const [transcriptBuf, setTranscriptBuf]   = useState('');  // interim speech text
  const [inputMode, setInputMode]           = useState<'scratch'|'paste'|'voice'>('paste');
  const [isParsing, setIsParsing]           = useState(false);
  const [parseError, setParseError]         = useState('');

  // Speech recognition
  const recognitionRef = useRef<any>(null);
  // Audio analyser for waveform amplitude
  const analyserRef    = useRef<AnalyserNode | null>(null);
  const micStreamRef   = useRef<MediaStream | null>(null);
  const rafRef         = useRef<number>(0);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);

  /* ── Setup SpeechRecognition ── */
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec: any = new SR();
    rec.continuous     = true;
    rec.interimResults = true;
    rec.lang           = 'en-GB';

    rec.onresult = (e: any) => {
      let interim = '', final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t + '\n';
        else interim += t;
      }
      if (final) setRawText(prev => prev + final);
      setTranscriptBuf(interim);
    };

    rec.onerror = () => stopRecording();
    recognitionRef.current = rec;
    return () => rec.abort();
  }, []);

  /* ── Amplitude animation ── */
  const animateAmplitude = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.fftSize);
    analyserRef.current.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += Math.abs(data[i] - 128);
    setAmplitude(Math.min(sum / data.length / 20, 1));
    rafRef.current = requestAnimationFrame(animateAmplitude);
  }, []);

  /* ── Start recording ── */
  const startRecording = async () => {
    setParseError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      analyserRef.current = analyser;
      rafRef.current = requestAnimationFrame(animateAmplitude);

      recognitionRef.current?.start();
      setIsRecording(true);
      setInputMode('voice');
    } catch {
      setParseError('Microphone access denied. Please allow microphone permission.');
    }
  };

  /* ── Stop recording ── */
  const stopRecording = () => {
    recognitionRef.current?.stop();
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    cancelAnimationFrame(rafRef.current);
    setIsRecording(false);
    setAmplitude(0);
    setTranscriptBuf('');
  };

  const toggleRecording = () => isRecording ? stopRecording() : startRecording();

  /* ── Parse & navigate ── */
  const handleSend = async () => {
    const text = (rawText + (transcriptBuf ? '\n' + transcriptBuf : '')).trim();
    if (!text) { setParseError('Please paste or dictate your orders first.'); return; }
    if (isRecording) stopRecording();

    setIsParsing(true);
    setParseError('');

    // Small delay so UI updates before heavy parsing
    await new Promise(r => setTimeout(r, 50));

    try {
      const orders = parseRawText(text);
      goToPreparedList(orders);
    } catch (err) {
      console.error(err);
      setParseError('Could not parse orders. Check the format and try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const combinedText = rawText + (transcriptBuf ? transcriptBuf : '');
  const hasContent   = combinedText.trim().length > 0;

  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-[#FDFDFD] px-4 sm:px-6 md:px-8">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto mt-4 sm:mt-6 md:mt-8">
        <DynamicLogo onClick={goToHome} />
        <div className="h-8 w-8 bg-orange-400 rounded-full flex items-center justify-center shadow-sm">
          <div className="text-[10px]">👩🏽‍🍳</div>
        </div>
      </div>

      {/* ── CONTENT CARD ── */}
      <section className="w-full max-w-169.75 bg-neutral-50 rounded-3xl outline-1 -outline-offset-1 outline-black/5 overflow-hidden mt-6 sm:mt-12">

        {/* Paste animation */}
        <PasteAnimation />

        {/* Title */}
        <div className="flex flex-col gap-3 text-center mb-6 px-6">
          <h1 className="text-black text-3xl font-extrabold">Paste Your Orders</h1>
          
        </div>

        <section className="flex flex-col items-center justify-center w-full gap-4 p-4">

          {/* ── MODE TABS ── */}
          <main className="flex items-center justify-center w-full gap-3">
            {/* Start from scratch */}
            <button
              onClick={() => setInputMode('scratch')}
              className={`flex px-3 py-2 rounded-xl outline outline-offset-[-0.5px] justify-start items-start gap-2 w-full transition-all ${
                inputMode === 'scratch'
                  ? 'bg-blue-50 outline-blue-400'
                  : 'bg-neutral-50/70 outline-blue-400/50 hover:bg-neutral-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ paddingTop: 2 }}>
                <path d="M4.66667 1.75H3.15C2.7787 1.75 2.4226 1.8975 2.16005 2.16005C1.8975 2.4226 1.75 2.7787 1.75 3.15V12.0167C1.75 12.388 1.8975 12.7441 2.16005 13.0066C2.4226 13.2692 2.7787 13.4167 3.15 13.4167H10.85C11.2213 13.4167 11.5774 13.2692 11.8399 13.0066C12.1025 12.7441 12.25 12.388 12.25 12.0167V3.15C12.25 2.7787 12.1025 2.4226 11.8399 2.16005C11.5774 1.8975 11.2213 1.75 10.85 1.75H9.33333V2.45C9.33333 2.57377 9.28417 2.69247 9.19665 2.77998C9.10913 2.8675 8.99043 2.91667 8.86667 2.91667H5.13333C5.00957 2.91667 4.89087 2.8675 4.80335 2.77998C4.71583 2.69247 4.66667 2.57377 4.66667 2.45V1.75Z"
                  fill="black" fillOpacity="0.16"/>
                <path d="M9.33333 1.74998H10.85C11.2213 1.74998 11.5774 1.89748 11.8399 2.16003C12.1025 2.42258 12.25 2.77868 12.25 3.14998V12.0166C12.25 12.3879 12.1025 12.744 11.8399 13.0066C11.5774 13.2691 11.2213 13.4166 10.85 13.4166H3.15C2.96615 13.4166 2.7841 13.3804 2.61424 13.3101C2.44439 13.2397 2.29005 13.1366 2.16005 13.0066C1.8975 12.744 1.75 12.3879 1.75 12.0166V3.14998C1.75 2.96613 1.78621 2.78408 1.85657 2.61422C1.92693 2.44437 2.03005 2.29003 2.16005 2.16003C2.4226 1.89748 2.7787 1.74998 3.15 1.74998H4.66667M5.13333 0.583313H8.86667C8.99043 0.583313 9.10913 0.63248 9.19665 0.719996C9.28417 0.807513 9.33333 0.926212 9.33333 1.04998V2.44998C9.33333 2.57375 9.28417 2.69245 9.19665 2.77996C9.10913 2.86748 8.99043 2.91665 8.86667 2.91665H5.13333C5.00957 2.91665 4.89087 2.86748 4.80335 2.77996C4.71583 2.69245 4.66667 2.57375 4.66667 2.44998V1.04998C4.66667 0.926212 4.71583 0.807513 4.80335 0.719996C4.89087 0.63248 5.00957 0.583313 5.13333 0.583313Z"
                  stroke="black" strokeOpacity="0.6" strokeWidth="0.875" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="flex flex-col gap-1 items-start">
                <p className="text-black/70 text-sm font-semibold">Start From Scratch</p>
                <p className="text-black/40 text-xs font-normal">Type Raw Orders</p>
              </div>
            </button>

            {/* Paste */}
            <button
              onClick={() => { setInputMode('paste'); setTimeout(() => textareaRef.current?.focus(), 50); }}
              className={`flex px-3 py-2 rounded-xl outline-[0.5px] outline-offset-[-0.5px] justify-start items-start gap-2 w-full transition-all ${
                inputMode === 'paste'
                  ? 'bg-blue-50 outline-blue-400'
                  : 'bg-neutral-50/70 outline-blue-400/50 hover:bg-neutral-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ paddingTop: 2 }}>
                <path d="M9.33268 7.52502V9.97502C9.33268 12.0167 8.51602 12.8334 6.47435 12.8334H4.02435C1.98268 12.8334 1.16602 12.0167 1.16602 9.97502V7.52502C1.16602 5.48335 1.98268 4.66669 4.02435 4.66669H6.47435C8.51602 4.66669 9.33268 5.48335 9.33268 7.52502Z"
                  fill="black" fillOpacity="0.6"/>
                <path d="M9.97438 1.16669H7.52437C5.89675 1.16669 5.0513 1.68942 4.77512 2.93237C4.65432 3.47602 5.12687 3.93752 5.68378 3.93752H6.47438C8.92438 3.93752 10.0619 5.07502 10.0619 7.52502V8.31562C10.0619 8.87253 10.5234 9.34507 11.067 9.22428C12.31 8.94809 12.8327 8.10265 12.8327 6.47502V4.02502C12.8327 1.98335 12.016 1.16669 9.97438 1.16669Z"
                  fill="black" fillOpacity="0.6"/>
              </svg>
              <div className="flex flex-col gap-1 items-start">
                <p className="text-black/70 text-sm font-semibold">Paste Raw Orders</p>
                <p className="text-black/40 text-xs font-normal">From WhatsApp etc</p>
              </div>
            </button>

            {/* Voice */}
            <button
              onClick={toggleRecording}
              className={`flex px-3 py-2 rounded-xl outline-[0.5px] outline-offset-[-0.5px] justify-start items-start gap-2 w-full transition-all ${
                isRecording
                  ? 'bg-red-50 outline-red-400'
                  : inputMode === 'voice'
                  ? 'bg-blue-50 outline-blue-400'
                  : 'bg-neutral-50/70 outline-blue-400/50 hover:bg-neutral-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ paddingTop: 2 }}>
                <path d="M6.99961 12.7925C4.05961 12.7925 1.66211 10.4008 1.66211 7.45501V6.35835C1.66211 6.13085 1.84878 5.95001 2.07044 5.95001C2.29211 5.95001 2.47878 6.13668 2.47878 6.35835V7.45501C2.47878 9.94585 4.50294 11.97 6.99378 11.97C9.48461 11.97 11.5088 9.94585 11.5088 7.45501V6.35835C11.5088 6.13085 11.6954 5.95001 11.9171 5.95001C12.1388 5.95001 12.3254 6.13668 12.3254 6.35835V7.45501C12.3371 10.4008 9.93961 12.7925 6.99961 12.7925Z"
                  fill="#FF8D28"/>
                <path d="M6.99974 1.16669C5.03974 1.16669 3.44141 2.76502 3.44141 4.72502V7.46085C3.44141 9.42085 5.03974 11.0192 6.99974 11.0192C8.95974 11.0192 10.5581 9.42085 10.5581 7.46085V4.72502C10.5581 2.76502 8.95974 1.16669 6.99974 1.16669Z"
                  fill="#FF8D28"/>
              </svg>
              <div className="flex flex-col gap-1 items-start">
                <p className={`text-sm font-semibold ${isRecording ? 'text-red-600' : 'text-black/70'}`}>
                  {isRecording ? 'Stop Recording' : 'Record a Voice Note'}
                </p>
                <p className="text-black/40 text-xs font-normal">Voice Note Of Orders</p>
              </div>
            </button>
          </main>

          {/* ── RECORDING INDICATOR ── */}
          {isRecording && (
            <div className="w-full flex items-center justify-between px-1">
              <RecordingIndicator amplitude={amplitude} />
              <span className="text-xs text-black/40">Tap "Stop Recording" or speak your orders clearly</span>
            </div>
          )}

          {/* ── INPUT AREA ── */}
          <div className={`w-full bg-white rounded-3xl border shadow-sm flex flex-col p-5 gap-4 transition-all ${
            parseError ? 'border-red-300' : 'border-black/6 focus-within:border-orange-200'
          }`}>
            <div className="relative min-h-32">
              <textarea
                ref={textareaRef}
                value={rawText}
                onChange={e => { setRawText(e.target.value); setParseError(''); }}
                placeholder={
                  inputMode === 'voice'
                    ? 'Your dictated orders will appear here…'
                    : inputMode === 'scratch'
                    ? 'Type each order:\nJohn Doe\n0551234567\nShawarma\nEvandy Annex\n\nJane Smith\n0209876543\nLoaded Fries\nBomso'
                    : 'Paste orders from WhatsApp, Telegram etc.\n\nEach order block:\nName\nPhone\nProduct\nLocation'
                }
                className="w-full min-h-32 bg-transparent outline-none placeholder:text-black/25 text-black/70 text-sm font-medium resize-none leading-relaxed"
              />

              {/* Interim speech transcript shown in grey */}
              {transcriptBuf && (
                <span className="text-black/30 text-sm italic">{transcriptBuf}</span>
              )}
            </div>

            {/* Character / order count pill */}
            {hasContent && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-black/30 bg-black/5 rounded-full px-2 py-0.5">
                  {combinedText.trim().split(/\n/).filter(Boolean).length} lines
                </span>
              </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {/* Clear */}
                {hasContent && (
                  <button
                    onClick={() => { setRawText(''); setTranscriptBuf(''); setParseError(''); }}
                    className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                    title="Clear"
                  >
                    <svg className="w-5 h-5 text-black/35" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {/* Mic toggle */}
                <button
                  onClick={toggleRecording}
                  className={`p-2 rounded-lg transition-colors ${isRecording ? 'bg-red-100' : 'hover:bg-black/5'}`}
                  title={isRecording ? 'Stop recording' : 'Start voice recording'}
                >
                  <svg className={`w-5 h-5 ${isRecording ? 'text-red-500' : 'text-black/40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!hasContent || isParsing}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-md font-medium text-sm transition-all active:scale-95 ${
                  hasContent && !isParsing
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-black/10 text-black/30 cursor-not-allowed'
                }`}
              >
                {isParsing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    <span>Parsing…</span>
                  </>
                ) : (
                  <>
                    <span>Send Orders</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {parseError && (
            <div className="w-full flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z"/>
              </svg>
              <p className="text-sm text-red-600">{parseError}</p>
            </div>
          )}

          {/* Hint */}
          <p className="text-center text-black/25 text-xs pb-4 leading-relaxed">
            Supports WhatsApp / Telegram order blocks · Reads name, phone, item & location automatically
          </p>

        </section>
      </section>
    </main>
  );
}

export default App;