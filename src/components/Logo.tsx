
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBasket } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const textSizeMap = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <Link to="/" className="flex items-center gap-2">
      <div className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-app-green to-emerald-600 flex items-center justify-center shadow-md cursor-pointer hover:opacity-90 transition-opacity`}>
        <ShoppingBasket className="text-white w-1/2 h-1/2" />
      </div>
      {showText && (
        <span className={`font-bold ${textSizeMap[size]} tracking-tight text-gray-800 dark:text-gray-100`}>
          KazaDeal
        </span>
      )}
    </Link>
  );
};

export default Logo;
