
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
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-5xl'
};

// Tank emoji for deals website
const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  return (
    <div className="flex items-center gap-2 font-spacegrotesk select-none">
      <span 
        className={`${iconSize[size]} drop-shadow-md bg-gradient-to-br from-app-green to-app-highlight rounded-full px-2 py-1 animate-bounce`}
        aria-label="Deals Tank Logo"
      >🚀</span>
      {showText && (
        <span className={`font-extrabold ${fontSize[size]} tracking-tight from-app-green to-app-highlight bg-gradient-to-r text-transparent bg-clip-text`}>
          Deals Tank
        </span>
      )}
    </div>
  );
};

export default Logo;
