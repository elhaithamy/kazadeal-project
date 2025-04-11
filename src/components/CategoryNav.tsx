
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: "Vegetables & Fruits", icon: "🍅", color: "bg-green-500" },
  { name: "Meat, Chicken, Fish", icon: "🍗", color: "bg-red-500" },
  { name: "Rice & Pasta", icon: "🌾", color: "bg-amber-500" },
  { name: "Milk and Cheese", icon: "🧀", color: "bg-yellow-400" },
  { name: "Food Items", icon: "🥫", color: "bg-yellow-300" },
  { name: "Bread & Breakfast", icon: "🍞", color: "bg-cyan-500" },
  { name: "Drinks", icon: "🥤", color: "bg-blue-500" },
  { name: "Personal Care", icon: "🧴", color: "bg-teal-600" },
  { name: "Baby Care", icon: "🍼", color: "bg-green-400" },
  { name: "Household", icon: "🧹", color: "bg-lime-500" },
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
      
      <div className="space-y-4">
        {categories.map((category, index) => (
          <Link 
            key={index}
            to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex items-center space-x-4"
          >
            <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center text-white`}>
              <span className="text-xl">{category.icon}</span>
            </div>
            <span className="text-gray-700 font-medium">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
