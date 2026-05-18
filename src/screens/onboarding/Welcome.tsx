import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import mainCover from '../../assets/Paste Anime/Section.svg'
import file1 from '../../assets/Paste Anime/Order 1.svg'
import mapBg from '../../assets/Map.png'
import riderIcon from '../../assets/Paste Anime/Rider.png'


/* ─── AUTH ICONS ─── */
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107" />
    <path d="M3.15332 7.3455L6.43882 9.755C7.32782 7.554 9.48082 6 12.0003 6C13.5298 6 14.9213 6.577 15.9808 7.5195L18.8093 4.691C17.0233 3.0265 14.6343 2 12.0003 2C8.15932 2 4.82832 4.1685 3.15332 7.3455Z" fill="#FF3D00" />
    <path d="M12.0002 22C14.5832 22 16.9302 21.0115 18.7047 19.404L15.6097 16.785C14.5721 17.5745 13.3039 18.0014 12.0002 18C9.39916 18 7.19066 16.3415 6.35866 14.027L3.09766 16.5395C4.75266 19.778 8.11366 22 12.0002 22Z" fill="#4CAF50" />
    <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2" />
  </svg>
);

const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.1001 19.16C19.6901 18.26 19.9101 17.8 20.3601 16.79C17.0401 15.53 16.5101 10.8 19.7901 8.98999C18.7901 7.72999 17.3801 7 16.0501 7C15.0901 7 14.4301 7.25001 13.8401 7.48001C13.3401 7.67001 12.8901 7.84 12.3301 7.84C11.7301 7.84 11.2001 7.65001 10.6401 7.45001C10.0301 7.23001 9.39006 7 8.59006 7C7.10006 7 5.51007 7.91 4.50007 9.47C3.08007 11.67 3.33007 15.79 5.62007 19.31C6.44007 20.57 7.54007 21.98 8.97007 22C9.57007 22.01 9.96007 21.83 10.3901 21.64C10.8801 21.42 11.4101 21.18 12.3401 21.18C13.2701 21.17 13.7901 21.42 14.2801 21.64C14.7001 21.83 15.0801 22.01 15.6701 22C17.1201 21.98 18.2801 20.42 19.1001 19.16Z" fill="black" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.8404 2C16.0004 3.1 15.5504 4.19001 14.9604 4.95001C14.3304 5.77001 13.2304 6.41 12.1704 6.37C11.9804 5.31 12.4704 4.21999 13.0704 3.48999C13.7404 2.68999 14.8704 2.07 15.8404 2Z" fill="black" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M21.3 12.23H17.82C16.84 12.23 15.97 12.77 15.53 13.65L14.69 15.31C14.49 15.71 14.09 15.96 13.65 15.96H10.37C10.06 15.96 9.62 15.89 9.33 15.31L8.49 13.66C8.05 12.79 7.17 12.24 6.2 12.24H2.7C2.31 12.24 2 12.55 2 12.94V16.2C2 19.83 4.18 22 7.82 22H16.2C19.63 22 21.74 20.12 22 16.78V12.93C22 12.55 21.69 12.23 21.3 12.23Z" fill="black" fill-opacity="0.6" />
    <path d="M12.75 2C12.75 1.59 12.41 1.25 12 1.25C11.59 1.25 11.25 1.59 11.25 2V4H12.75V2Z" fill="black" fill-opacity="0.6" />
    <path d="M22 9.81V10.85C21.78 10.77 21.54 10.73 21.3 10.73H17.82C16.27 10.73 14.88 11.59 14.19 12.97L13.44 14.45H10.58L9.83 12.98C9.14 11.59 7.75 10.73 6.2 10.73H2.7C2.46 10.73 2.22 10.77 2 10.85V9.81C2 6.17 4.17 4 7.81 4H11.25V7.19L10.53 6.47C10.24 6.18 9.76 6.18 9.47 6.47C9.18 6.76 9.18 7.24 9.47 7.53L11.47 9.53C11.48 9.54 11.49 9.54 11.49 9.55C11.56 9.61 11.63 9.66 11.71 9.69C11.81 9.73 11.9 9.75 12 9.75C12.1 9.75 12.19 9.73 12.28 9.69C12.37 9.66 12.46 9.6 12.53 9.53L14.53 7.53C14.82 7.24 14.82 6.76 14.53 6.47C14.24 6.18 13.76 6.18 13.47 6.47L12.75 7.19V4H16.19C19.83 4 22 6.17 22 9.81Z" fill="black" fill-opacity="0.6" />
  </svg>
);

