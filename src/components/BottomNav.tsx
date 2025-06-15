
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBasket, Settings, FileText, Home, Save } from 'lucide-react';

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 z-40">
      <div className="flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center text-app-green">
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link to="/checklist" className="flex flex-col items-center text-gray-500">
          <Save className="h-6 w-6" />
          <span className="text-xs mt-1">Saved</span>
        </Link>
        
        <Link to="/leaflets" className="flex flex-col items-center text-gray-500">
          <div className="relative">
            <FileText className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 text-[8px] bg-app-green text-white rounded-full w-3 h-3 flex items-center justify-center">
              PDF
            </span>
          </div>
          <span className="text-xs mt-1">Leaflets</span>
        </Link>
        
        <Link to="/basket" className="flex flex-col items-center text-gray-500">
          <ShoppingBasket className="h-6 w-6" />
          <span className="text-xs mt-1">Basket</span>
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
