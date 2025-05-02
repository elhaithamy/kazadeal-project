
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBasket, Search, Settings, FileText } from 'lucide-react';

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 z-40">
      <div className="flex justify-around items-center">
        <Link to="/basket" className="flex flex-col items-center text-app-green">
          <ShoppingBasket className="h-6 w-6" />
          <span className="text-xs mt-1">Basket</span>
        </Link>
        
        <Link to="/leaflets" className="flex flex-col items-center text-gray-500">
          <FileText className="h-6 w-6" />
          <span className="text-xs mt-1">Leaflets</span>
        </Link>
        
        <Link to="/search" className="flex flex-col items-center text-gray-500">
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Search</span>
        </Link>
        
        <Link to="/settings" className="flex flex-col items-center text-gray-500">
          <Settings className="h-6 w-6" />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