type FolderPaperStyle = CSSProperties & { '--target-bottom': string };
type FeatureVariant = 'mobile' | 'desktop';
type FeatureType = 'upload' | 'paste' | 'enter' | 'assign' | 'track';
type Feature = {
  label: string;
  type: FeatureType;
  renderIcon: (variant: FeatureVariant) => ReactNode;
};

const folderPaperStyle = (
  targetBottom: string,
  transform: string,
  position: Pick<CSSProperties, 'left' | 'right'>,
  animationDelay: string
): FolderPaperStyle => ({
  '--target-bottom': targetBottom,
  transform,
  animationDelay,
  ...position,
});

/* ─── 1. UPLOAD SCREENSHOT ─── */
const FolderIcon = () => {
  return (
    <>
      <style>{`
        @keyframes folderRise {
          0%, 15% { bottom: -4px; opacity: 1; }
          25%, 75% { bottom: var(--target-bottom); opacity: 1; }
          85%, 100% { bottom: 0px; opacity: 1; }
        }
        @keyframes glowCycle {
          0%, 15% { opacity: 1; transform: scale(0.8); }
          25%, 75% { opacity: 1; transform: scale(1.1); }
          85%, 100% { opacity: 1; transform: scale(0.8); }
        }
        .paper-animate { animation: folderRise 8s ease-in-out infinite; }
        .glow-animate { animation: glowCycle 8s ease-in-out infinite; }
      `}</style>
      <div className="relative w-18 h-16 flex items-end justify-center overflow-hidden">
        <img src={mainCover} alt="Back" className="absolute bottom-0 w-full z-10" />
        <img src={file1} className="paper-animate absolute w-[70%] z-20" style={folderPaperStyle('1px', 'rotate(7.87deg)', { right: '6px' }, '0.4s')} />
        <img src={file1} className="paper-animate absolute w-[70%] z-30" style={folderPaperStyle('6px', 'rotate(7.87deg)', { left: '6px' }, '0.2s')} />
        <img src={file1} className="paper-animate absolute w-[70%] z-40 shadow-[0px_8px_16px_-4px_rgba(12,12,13,0.1)]" style={folderPaperStyle('8px', 'rotate(-8.47deg)', { left: '4px' }, '0s')} />
        <div className="absolute bottom-0 w-full h-[65%] z-50 backdrop-blur-[10px] border border-white/30 rounded-lg shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]"
          style={{
            clipPath: 'polygon(0% 15%, 35% 15%, 40% 0%, 60% 0%, 65% 15%, 100% 15%, 100% 100%, 0% 100%)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)'
          }}>
          <div className="absolute top-0 left-0 w-full h-px bg-white/40" />
        </div>
        <div className="glow-animate absolute top-[40%] w-[80%] h-[30%] z-45 bg-white/40 blur-xl rounded-full" />
      </div>
    </>
  );
};

