// src/components/FolderCover.tsx

const FolderCover = ({
  className = '',
}: {
  className?: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 79 42"
      fill="none"
      className={className}
    >
      {/* Background blur layer */}
      <foreignObject x="-39.5892" y="-40.0843" width="158.178" height="122.169">
        <div
          style={{
            backdropFilter: 'blur(20.04px)',
            WebkitBackdropFilter: 'blur(20.04px)',
            clipPath: 'url(#bgblur_0_30517_10243_clip_path)',
            width: '100%',
            height: '100%',
          }}
        />
      </foreignObject>

      {/* Main folder shape */}
      <g
        filter="url(#filter0_in_30517_10243)"
        data-figma-bg-blur-radius="40.0843"
      >
        <path
          d="M0.514466 6.47522C0.237176 2.98517 2.99457 0 6.49562 0L25.2214 0C26.3236 0 27.4045 0.303607 28.3455 0.877507L28.942 1.24128C29.8813 1.81415 30.96 2.11771 32.0602 2.11879L39.5174 2.12607L46.8779 2.12037C48.0156 2.11949 49.1296 1.79518 50.09 1.18524L50.4838 0.935136C51.4455 0.324355 52.5612 0 53.7005 0H72.5044C76.0054 0 78.7628 2.98516 78.4855 6.47521L76.102 36.4752C75.8541 39.5948 73.2503 42 70.1208 42H8.87916C5.74974 42 3.14587 39.5948 2.89801 36.4752L0.514466 6.47522Z"
          fill="url(#paint0_linear_30517_10243)"
          fillOpacity="0.3"
        />
      </g>

      <defs>
        <filter
          id="filter0_in_30517_10243"
          x="-39.5892"
          y="-40.0843"
          width="158.178"
          height="122.169"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.801687" />
          <feGaussianBlur stdDeviation="1.60337" />
          <feComposite
            in2="hardAlpha"
            operator="arithmetic"
            k2="-1"
            k3="1"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_30517_10243"
          />

          <feTurbulence
            type="fractalNoise"
            baseFrequency="2.49474 2.49474"
            stitchTiles="stitch"
            numOctaves="3"
            result="noise"
            seed="4517"
          />
          <feColorMatrix
            in="noise"
            type="luminanceToAlpha"
            result="alphaNoise"
          />
          <feComponentTransfer
            in="alphaNoise"
            result="coloredNoise1"
          >
            <feFuncA
              type="discrete"
              tableValues="0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
            />
          </feComponentTransfer>
          <feComposite
            operator="in"
            in2="effect1_innerShadow_30517_10243"
            in="coloredNoise1"
            result="noise1Clipped"
          />
          <feFlood
            floodColor="rgba(116, 116, 116, 0.1)"
            result="color1Flood"
          />
          <feComposite
            operator="in"
            in2="noise1Clipped"
            in="color1Flood"
            result="color1"
          />
          <feMerge result="effect2_noise_30517_10243">
            <feMergeNode in="effect1_innerShadow_30517_10243" />
            <feMergeNode in="color1" />
          </feMerge>
        </filter>

        <clipPath
          id="bgblur_0_30517_10243_clip_path"
          transform="translate(39.5892 40.0843)"
        >
          <path d="M0.514466 6.47522C0.237176 2.98517 2.99457 0 6.49562 0L25.2214 0C26.3236 0 27.4045 0.303607 28.3455 0.877507L28.942 1.24128C29.8813 1.81415 30.96 2.11771 32.0602 2.11879L39.5174 2.12607L46.8779 2.12037C48.0156 2.11949 49.1296 1.79518 50.09 1.18524L50.4838 0.935136C51.4455 0.324355 52.5612 0 53.7005 0H72.5044C76.0054 0 78.7628 2.98516 78.4855 6.47521L76.102 36.4752C75.8541 39.5948 73.2503 42 70.1208 42H8.87916C5.74974 42 3.14587 39.5948 2.89801 36.4752L0.514466 6.47522Z" />
        </clipPath>

        <linearGradient
          id="paint0_linear_30517_10243"
          x1="39.5"
          y1="-6.05971"
          x2="39.5"
          y2="48.8955"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="black" />
          <stop offset="0.658352" stopColor="#ED4C5C" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default FolderCover;