import { useNavigate } from 'react-router-dom';
import mainCover from '../../assets/Paste Anime/Section.svg'
import cover from '../../assets/Paste Anime/COVER.svg'
import file1 from '../../assets/Paste Anime/Order 1.svg'


/* ─── Animated: Folder / Upload card icon ─── */
const FolderIcon = () => {
  // Common styles for the papers to keep code clean
  const paperStyle = "absolute w-[70%] transition-all duration-500 ease-in-out";

  return (
    
    <div className="relative w-[72px] h-[64px] flex items-end justify-center group">
      
      {/* 1. BACK FOLDER (The solid base) */}
      <img 
        src={mainCover} 
        alt="Back" 
        className="absolute bottom-0 w-full z-10" 
      />

      {/* 2. THE PAPERS (Positioned inside the sandwich) */}
      {/* Paper 3 (Back-most) */}
      <img 
        src={file1} 
        className={`${paperStyle} bottom-0 left-[10%] z-20 rotate-6 opacity-1 group-hover:opacity-100 group-hover:-translate-y-2 delay-100`}
        // style={{ animation: 'paperPop 3.6s ease infinite' }}
      />
      
      {/* Paper 2 (Middle) */}
      <img 
        src={file1} 
        className={`${paperStyle} bottom-0 left-[25%] z-30 -rotate-3 opacity- group-hover:opacity-100 group-hover:-translate-y-3 delay-75`}
        // style={{ animation: 'paperPop 3.6s ease 0.2s infinite' }}
      />

      {/* Paper 1 (Front-most) */}
      <img 
        src={file1} 
        alt="File 1" 
        className={`${paperStyle} bottom-[-2] left-[30%] z-40 opacity-0 group-hover:opacity-100 group-hover:-translate-y-4`}
        // style={{ animation: 'paperPop 3.6s ease 0.4s infinite' }}
      />

      {/* 3. CUSTOM GLASS COVER (The dynamic replacement for COVER.svg) */}
      <div 
        className="absolute bottom-0 w-full h-[65%] z-50 
                   bg-white/30 backdrop-blur-[6px] 
                   border border-white/40 rounded-lg
                   shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
        style={{
          // This clip-path mimics the folder "tab" cut-out at the top
          clipPath: 'polygon(0% 15%, 35% 15%, 40% 0%, 60% 0%, 65% 15%, 100% 15%, 100% 100%, 0% 100%)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)'
        }}
      >
        {/* Inner Glow/Reflection line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/50" />
      </div>

      {/* 4. MOUTH GLOW (The light coming from inside) */}
      <div className="absolute top-[30%] w-[80%] h-[30%] z-[45] 
                      bg-white/40 blur-xl rounded-full animate-pulse" />
    </div>
  );
};

/* ─── Animated: Paste orders card icon ─── */
const PasteIcon = () => (
  <div style={{
    width: '100%', maxWidth: 148,
    background: 'white',
    border: '1px solid rgba(0,0,0,0.09)',
    borderRadius: 9,
    padding: '7px 9px',
    display: 'flex', flexDirection: 'column', gap: 3,
    position: 'relative',
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
  }}>
    {/* Context menu */}
    <div style={{
      position: 'absolute', top: -24, right: -2,
      background: 'white',
      border: '1px solid rgba(0,0,0,0.12)',
      borderRadius: 6,
      display: 'flex', gap: 1, padding: '3px 7px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      fontSize: 10, color: 'rgba(0,0,0,0.6)',
      animation: 'menuPop 3.6s ease infinite',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
    }}>
      <span>Copy</span>
      <span style={{ color: 'rgba(0,0,0,0.2)', padding: '0 2px' }}>|</span>
      <span>Paste</span>
    </div>

    {['Jollof', 'Evandy Annex', 'Prince - 0559488203'].map((text, i) => (
      <div key={i} style={{
        height: 14, borderRadius: 2,
        display: 'flex', alignItems: 'center',
        padding: '0 2px',
        fontSize: 10.5,
        color: 'rgba(0,0,0,0.72)',
        fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(120,160,255,0.35)',
          borderRadius: 2,
          transformOrigin: 'left',
          animation: `selectLine 3.6s ease ${i * 0.15}s infinite`,
        }} />
        <span style={{ position: 'relative', zIndex: 1, whiteSpace: 'nowrap' }}>{text}</span>
      </div>
    ))}

    {/* Cursor dot */}
    <div style={{
      position: 'absolute', top: 9, left: 11,
      width: 1.5, height: 11,
      background: '#3b82f6', borderRadius: 1,
      animation: 'cursorBlink 1s step-end infinite',
    }} />
  </div>
);

/* ─── Infinite carousel (desktop only) ─── */
const FEATURES = [
  { label: 'Upload Screenshot Of Orders', type: 'upload' },
  { label: 'Paste Orders', type: 'paste' },
  { label: 'Enter Orders', emoji: '✏️' },
  { label: 'Assign Orders To Riders', emoji: '🏍' },
  { label: 'Users Track Orders Anywhere', emoji: '📍' },
];