/* ─── 2. PASTE ORDERS ─── */
/* ─── 2. PASTE ORDERS (Unified Interaction) ─── */
const PasteIcon = () => (
  <div style={{
    width: 140,
    height: 100,
    background: '#F8F9FB',
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
      animation: 'containerLift 4s ease-in-out infinite'
    }}>
      {['Jollof', 'Evandy Annex', 'Prince - 0559488203'].map((text, i) => (
        <div key={i} style={{
          position: 'relative',
          padding: '2px 6px',
          fontSize: 10,
          fontWeight: '500',
          color: '#333',
          textAlign: 'center'
        }}>
          {/* Animated Selection Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            height: '100%',
            background: 'rgba(0, 122, 255, 0.2)',
            borderRadius: 2,
            zIndex: 0,
            animation: `lineSelectStagger 4s ease ${i * 0.2}s infinite`
          }} />
          <span style={{ position: 'relative', zIndex: 1 }}>{text}</span>
        </div>
      ))}
    </div>

    {/* The Pop-up Menu (Now visible on Mobile) */}
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'white',
      border: '1px solid rgba(0,0,0,0.08)',
      borderRadius: 20,
      display: 'flex',
      padding: '2px 4px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      animation: 'menuSlideUp 4s ease-in-out infinite',
      zIndex: 20
    }}>
      <div className="flex items-center gap-1 px-2 py-1">
        <span style={{ fontSize: 9, display: 'flex', alignItems: 'center', gap: 2 }}>

          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4.66667 1.75H3.15C2.96615 1.75 2.7841 1.78621 2.61424 1.85657C2.44439 1.92693 2.29005 2.03005 2.16005 2.16005C2.03005 2.29005 1.92693 2.44439 1.85657 2.61424C1.78621 2.7841 1.75 2.96615 1.75 3.15V12.0167C1.75 12.388 1.8975 12.7441 2.16005 13.0066C2.29005 13.1366 2.44439 13.2397 2.61424 13.3101C2.7841 13.3805 2.96615 13.4167 3.15 13.4167H10.85C11.2213 13.4167 11.5774 13.2692 11.8399 13.0066C12.1025 12.7441 12.25 12.388 12.25 12.0167V3.15C12.25 2.7787 12.1025 2.4226 11.8399 2.16005C11.5774 1.8975 11.2213 1.75 10.85 1.75H9.33333V2.45C9.33333 2.57377 9.28417 2.69247 9.19665 2.77998C9.10913 2.8675 8.99043 2.91667 8.86667 2.91667H5.13333C5.00957 2.91667 4.89087 2.8675 4.80335 2.77998C4.71583 2.69247 4.66667 2.57377 4.66667 2.45V1.75Z" fill="black" fill-opacity="0.16" />
            <path d="M9.33333 1.74998H10.85C11.2213 1.74998 11.5774 1.89748 11.8399 2.16003C12.1025 2.42258 12.25 2.77868 12.25 3.14998V12.0166C12.25 12.3879 12.1025 12.744 11.8399 13.0066C11.5774 13.2691 11.2213 13.4166 10.85 13.4166H3.15C2.96615 13.4166 2.7841 13.3804 2.61424 13.3101C2.44439 13.2397 2.29005 13.1366 2.16005 13.0066C1.8975 12.744 1.75 12.3879 1.75 12.0166V3.14998C1.75 2.96613 1.78621 2.78408 1.85657 2.61422C1.92693 2.44437 2.03005 2.29003 2.16005 2.16003C2.4226 1.89748 2.7787 1.74998 3.15 1.74998H4.66667M5.13333 0.583313H8.86667C8.99043 0.583313 9.10913 0.63248 9.19665 0.719996C9.28417 0.807513 9.33333 0.926212 9.33333 1.04998V2.44998C9.33333 2.57375 9.28417 2.69245 9.19665 2.77996C9.10913 2.86748 8.99043 2.91665 8.86667 2.91665H5.13333C5.00957 2.91665 4.89087 2.86748 4.80335 2.77996C4.71583 2.69245 4.66667 2.57375 4.66667 2.44998V1.04998C4.66667 0.926212 4.71583 0.807513 4.80335 0.719996C4.89087 0.63248 5.00957 0.583313 5.13333 0.583313Z" stroke="black" stroke-opacity="0.6" stroke-width="0.875" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          Copy</span>
      </div>
      <div style={{ width: 1, background: '#EEE' }} />
      <div className="flex items-center gap-1 px-2 py-1" style={{ animation: 'pasteFocus 4s ease infinite' }}>
        <span style={{ fontSize: 9, display: 'flex', alignItems: 'center', gap: 2 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9.33366 7.52502V9.97502C9.33366 12.0167 8.51699 12.8334 6.47533 12.8334H4.02533C1.98366 12.8334 1.16699 12.0167 1.16699 9.97502V7.52502C1.16699 5.48335 1.98366 4.66669 4.02533 4.66669H6.47533C8.51699 4.66669 9.33366 5.48335 9.33366 7.52502Z" fill="black" fill-opacity="0.6" />
            <path d="M9.97535 1.16669H7.52535C5.89772 1.16669 5.05228 1.68942 4.7761 2.93237C4.6553 3.47602 5.12784 3.93752 5.68476 3.93752H6.47535C8.92535 3.93752 10.0629 5.07502 10.0629 7.52502V8.31562C10.0629 8.87253 10.5244 9.34507 11.068 9.22428C12.311 8.94809 12.8337 8.10265 12.8337 6.47502V4.02502C12.8337 1.98335 12.017 1.16669 9.97535 1.16669Z" fill="black" fill-opacity="0.6" />
          </svg>
          Paste</span>
      </div>
    </div>
  </div>
);

/* ─── 3. ENTER ORDERS ─── */
const EnterOrdersIcon = () => {
  const [nameTxt, setNameTxt] = useState('');
  const [phoneTxt, setPhoneTxt] = useState('');
  const [phase, setPhase] = useState('idle');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const run = () => {
    timers.current.forEach(clearTimeout);
    setNameTxt(''); setPhoneTxt(''); setPhase('idle');
    let t = 800;
    setTimeout(() => setPhase('typing-name'), t);
    for (let i = 1; i <= NAME_TEXT.length; i++) { t += 70; timers.current.push(setTimeout(() => setNameTxt(NAME_TEXT.slice(0, i)), t)); }
    t += 500;
    setTimeout(() => setPhase('typing-phone'), t);
    for (let i = 1; i <= PHONE_TEXT.length; i++) { t += 70; timers.current.push(setTimeout(() => setPhoneTxt(PHONE_TEXT.slice(0, i)), t)); }
    timers.current.push(setTimeout(run, t + 2000));
  };
  useEffect(() => { run(); return () => timers.current.forEach(clearTimeout); }, []);
  return (
    <div style={{ width: 130, background: 'linear-gradient(145deg, #F7E96A 0%, #F0DC52 100%)', borderRadius: 10, padding: '10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 8, fontWeight: 700, opacity: 0.6 }}>DETAILS</span>
      <div style={{ borderBottom: '1px dashed rgba(0,0,0,0.2)', minHeight: 12, fontSize: 10 }}>{nameTxt}{phase === 'typing-name' && "|"}</div>
      <div style={{ borderBottom: '1px dashed rgba(0,0,0,0.2)', minHeight: 12, fontSize: 10 }}>{phoneTxt}{phase === 'typing-phone' && "|"}</div>
    </div>
  );
};

/* ─── 4. ASSIGN RIDERS ─── */
const AssignRidersIcon = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive(p => (p + 1) % 3), 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="w-32.5 bg-white rounded-xl p-2.5 flex flex-col gap-2 border border-black/5 shadow-sm">
      {[0, 1, 2].map(i => (
        <div key={i} className={`flex items-center gap-2 transition-opacity duration-500 ${active === i ? 'opacity-100' : 'opacity-30'}`}>
          <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center">
            <div className={`w-1.5 h-1.5 rounded-full ${active === i ? 'bg-blue-500' : 'bg-gray-300'}`} />
          </div>
          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full bg-blue-400 transition-all duration-1000 ${active === i ? 'w-full' : 'w-0'}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── 5. TRACK ORDERS ─── */
const TrackOrdersIcon = () => (
  <div className="w-32.5 h-20 bg-blue-50 rounded-xl overflow-hidden relative border border-black/5">
    <img src={mapBg} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="map" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <img src={riderIcon} className="w-7 h-7 animate-bounce" alt="rider" />
      <div className="w-5 h-1 bg-black/10 rounded-full blur-[1px]" />
    </div>
  </div>
);

const NAME_TEXT = 'Marvin Abekah';
const PHONE_TEXT = '+233 - 054 123 456';

const FEATURES: Feature[] = [
  { label: 'Upload Screenshot Of Orders', type: 'upload', renderIcon: () => <FolderIcon /> },
  { label: 'Paste Orders', type: 'paste', renderIcon: () => <PasteIcon /> },
  { label: 'Enter Orders', type: 'enter', renderIcon: () => <EnterOrdersIcon /> },
  { label: 'Assign Orders To Riders', type: 'assign', renderIcon: () => <AssignRidersIcon /> },
  { label: 'Users Track Orders Anywhere', type: 'track', renderIcon: () => <TrackOrdersIcon /> },
];

const mobileFeatureBorders: Record<FeatureType, string> = {
  upload: 'border-[#F4E6DF]',
  paste: 'border-[#BBD9FF]',
  enter: 'border-[#F2E7A6]',
  assign: 'border-[#D9E5FF]',
  track: 'border-[#D6F0E4]',
};

/* ─── UNIFIED CAROUSEL COMPONENT ─── */
const FeatureCarousel = ({ variant }: { variant: FeatureVariant }) => {
  const isMobile = variant === 'mobile';

  return (
    <div className={`w-full overflow-hidden ${isMobile ? 'mt-8' : 'mt-4'}`}>
      <div className={`flex w-max gap-4 animate-[carouselScroll_35s_linear_infinite] hover:[animation-play-state:paused]`}>
        {[...FEATURES, ...FEATURES, ...FEATURES].map((feature, i) => (
          <div
            key={`${feature.type}-${i}`}
            className={`flex shrink-0 flex-col items-center justify-center border bg-neutral-50 shadow-sm transition-all
              ${isMobile
                ? `h-36 w-40 rounded-3xl p-3 ${mobileFeatureBorders[feature.type]}`
                : 'h-40 w-48 rounded-2xl border-blue-100 p-4'
              }`}
          >
            <div className="flex flex-1 items-center justify-center">
              {feature.renderIcon(variant)}
            </div>
            <span className={`text-center font-medium text-black/80 ${isMobile ? 'text-[13px] leading-tight mt-1' : 'text-sm mt-3'}`}>
              {feature.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── AUTH COMPONENTS ─── */
type AuthButtonProps = {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
};

const AuthButton = ({ icon, label, onClick }: AuthButtonProps) => (
  <button onClick={onClick} className="w-full h-12 px-4 bg-neutral-50/50 rounded-3xl border border-black/10 flex items-center gap-3 active:scale-[0.98] transition-all">
    <span className="w-6 flex justify-center text-black/60">{icon}</span>
    <span className="flex-1 text-center text-sm font-semibold text-black/80">{label}</span>
  </button>
);

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @keyframes carouselScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
        @keyframes containerLift { 0%, 10% { transform: translateY(0); } 25%, 85% { transform: translateY(-10px); } 95%, 100% { transform: translateY(0); } }
        @keyframes lineSelectStagger { 0% { width: 0%; left: 50%; opacity: 0; } 25%, 80% { width: 104%; left: -2%; opacity: 1; } 90%, 100% { width: 104%; left: -2%; opacity: 0; } }
        @keyframes menuSlideUp { 0%, 20% { opacity: 0; transform: translate(-50%, 8px); } 35%, 80% { opacity: 1; transform: translate(-50%, 0); } 90%, 100% { opacity: 0; transform: translate(-50%, 8px); } }
        @keyframes pasteFocus { 0%, 50% { background: transparent; } 60%, 80% { background: rgba(0,0,0,0.04); } 100% { background: transparent; } }
      `}</style>

      {/* MOBILE LAYOUT */}
      <div className="flex min-h-screen flex-col bg-[#fdfdfd] sm:hidden overflow-hidden">
        <div className="flex flex-col items-center pt-14 mb-4">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          <div className="mt-8 px-8 text-center">
            <p className="text-xl font-medium text-black/40">Welcome To</p>
            <h1 className="text-4xl font-bold text-black mt-1">Vendor Pro</h1>
          </div>
        </div>

        <FeatureCarousel variant="mobile" />

        <div className="mt-auto p-3 pb-[-4]">
          <div className="bg-white rounded-4xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-black/5 flex flex-col gap-6">
            <h2 className="text-center text-xl font-semibold px-2">Turn Messages into <br /><span className="text-black/50">Ready-to-Dispatch Orders</span></h2>
            <div className="flex flex-col gap-2">
              <AuthButton icon={<GoogleIcon />} label="Continue with Google" />
              <AuthButton icon={<AppleIcon />} label="Continue with Apple" />
              <AuthButton icon={<EmailIcon />} label="Get Started With Email" onClick={() => navigate('/setup')} />
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden sm:flex flex-col items-center justify-center min-h-screen bg-[#fdfdfd] p-6">
        <div className="w-full max-w-125 bg-white rounded-[40px] shadow-2xl p-10 flex flex-col items-center gap-8 border border-black/5">
          <img src="/logo.png" alt="Logo" className="w-10 h-auto" />
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome To Vendor Pro</h1>
            <p className="text-black/40 mt-1 text-lg">Let's get you started</p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <AuthButton icon={<GoogleIcon />} label="Continue with Google" />
            <AuthButton icon={<AppleIcon />} label="Continue with Apple" />
            <AuthButton icon={<EmailIcon />} label="Get Started With Email" onClick={() => navigate('/setup')} />
          </div>
          <FeatureCarousel variant="desktop" />
        </div>
      </div>
    </>
  );
};

export default Welcome;