
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white text-white">
      {/* Retailer Section - Moved to the very top */}
      <div className="flex overflow-x-auto gap-6 py-3 px-4 bg-white border-b border-gray-100">
        {['LuLu', 'Othaim', 'Carrefour', 'Danube', 'Panda', 'Tamimi', 'Retailer7', 'Retailer8', 'Retailer9'].map(
          (store, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-gray-700 whitespace-nowrap flex-shrink-0"
            >
              <img
                src="https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png" // Demo placeholder image
                alt={store}
                className="h-6 w-6 object-contain"
              />
              <span className="text-xs font-medium">{store}</span>
            </div>
          )
        )}
      </div>
      
      {/* App Brand Section */}
      <div className="flex justify-center items-center py-3 bg-app-green relative">
        <div className="absolute left-4">
          <Link to="/" className="flex items-center gap-1">
            <span className="sr-only">Home</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-md">
            <span className="font-bold text-xl tracking-tight text-gray-800">KazaDeal</span>
          </div>
        </div>
      </div>
      
      {/* Promotional Banner - Replacing Price Comparison header */}
      <div className="bg-gradient-to-r from-app-green/90 to-app-green h-48 flex items-center justify-center">
        <div className="text-center text-white p-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Save on Every Purchase</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-lg mx-auto">
            Compare prices across multiple stores and find the best deals instantly
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
