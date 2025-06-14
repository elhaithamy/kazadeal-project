
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const fontSize: Record<string, string> = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl'
};

const iconSize: Record<string, string> = {
  sm: 'text-3xl',
  md: 'text-5xl',
  lg: 'text-6xl'
};

// A playful basket-emoji logo for Gen-Z vibe
const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  return (
    <div className="flex items-center gap-2 font-spacegrotesk select-none">
      <span 
        className={`${iconSize[size]} drop-shadow-md bg-gradient-to-br from-app-green to-app-highlight rounded-full px-2 py-1 animate-bounce`}
        aria-label="KazaDeal Logo"
      >🧺</span>
      {showText && (
        <span className={`font-extrabold ${fontSize[size]} tracking-tight from-app-green to-app-highlight bg-gradient-to-r text-transparent bg-clip-text`}>
          KazaDeal
        </span>
      )}
    </div>
  );
};

export default Logo;
