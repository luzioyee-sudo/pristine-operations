// @ts-nocheck
import React from 'react';

interface BookLogoProps {
  className?: string;
  size?: number;
}

export const BookLogo: React.FC<BookLogoProps> = ({ className = "w-6 h-6", size }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Squircle Container */}
      <rect x="2" y="2" width="96" height="96" rx="28" fill="#F2F2F4" stroke="#E2E2E6" strokeWidth="2" />
      
      {/* Subtle Top Gloss Reflection */}
      <path d="M2 28C2 13.6 13.6 2 28 2H72C86.4 2 98 13.6 98 28V48C60 48 35 28 2 52V28Z" fill="white" fillOpacity="0.45" />
      
      {/* Mascot Silhouette Body */}
      <path d="M10 96C8 76 18 34 50 30C82 34 92 76 90 96H10Z" fill="#121215" />
      
      {/* Mascot Left Eye (Quotation Mark) */}
      <path d="M41 46H49V56C49 61 45 66 40 68L38 64C41 63 43 60 43 56H41V46Z" fill="white" />
      
      {/* Mascot Right Eye (Quotation Mark) */}
      <path d="M57 44H65V54C65 59 61 64 56 66L54 62C57 61 59 58 59 54H57V44Z" fill="white" />
    </svg>
  );
};
