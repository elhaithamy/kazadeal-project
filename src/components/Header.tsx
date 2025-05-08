
import React from 'react';
import { Link } from 'react-router-dom';

const retailers = [
  {
    name: 'LuLu',
    logo: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    offerDate: '25 Apr 2025'
  },
  {
    name: 'Othaim',
    logo: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    offerDate: '30 Apr 2025'
  },
  {
    name: 'Carrefour',
    logo: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    offerDate: '22 Apr 2025'
  },
  {
    name: 'Danube',
    logo: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    offerDate: '28 Apr 2025'
  },
  {
    name: 'Panda',
    logo: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    offerDate: '23 Apr 2025'
  },
  {
    name: 'Tamimi',
    logo: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    offerDate: '21 Apr 2025'
  },
  {
    name: 'Retailer7',
    logo: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    offerDate: '19 Apr 2025'
  },
  {
    name: 'Retailer8',
    logo: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    offerDate: '20 Apr 2025'
  },
  {
    name: 'Retailer9',
    logo: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    offerDate: '18 Apr 2025'
  }
];

const Header = () => {
  return (
    <header className="bg-white text-white">
      {/* App Brand Section - Moved to top */}
      <div className="flex justify-center items-center py-2 bg-app-green relative">
        <div className="absolute left-4">
          <Link to="/" className="flex items-center gap-1">
            <span className="sr-only">Home</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md">
            <span className="font-bold text-lg tracking-tight text-gray-800">KazaDeal</span>
          </div>
        </div>
      </div>
      
      {/* Retailer Section - Made more organized with offer dates */}
      <div className="flex overflow-x-auto gap-4 py-2 px-2 bg-white border-b border-gray-100">
        {retailers.map((retailer, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center gap-1 text-gray-700 whitespace-nowrap flex-shrink-0 min-w-[72px]"
          >
            <img
              src={retailer.logo}
              alt={retailer.name}
              className="h-10 w-10 object-contain"
            />
            <span className="text-xs font-medium">{retailer.name}</span>
            <span className="text-[10px] text-gray-500">{retailer.offerDate}</span>
          </div>
        ))}
      </div>
      
      {/* Promotional Banner - Reduced height significantly for better visibility of price table */}
      <div className="bg-gradient-to-r from-app-green/90 to-app-green h-20 flex items-center justify-center">
        <div className="text-center text-white p-2">
          <h1 className="text-xl font-bold">Save on Every Purchase</h1>
          <p className="text-sm opacity-90">
            Compare prices across multiple stores and find the best deals instantly
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
