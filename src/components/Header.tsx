import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

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
    <header className="bg-white font-spacegrotesk text-white">
      <div className="flex justify-center items-center py-2 bg-gradient-to-tr from-app-green to-app-highlight relative">
        <div className="absolute left-4">
          <Logo size="sm" showText={false} />
        </div>
        <Logo size="md" />
      </div>
      
      <div className="flex justify-center items-center py-1 bg-app-green/10 text-app-green text-center text-base font-bold">
        Hey 👋 Ready to bag the best deals? <span className='ml-2 animate-wiggle'>💸</span>
      </div>

      <div className="flex overflow-x-auto gap-4 py-2 px-2 bg-white border-b border-gray-100">
        {retailers.map((retailer, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center gap-1 text-gray-700 whitespace-nowrap flex-shrink-0 min-w-[72px]"
          >
            <img
              src={retailer.logo}
              alt={retailer.name}
              className="h-10 w-10 object-contain bg-gradient-to-br from-app-green/30 to-app-green/5 rounded-xl"
            />
            <span className="text-xs font-semibold">{retailer.name}</span>
            <span className="text-[10px] text-gray-500">{retailer.offerDate}</span>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-app-green/90 to-app-green h-20 flex items-center justify-center rounded-b-2xl shadow-md">
        <div className="text-center text-white p-2">
          <h1 className="text-xl font-black font-spacegrotesk">Save on Every Purchase ✨</h1>
          <p className="text-sm opacity-90">
            Compare prices across stores & flex on overpriced groceries!
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
