import React from 'react';

interface UniversidadLatinoLogoProps {
  size?: number | string;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export const UniversidadLatinoLogo: React.FC<UniversidadLatinoLogoProps> = ({
  size = 64,
  className = '',
  onClick,
}) => {
  const dimension = typeof size === 'number' ? size : parseInt(size as string) || 64;
  
  // Calculate proportional sizes
  const iconSize = Math.floor(dimension * 0.5);
  const badgeSize = Math.floor(dimension * 0.35);
  const badgeIconSize = Math.floor(badgeSize * 0.7);
  const borderRadius = Math.max(8, Math.floor(dimension * 0.25));

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 select-none bg-[#0A0A5C] border border-[#FADE0A] shadow-md ${className}`}
      style={{ 
        width: dimension, 
        height: dimension, 
        borderRadius: borderRadius,
        cursor: onClick ? 'pointer' : 'default' 
      }}
      title="Universidad Latino"
    >
      <span 
        className="material-symbols-outlined text-[#FADE0A]" 
        style={{ fontSize: iconSize }}
      >
        school
      </span>
      
      {/* Yellow plus badge at bottom right */}
      <div 
        className="absolute flex items-center justify-center bg-[#FADE0A] rounded-full border-[1.5px] border-[#0A0A5C]"
        style={{ 
          width: badgeSize, 
          height: badgeSize, 
          bottom: -Math.floor(badgeSize * 0.15), 
          right: -Math.floor(badgeSize * 0.15) 
        }}
      >
        <span 
          className="material-symbols-outlined text-[#0A0A5C]"
          style={{ fontSize: badgeIconSize, fontWeight: 'bold' }}
        >
          add
        </span>
      </div>
    </div>
  );
};
