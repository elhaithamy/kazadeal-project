
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Tag } from 'lucide-react';

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
            <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-app-green to-app-green-dark">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight">KazaDeal</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center py-1 px-2 bg-white">
        {['LuLu', 'Othaim', 'Carrefour', 'Danube', 'Panda', 'Tamimi'].map((store, index) => (
          <div 
            key={index} 
            className={`text-xs md:text-sm font-medium flex flex-col items-center ${
              index === 0 ? 'text-app-green' : 
              index === 1 ? 'text-red-600' : 
              index === 2 ? 'text-blue-600' : 
              index === 3 ? 'text-yellow-500' : 
              index === 4 ? 'text-red-500' : 
              'text-gray-700'
            }`}
          >
            {store}
            <span className="text-[10px] text-gray-500">Expires: 20 Apr</span>
          </div>
        ))}
      </div>
    </header>
  );
};

export default Header;
