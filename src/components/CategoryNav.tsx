
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: "Vegetables & Fruits", icon: "🍅", color: "bg-gradient-to-r from-green-400 to-green-500" },
  { name: "Meat, Chicken, Fish", icon: "🍗", color: "bg-gradient-to-r from-red-400 to-red-500" },
  { name: "Rice & Pasta", icon: "🌾", color: "bg-gradient-to-r from-amber-400 to-amber-500" },
  { name: "Milk and Cheese", icon: "🧀", color: "bg-gradient-to-r from-yellow-300 to-yellow-400" },
  { name: "Food Items", icon: "🥫", color: "bg-gradient-to-r from-orange-300 to-orange-400" },
  { name: "Bread & Breakfast", icon: "🍞", color: "bg-gradient-to-r from-cyan-400 to-cyan-500" },
  { name: "Drinks", icon: "🥤", color: "bg-gradient-to-r from-blue-400 to-blue-500" },
  { name: "Personal Care", icon: "🧴", color: "bg-gradient-to-r from-purple-400 to-purple-500" },
  { name: "Baby Care", icon: "🍼", color: "bg-gradient-to-r from-pink-400 to-pink-500" },
  { name: "Household", icon: "🧹", color: "bg-gradient-to-r from-teal-400 to-teal-500" },
];

const CategoryNav = () => {
  return (
    <div className="px-4 py-4">
      <div className="relative mb-6">
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
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <Link 
            key={index}
            to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex flex-col items-center space-y-3 hover-scale"
          >
            <div className={`w-14 h-14 rounded-full ${category.color} flex items-center justify-center text-white shadow-md overflow-hidden`}>
              <span className="text-xl">{category.icon}</span>
            </div>
            <span className="text-sm text-center font-medium text-gray-700">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
