
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Carrot, 
  Beef, 
  Wheat, 
  Milk, 
  Cookie, 
  Coffee, 
  Beer, 
  Bath, 
  Baby, 
  Sparkles
} from 'lucide-react';

const categories = [
  { 
    name: "Vegetables & Fruits", 
    icon: <Carrot className="w-5 h-5" />, 
    color: "bg-gradient-to-r from-green-400 to-green-500",
    emoji: "🥬"
  },
  { 
    name: "Meat, Chicken, Fish", 
    icon: <Beef className="w-5 h-5" />, 
    color: "bg-gradient-to-r from-red-400 to-red-500",
    emoji: "🍗"
  },
  { 
    name: "Rice & Pasta", 
    icon: <Wheat className="w-5 h-5" />, 
    color: "bg-gradient-to-r from-amber-400 to-amber-500",
    emoji: "🌾"
  },
  { 
    name: "Milk and Cheese", 
    icon: <Milk className="w-5 h-5" />, 
    color: "bg-gradient-to-r from-yellow-300 to-yellow-400",
    emoji: "🧀"
  },
  { 
    name: "Food Items", 
    icon: <Cookie className="w-5 h-5" />, 
    color: "bg-gradient-to-r from-orange-300 to-orange-400",
    emoji: "🥫"
  },
  { 
    name: "Bread & Breakfast", 
    icon: <Coffee className="w-5 h-5" />, 
    color: "bg-gradient-to-r from-cyan-400 to-cyan-500",
    emoji: "☕️"
  },
  { 
    name: "Drinks", 
    icon: <Beer className="w-5 h-5" />, 
    color: "bg-gradient-to-r from-blue-400 to-blue-500",
    emoji: "🥤"
  },
  { 
    name: "Personal Care", 
    icon: <Bath className="w-5 h-5" />, 
    color: "bg-gradient-to-r from-purple-400 to-purple-500",
    emoji: "🧴"
  },
  { 
    name: "Baby Care", 
    icon: <Baby className="w-5 h-5" />, 
    color: "bg-gradient-to-r from-pink-400 to-pink-500",
    emoji: "🍼"
  },
  { 
    name: "Household", 
    icon: <Sparkles className="w-5 h-5" />, 
    color: "bg-gradient-to-r from-teal-400 to-teal-500",
    emoji: "✨"
  },
];

const CategoryNav = () => {
  return (
    <div className="px-2 py-1">
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Search for a product"
          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-app-green focus:border-transparent"
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>
      
      {/* Changed from 5 columns to 5 columns with smaller icons */}
      <div className="grid grid-cols-5 gap-2 mb-2">
        {categories.slice(0, 5).map((category, index) => (
          <Link 
            key={index}
            to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex flex-col items-center space-y-1 hover-scale"
          >
            <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center text-white shadow-sm overflow-hidden`}>
              <div className="flex flex-col items-center">
                {category.icon}
                <span className="text-xs mt-1">{category.emoji}</span>
              </div>
            </div>
            <span className="text-[10px] font-medium text-center text-gray-700 line-clamp-1">{category.name}</span>
          </Link>
        ))}
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {categories.slice(5, 10).map((category, index) => (
          <Link 
            key={index + 5}
            to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex flex-col items-center space-y-1 hover-scale"
          >
            <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center text-white shadow-sm overflow-hidden`}>
              <div className="flex flex-col items-center">
                {category.icon}
                <span className="text-xs mt-1">{category.emoji}</span>
              </div>
            </div>
            <span className="text-[10px] font-medium text-center text-gray-700 line-clamp-1">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
