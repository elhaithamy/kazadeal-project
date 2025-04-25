import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-app-green text-white">
      <div className="flex justify-center items-center py-3 relative">
        <div className="absolute left-4">
          <Link to="/" className="flex items-center gap-1">
            <span className="sr-only">Home</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-md">
            <span className="font-bold text-xl tracking-tight">KazaDeal</span>
          </div>
        </div>
      </div>
      {/* Retailer Section */}
      <div className="flex overflow-x-auto gap-4 py-2 px-2 bg-white">
        {['LuLu', 'Othaim', 'Carrefour', 'Danube', 'Panda', 'Tamimi', 'Retailer7', 'Retailer8', 'Retailer9'].map(
          (store, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-gray-700 whitespace-nowrap"
            >
              <img
                src="https://via.placeholder.com/50" // Demo placeholder image
                alt={store}
                className="h-8 w-8 object-contain"
              />
              <span className="text-xs">{store}</span>
            </div>
          )
        )}
      </div>
    </header>
  );
};

export default Header;
