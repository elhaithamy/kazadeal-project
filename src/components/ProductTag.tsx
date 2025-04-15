
import React from 'react';
import { BadgePercent, Package, Weight, Flame, Star } from 'lucide-react';

export type TagType = 'hot-deal' | 'bulky' | 'heavy-carry' | 'new' | 'bestseller';

interface ProductTagProps {
  type: TagType;
  className?: string;
}

const ProductTag: React.FC<ProductTagProps> = ({ type, className = '' }) => {
  const getTagContent = () => {
    switch (type) {
      case 'hot-deal':
        return {
          text: 'Hot Deal',
          icon: <Flame className="h-3 w-3 mr-1" />,
          color: 'bg-gradient-to-r from-red-500 to-orange-400 text-white'
        };
      case 'bulky':
        return {
          text: 'Bulky',
          icon: <Package className="h-3 w-3 mr-1" />,
          color: 'bg-gradient-to-r from-blue-500 to-blue-400 text-white'
        };
      case 'heavy-carry':
        return {
          text: 'Heavy Carry',
          icon: <Weight className="h-3 w-3 mr-1" />,
          color: 'bg-gradient-to-r from-purple-500 to-purple-400 text-white'
        };
      case 'new':
        return {
          text: 'New',
          icon: <Star className="h-3 w-3 mr-1" />,
          color: 'bg-gradient-to-r from-green-500 to-green-400 text-white'
        };
      case 'bestseller':
        return {
          text: 'Best Seller',
          icon: <BadgePercent className="h-3 w-3 mr-1" />,
          color: 'bg-gradient-to-r from-amber-500 to-amber-400 text-white'
        };
      default:
        return {
          text: 'New',
          icon: <Star className="h-3 w-3 mr-1" />,
          color: 'bg-gradient-to-r from-green-500 to-green-400 text-white'
        };
    }
  };

  const { text, icon, color } = getTagContent();

  return (
    <div className={`px-2 py-0.5 rounded-full text-xs flex items-center whitespace-nowrap ${color} ${className}`}>
      {icon}
      {text}
    </div>
  );
};

export default ProductTag;
