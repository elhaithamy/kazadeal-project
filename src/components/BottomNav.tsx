
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBasket, List, FileText, Settings, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ShoppingBasket, label: 'Basket', path: '/basket' },
    { icon: List, label: 'Lists', path: '/checklist' },
    { icon: FileText, label: 'Leaflets', path: '/leaflets' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: User, label: 'Account', path: '/account' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-1 px-2 text-xs transition-colors ${
                isActive
                  ? 'text-app-green'
                  : 'text-gray-500 hover:text-app-green'
              }`}
            >
              <Icon className={`h-6 w-6 mb-1 ${isActive ? 'text-app-green' : ''}`} />
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
