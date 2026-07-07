interface MonteLogoProps {
  width?: number;
  className?: string;
}

// The MONTÉ crest: stylized mountain range inside an oval, with the ® mark
// below. Cream/off-white line work (#F5F0E8) per the design.
export function MonteLogo({ width = 220, className }: MonteLogoProps) {
  const stroke = "#F5F0E8";
  return (
    <svg
      width={width}
      height={width * 0.62}
      viewBox="0 0 220 136"
      fill="none"
      className={className}
      role="img"
      aria-label="MONTÉ crest"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Oval border */}
      <ellipse
        cx="110"
        cy="58"
        rx="106"
        ry="54"
        stroke={stroke}
        strokeWidth="1.5"
      />
      {/* Mountain range — layered peaks */}
      <g stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        {/* back range (thin) */}
        <path
          d="M40 78 L70 50 L92 66 L118 38 L150 70 L180 78"
          strokeWidth="1.25"
          opacity="0.7"
        />
        {/* main peak */}
        <path d="M46 80 L86 44 L104 60 L132 30 L158 58 L176 80" fill="none" />
        {/* snow-cap accent lines on the tallest peak */}
        <path d="M126 36 L132 30 L139 37" strokeWidth="1.25" opacity="0.85" />
        {/* base line */}
        <path d="M44 80 L176 80" strokeWidth="1" opacity="0.5" />
      </g>
      {/* ® mark below the oval */}
      <g transform="translate(110 126)">
        <circle r="7" stroke={stroke} strokeWidth="1" fill="none" />
        <text
          x="0"
          y="3.4"
          textAnchor="middle"
          fontSize="8"
          fontFamily="Georgia, serif"
          fill={stroke}
        >
          R
        </text>
      </g>
    </svg>
  );
}
