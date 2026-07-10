import React from 'react';

export function BploLogo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="20" cy="20" r="20" fill="url(#grad)" />
      <path
        d="M12 12h4.5v16H12V12zm5.5 0H22v5.2h-4.5V12zm0 6.4H22v5.2h-4.5v-5.2z"
        fill="white"
      />
      <path
        d="M24 12h4.5v16H24V12z"
        fill="white"
        opacity="0.7"
      />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#1a0533" />
          <stop offset="50%" stopColor="#581c87" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  );
}
