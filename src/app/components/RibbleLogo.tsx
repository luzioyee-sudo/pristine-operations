// @ts-nocheck
import React from 'react';

interface RibbleLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'signature' | 'mint' | 'lavender' | 'minimal' | 'monochrome' | 'reverse';
  animated?: boolean;
}

export const RibbleLogo: React.FC<RibbleLogoProps> = ({
  className = '',
  showWordmark = true,
  size = 'md',
  variant = 'signature',
  animated = false,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const dimensions = {
    sm: { width: 20, height: 36, textSize: 'text-sm' },
    md: { width: 28, height: 51, textSize: 'text-base' },
    lg: { width: 42, height: 77, textSize: 'text-2xl' },
    xl: { width: 72, height: 132, textSize: 'text-4xl' },
  }[size];

  let faceA = '#A4F5A6';
  let faceB = '#B2A1FF';
  let faceLeft = '#EFF1EE';
  let faceRight = '#222222';
  let edge = '#222222';

  if (variant === 'mint') {
    faceA = '#A4F5A6';
    faceB = '#A4F5A6';
  } else if (variant === 'lavender') {
    faceA = '#B2A1FF';
    faceB = '#B2A1FF';
  } else if (variant === 'minimal') {
    faceA = '#EFF1EE';
    faceB = '#EFF1EE';
  } else if (variant === 'monochrome') {
    faceA = '#222222';
    faceB = '#222222';
  } else if (variant === 'reverse') {
    edge = '#EFF1EE';
  }

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      <svg
        key={isHovered ? 'hover' : 'idle'}
        viewBox="-48 -4 140 258"
        width={dimensions.width}
        height={dimensions.height}
        role="img"
        aria-label="Ribble mark"
        className={(animated || isHovered) ? 'ribble-anim' : ''}
        style={{
          ['--face-a' as any]: faceA,
          ['--face-b' as any]: faceB,
          ['--face-left' as any]: faceLeft,
          ['--face-right' as any]: faceRight,
          ['--edge' as any]: edge,
          ['--dur' as any]: '1.5s',
        }}
        strokeLinejoin="round"
      >
        <g 
          className={(animated || isHovered) ? 'ribble-block' : ''} 
          style={{ 
            ['--i' as any]: 0,
            ['--dur' as any]: '1.5s',
          }}
        >
          <polygon points="-43.3,175 0,200 0,250 -43.3,225" fill="var(--face-left)" />
          <polygon points="43.3,175 0,200 0,250 43.3,225" fill="var(--face-right)" />
          <polygon points="0,150 43.3,175 0,200 -43.3,175" fill="var(--face-a)" />
          <polygon points="-43.3,175 0,200 0,250 -43.3,225" fill="none" stroke="var(--edge)" strokeWidth="3" />
          <polygon points="43.3,175 0,200 0,250 43.3,225" fill="none" stroke="var(--edge)" strokeWidth="3" />
          <polygon points="0,150 43.3,175 0,200 -43.3,175" fill="none" stroke="var(--edge)" strokeWidth="3" />
        </g>
        <g 
          className={(animated || isHovered) ? 'ribble-block' : ''} 
          style={{ 
            ['--i' as any]: 1,
            ['--dur' as any]: '1.5s',
          }}
        >
          <polygon points="0,100 43.3,125 43.3,175 0,150" fill="var(--face-left)" />
          <polygon points="86.6,100 43.3,125 43.3,175 86.6,150" fill="var(--face-right)" />
          <polygon points="43.3,75 86.6,100 43.3,125 0,100" fill="var(--face-b)" />
          <polygon points="0,100 43.3,125 43.3,175 0,150" fill="none" stroke="var(--edge)" strokeWidth="3" />
          <polygon points="86.6,100 43.3,125 43.3,175 86.6,150" fill="none" stroke="var(--edge)" strokeWidth="3" />
          <polygon points="43.3,75 86.6,100 43.3,125 0,100" fill="none" stroke="var(--edge)" strokeWidth="3" />
        </g>
        <g 
          className={(animated || isHovered) ? 'ribble-block' : ''} 
          style={{ 
            ['--i' as any]: 2,
            ['--dur' as any]: '1.5s',
          }}
        >
          <polygon points="-43.3,25 0,50 0,100 -43.3,75" fill="var(--face-left)" />
          <polygon points="43.3,25 0,50 0,100 43.3,75" fill="var(--face-right)" />
          <polygon points="0,0 43.3,25 0,50 -43.3,25" fill="var(--face-a)" />
          <polygon points="-43.3,25 0,50 0,100 -43.3,75" fill="none" stroke="var(--edge)" strokeWidth="3" />
          <polygon points="43.3,25 0,50 0,100 43.3,75" fill="none" stroke="var(--edge)" strokeWidth="3" />
          <polygon points="0,0 43.3,25 0,50 -43.3,25" fill="none" stroke="var(--edge)" strokeWidth="3" />
        </g>
      </svg>

      {showWordmark && (
        <span className={`ribble-wordmark text-[#222222] ${dimensions.textSize} tracking-tight font-black`}>
          R<span className="relative">i<span className="ribble-dot" aria-hidden="true" /></span>bble
        </span>
      )}
    </div>
  );
};
