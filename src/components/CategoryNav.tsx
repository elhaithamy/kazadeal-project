
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { 
    name: "Vegetables & Fruits", 
    color: "bg-green-500",
    emoji: "🥬"
  },
  { 
    name: "Meat, Chicken, Fish", 
    color: "bg-red-500",
    emoji: "🍗"
  },
  { 
    name: "Rice & Pasta", 
    color: "bg-amber-500",
    emoji: "🌾"
  },
  { 
    name: "Milk and Cheese", 
    color: "bg-yellow-400",
    emoji: "🧀"
  },
  { 
    name: "Food Items", 
    color: "bg-orange-400",
    emoji: "🥫"
  },
  { 
    name: "Bread & Breakfast", 
    color: "bg-cyan-500",
    emoji: "☕️"
  },
  { 
    name: "Drinks", 
    color: "bg-blue-500",
    emoji: "🥤"
  },
  { 
    name: "Personal Care", 
    color: "bg-purple-500",
    emoji: "🧴"
  },
  { 
    name: "Baby Care", 
    color: "bg-pink-500",
    emoji: "🍼"
  },
  { 
    name: "Household", 
    color: "bg-teal-500",
    emoji: "✨"
  },
];

const CategoryNav = () => {
  return (
    <div className="px-2 py-1">
      <div className="grid grid-cols-5 gap-3 mb-3">
        {categories.slice(0, 5).map((category, index) => (
          <Link 
            key={index}
            to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex flex-col items-center space-y-2 hover-scale"
          >
            <div className={`w-14 h-14 rounded-full ${category.color} flex items-center justify-center text-white shadow-lg`}>
              <span className="text-2xl">{category.emoji}</span>
            </div>
            <span className="text-[9px] font-medium text-center text-gray-700 line-clamp-2 leading-tight">{category.name}</span>
          </Link>
        ))}
      </div>
      
      <div className="grid grid-cols-5 gap-3">
        {categories.slice(5, 10).map((category, index) => (
          <Link 
            key={index + 5}
            to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex flex-col items-center space-y-2 hover-scale"
          >
            <div className={`w-14 h-14 rounded-full ${category.color} flex items-center justify-center text-white shadow-lg`}>
              <span className="text-2xl">{category.emoji}</span>
            </div>
            <span className="text-[9px] font-medium text-center text-gray-700 line-clamp-2 leading-tight">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
