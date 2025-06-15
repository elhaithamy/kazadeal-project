
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const retailers = [
  {
    name: 'Carrefour Egypt',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Carrefour_logo.svg/200px-Carrefour_logo.svg.png',
    offerDate: '25 Apr 2025'
  },
  {
    name: 'Beit El Gomla',
    logo: 'https://pbs.twimg.com/profile_images/1364549142055309315/4mTBrKdz_400x400.jpg',
    offerDate: '30 Apr 2025'
  },
  {
    name: 'Spinneys',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Spinneys_logo.svg/200px-Spinneys_logo.svg.png',
    offerDate: '22 Apr 2025'
  },
  {
    name: 'Panda',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Panda_Retail_Company_logo.svg/200px-Panda_Retail_Company_logo.svg.png',
    offerDate: '28 Apr 2025'
  },
  {
    name: 'Fathallah Market',
    logo: 'https://via.placeholder.com/100x100/4CAF50/FFFFFF?text=FM',
    offerDate: '23 Apr 2025'
  },
  {
    name: 'Zahran Market',
    logo: 'https://via.placeholder.com/100x100/FF5722/FFFFFF?text=ZM',
    offerDate: '21 Apr 2025'
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
        Hey 👋 Ready to find the best deals? <span className='ml-2 animate-wiggle'>💸</span>
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
          <h1 className="text-xl font-black font-spacegrotesk">Find the Best Deals ✨</h1>
          <p className="text-sm opacity-90">
            Compare prices across stores & save on every purchase!
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
