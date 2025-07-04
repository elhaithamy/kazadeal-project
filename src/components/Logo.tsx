
import React from 'react';
import { ShoppingCart } from 'lucide-react';

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
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-xl'
};

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  return (
    <div className="flex items-center gap-2 font-spacegrotesk select-none">
      <div className={`${iconSize[size]} drop-shadow-md bg-gradient-to-br from-app-primary to-app-soft rounded-full p-2 relative`}>
        <ShoppingCart className="text-white" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-0.5 bg-red-500 rotate-45 rounded-full"></div>
        </div>
      </div>
      {showText && (
        <span className={`font-extrabold ${fontSize[size]} tracking-tight from-app-primary to-app-soft bg-gradient-to-r text-transparent bg-clip-text`}>
          Deals Tank
        </span>
      )}
    </div>
  );
};

export default Logo;
