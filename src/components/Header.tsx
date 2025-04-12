
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-app-green text-white">
      <div className="flex justify-center items-center py-2 relative">
        <div className="absolute left-4">
          <Link to="/" className="flex items-center gap-1">
            <span className="sr-only">Home</span>
          </Link>
        </div>
        <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
          <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="/lovable-uploads/de7fd74f-0164-477e-b44b-45bd2df495f3.png" 
              alt="KazaDeal Logo" 
              className="h-12 w-12 object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center py-1 px-2 bg-white">
        {['LuLu', 'Othaim', 'Carrefour', 'Danube', 'Panda', 'Tamimi'].map((store, index) => (
          <div 
            key={index} 
            className={`text-xs md:text-sm font-medium ${
              index === 0 ? 'text-app-green' : 
              index === 1 ? 'text-red-600' : 
              index === 2 ? 'text-blue-600' : 
              index === 3 ? 'text-yellow-500' : 
              index === 4 ? 'text-red-500' : 
              'text-gray-700'
            }`}
          >
            {store}
          </div>
        ))}
      </div>
    </header>
  );
};

export default Header;
