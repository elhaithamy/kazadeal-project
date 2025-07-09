
import React from 'react';
import logoImage from '@/assets/logo.png';

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
    <div className="flex items-center gap-2 select-none">
      <div className="bg-primary p-2 rounded-lg">
        <img src={logoImage} alt="KazaDeal" className="h-6 w-6" />
      </div>
      {showText && (
        <span className={`font-bold ${fontSize[size]} tracking-tight text-foreground`}>
          KazaDeal
        </span>
      )}
    </div>
  );
};

export default Logo;
