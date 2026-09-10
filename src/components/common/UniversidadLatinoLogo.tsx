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
  alt = 'Logotipo Oficial Universidad Latino - Unitus pro excellentia',
  onClick,
}) => {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <img
        src="/logo.png"
        alt={alt}
        className="w-full h-full object-contain drop-shadow-sm"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