const InfiniteCarousel = () => {
  const items = [...FEATURES, ...FEATURES];
  return (
    <div className="w-full overflow-hidden mt-4 hidden sm:block">
      {/* <div className="flex gap-4 w-max animate-[carouselScroll_35s_linear_infinite] hover:[animation-play-state:paused]"> */}
      <div className="flex gap-4 w-max  hover:[animation-play-state:paused]">
        {items.map((f, i) => (
          <div key={i} className="w-44 h-36  flex-shrink-0 bg-neutral-50 rounded-2xl border border-blue-400/50 flex flex-col items-center justify-center gap-2 p-4">
            {f.type === 'upload' ? <FolderIcon /> : f.type === 'paste' ? <PasteIcon /> : <span className="text-2xl">{f.emoji}</span>}
            <span className="text-center text-black/75 text-xs font-medium font-['SF_Pro_Text'] leading-tight">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Auth buttons ─── */
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107" />
    <path d="M3.15332 7.3455L6.43882 9.755C7.32782 7.554 9.48082 6 12.0003 6C13.5298 6 14.9213 6.577 15.9808 7.5195L18.8093 4.691C17.0233 3.0265 14.6343 2 12.0003 2C8.15932 2 4.82832 4.1685 3.15332 7.3455Z" fill="#FF3D00" />
    <path d="M12.0002 22.0001C14.5832 22.0001 16.9302 21.0116 18.7047 19.4041L15.6097 16.7851C14.5721 17.5746 13.3039 18.0015 12.0002 18.0001C9.39916 18.0001 7.19066 16.3416 6.35866 14.0271L3.09766 16.5396C4.75266 19.7781 8.11366 22.0001 12.0002 22.0001Z" fill="#4CAF50" />
    <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2" />
  </svg>
);

const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M19.1001 19.16C19.6901 18.26 19.9101 17.8 20.3601 16.79C17.0401 15.53 16.5101 10.8 19.7901 8.98999C18.7901 7.72999 17.3801 7 16.0501 7C15.0901 7 14.4301 7.25001 13.8401 7.48001C13.3401 7.67001 12.8901 7.84 12.3301 7.84C11.7301 7.84 11.2001 7.65001 10.6401 7.45001C10.0301 7.23001 9.39006 7 8.59006 7C7.10006 7 5.51007 7.91 4.50007 9.47C3.08007 11.67 3.33007 15.79 5.62007 19.31C6.44007 20.57 7.54007 21.98 8.97007 22C9.57007 22.01 9.96007 21.83 10.3901 21.64C10.8801 21.42 11.4101 21.18 12.3401 21.18C13.2701 21.17 13.7901 21.42 14.2801 21.64C14.7001 21.83 15.0801 22.01 15.6701 22C17.1201 21.98 18.2801 20.42 19.1001 19.16Z" fill="black" />
    <path fillRule="evenodd" clipRule="evenodd" d="M15.8404 2C16.0004 3.1 15.5504 4.19001 14.9604 4.95001C14.3304 5.77001 13.2304 6.41 12.1704 6.37C11.9804 5.31 12.4704 4.21999 13.0704 3.48999C13.7404 2.68999 14.8704 2.07 15.8404 2Z" fill="black" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M21.3 12.23H17.82C16.84 12.23 15.97 12.77 15.53 13.65L14.69 15.31C14.49 15.71 14.09 15.96 13.65 15.96H10.37C10.06 15.96 9.62 15.89 9.33 15.31L8.49 13.66C8.05 12.79 7.17 12.24 6.2 12.24H2.7C2.31 12.24 2 12.55 2 12.94V16.2C2 19.83 4.18 22 7.82 22H16.2C19.63 22 21.74 20.12 22 16.78V12.93C22 12.55 21.69 12.23 21.3 12.23Z" fill="black" fillOpacity="0.6" />
    <path d="M12.75 2C12.75 1.59 12.41 1.25 12 1.25C11.59 1.25 11.25 1.59 11.25 2V4H12.75V2Z" fill="black" fillOpacity="0.6" />
    <path d="M22 9.81V10.85C21.78 10.77 21.54 10.73 21.3 10.73H17.82C16.27 10.73 14.88 11.59 14.19 12.97L13.44 14.45H10.58L9.83 12.98C9.14 11.59 7.75 10.73 6.2 10.73H2.7C2.46 10.73 2.22 10.77 2 10.85V9.81C2 6.17 4.17 4 7.81 4H11.25V7.19L10.53 6.47C10.24 6.18 9.76 6.18 9.47 6.47C9.18 6.76 9.18 7.24 9.47 7.53L11.47 9.53C11.56 9.61 11.63 9.66 11.71 9.69C11.81 9.73 11.9 9.75 12 9.75C12.1 9.75 12.19 9.73 12.28 9.69C12.37 9.66 12.46 9.6 12.53 9.53L14.53 7.53C14.82 7.24 14.82 6.76 14.53 6.47C14.24 6.18 13.76 6.18 13.47 6.47L12.75 7.19V4H16.19C19.83 4 22 6.17 22 9.81Z" fill="black" fillOpacity="0.6" />
  </svg>
);

const AuthButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full h-11 px-4 bg-neutral-50/30 rounded-3xl outline outline-1 outline-offset-[-1px] outline-black/10 flex items-center gap-3 cursor-pointer hover:bg-neutral-100/60 active:scale-[0.98] transition-all"
  >
    <span className="w-6 flex-shrink-0 flex items-center justify-center">{icon}</span>
    <span className="flex-1 text-center text-black/80 text-sm font-semibold font-['SF_Pro_Text']">{label}</span>
  </button>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const Welcome = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes lidOpen {
          0%,30%   { transform: rotateX(0deg); }
          50%,70%  { transform: rotateX(-40deg); }
          90%,100% { transform: rotateX(0deg); }
        }
        @keyframes paperPop {
          0%,30%  { transform: translateY(0); opacity: 0; }
          45%,65% { transform: translateY(-11px); opacity: 1; }
          85%,100%{ transform: translateY(0); opacity: 0; }
        }
        @keyframes glowPulse {
          0%,30%  { opacity: 0; }
          50%     { opacity: 1; }
          80%,100%{ opacity: 0; }
        }
        @keyframes selectLine {
          0%,20%   { transform: scaleX(0); }
          40%,65%  { transform: scaleX(1); }
          80%,100% { transform: scaleX(0); }
        }
        @keyframes menuPop {
          0%,35%  { opacity: 0; transform: translateY(4px) scale(0.92); }
          50%,70% { opacity: 1; transform: translateY(0) scale(1); }
          85%,100%{ opacity: 0; transform: translateY(4px) scale(0.92); }
        }
        @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes carouselScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* ════ MOBILE LAYOUT (< sm) ════ */}
      <div className="flex flex-col min-h-screen bg-[#f5f5f5] sm:hidden">

        {/* Logo */}
        <div className="flex justify-center pt-16 pb-4">
          <img src="/logo.png" alt="Vendor Pro" className="w-9 h-14" />
        </div>

        {/* Headline */}
        <div className="px-8 pb-6 text-center">
          <p className="text-black/45 text-lg font-normal font-['SF_Pro_Text']">Welcome To</p>
          <h1 className="text-black text-4xl font-bold font-['SF_Pro_Text'] leading-tight tracking-tight mt-0.5">
            Vendor Pro
          </h1>
        </div>

        {/* 2-card feature grid */}
        <div className="px-5 grid grid-cols-2 gap-3 mb-5">
          {/* Upload card */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 flex flex-col items-center justify-center gap-3 p-4 h-36 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <FolderIcon />
            <span className="text-center text-black/75 text-xs font-medium font-['SF_Pro_Text'] leading-tight">
              Upload Screenshot<br />Of Orders
            </span>
          </div>

          {/* Paste card */}
          <div className="bg-white rounded-2xl border border-blue-300/60 flex flex-col items-center justify-center gap-3 p-4 h-36 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <PasteIcon />
            <span className="text-center text-black/75 text-xs font-medium font-['SF_Pro_Text'] leading-tight">
              Paste Orders
            </span>
          </div>
        </div>

        {/* CTA card */}
        <div className="mx-5 bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.07)] p-6 flex flex-col gap-5">
          <h2 className="text-center text-black text-xl font-bold font-['SF_Pro_Text'] leading-snug">
            Turn Customer Messages into<br />Ready-to-Dispatch Orders
          </h2>

          <div className="flex flex-col gap-2">
            <AuthButton icon={<GoogleIcon />} label="Continue with Google" />
            <AuthButton icon={<AppleIcon />} label="Continue with Apple" />
            <AuthButton
              icon={<EmailIcon />}
              label="Get Started With Email"
              onClick={() => navigate('/setup')}
            />
          </div>
        </div>

        {/* Home indicator space */}
        <div className="h-8" />
      </div>

      {/* ════ DESKTOP LAYOUT (≥ sm) ════ */}
      <div
        className="hidden sm:flex flex-col items-center justify-center min-h-screen bg-[#fafafa] px-4 py-8"
      >
        <div className="w-full max-w-[480px] bg-white rounded-[32px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.10)] p-8 flex flex-col items-center gap-7">

          {/* Logo */}
          <img src="/logo.png" alt="Vendor Pro" className="w-9 h-14" />

          {/* Headline */}
          <section className="flex flex-col gap-2 items-center text-center">
            <p className="text-black text-3xl font-medium font-['SF_Pro_Text']">Welcome To Vendor Pro</p>
            <p className="text-black/50 text-base font-normal">Let Get You Started</p>
          </section>

          {/* Auth buttons */}
          <section className="flex flex-col gap-2 w-full">
            <AuthButton icon={<GoogleIcon />} label="Continue with Google" />
            <AuthButton icon={<AppleIcon />} label="Continue with Apple" />
            <AuthButton
              icon={<EmailIcon />}
              label="Get Started With Email"
              onClick={() => navigate('/setup')}
            />
          </section>

          {/* Infinite carousel */}
          <InfiniteCarousel />
        </div>
      </div>
    </>
  );
};

export default Welcome;


