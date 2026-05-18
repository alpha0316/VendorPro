import { useState } from 'react';

interface DynamicLogoProps {
  onClick: () => void;
}

const DynamicLogo = ({ onClick }: DynamicLogoProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center cursor-pointer group select-none"
    >
      {isHovered ? (
        <span className="flex items-center gap-1 text-black/60 text-base sm:text-lg font-bold transition-all duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </span>
      ) : (
        <>
          <img
            src="/logo.png"
            alt="Logo"
            className="h-4 sm:h-5 w-2.5 sm:w-3"
          />
          <span className="text-red-600 text-base sm:text-lg font-bold">B</span>
          <span className="text-black/50 text-base sm:text-lg font-bold">ites.</span>
        </>
      )}
    </div>
  );
};

export default DynamicLogo;
