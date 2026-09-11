import React from 'react';
import logoSrc from '../logo/logo.png';

interface UniversidadLatinoLogoProps {
  size?: number | string;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export const UniversidadLatinoLogo: React.FC<UniversidadLatinoLogoProps> = ({
  size = 64,
  className = '',
  alt = 'Universidad Latino',
  onClick,
}) => {
  const dimension = typeof size === 'number' ? size : parseInt(size as string) || 64;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ 
        width: dimension, 
        height: dimension, 
        cursor: onClick ? 'pointer' : 'default' 
      }}
      title={alt}
    >
      <img 
        src={logoSrc} 
        alt={alt}
        className="w-full h-full object-contain"
      />
    </div>
  );
};
