
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

// Static retailers data will be replaced with dynamic data from Supabase

const Header = () => {
  const { user, signOut } = useAuth();
  const { products } = useProducts();
  const [colorTheme, setColorTheme] = useState<'soft-blue' | 'navy-sky' | 'warm-green' | 'purple-lavender' | 'coral-orange'>('soft-blue');

  // Get unique retailers from products (simplified for now)
  const retailers = [
    { name: 'LuLu', logo: '/retailer-logos/lulu.png', offerDate: '30 Apr 2025' },
    { name: 'Carrefour', logo: '/retailer-logos/carrefour.png', offerDate: '28 Apr 2025' },
    { name: 'Panda', logo: '/retailer-logos/panda.png', offerDate: '25 Apr 2025' },
    { name: 'Danube', logo: '/retailer-logos/danube.png', offerDate: '27 Apr 2025' },
    { name: 'Othaim', logo: '/retailer-logos/othaim.png', offerDate: '26 Apr 2025' },
    { name: 'Tamimi', logo: '/retailer-logos/tamimi.png', offerDate: '29 Apr 2025' },
  ].filter((_, index) => index < Math.max(3, 6)); // Ensure minimum 3 retailers

  // Color theme configurations
  const themes = {
    'soft-blue': {
      primary: 'from-blue-500 to-cyan-500',
      secondary: 'bg-cyan-50',
      accent: 'bg-blue-100',
      text: 'text-blue-700',
      logo: 'from-blue-500 to-cyan-400',
      buttonBg: 'bg-blue-500',
      buttonText: 'text-blue-500',
      buttonBorder: 'border-blue-500'
    },
    'navy-sky': {
      primary: 'from-blue-900 to-sky-500',
      secondary: 'bg-blue-50',
      accent: 'bg-sky-100',
      text: 'text-blue-900',
      logo: 'from-blue-900 to-sky-400',
      buttonBg: 'bg-blue-900',
      buttonText: 'text-blue-900',
      buttonBorder: 'border-blue-900'
    },
    'warm-green': {
      primary: 'from-green-600 to-emerald-500',
      secondary: 'bg-green-50',
      accent: 'bg-emerald-100',
      text: 'text-green-800',
      logo: 'from-green-600 to-emerald-400',
      buttonBg: 'bg-green-600',
      buttonText: 'text-green-600',
      buttonBorder: 'border-green-600'
    },
    'purple-lavender': {
      primary: 'from-purple-600 to-indigo-500',
      secondary: 'bg-purple-50',
      accent: 'bg-indigo-100',
      text: 'text-purple-800',
      logo: 'from-purple-600 to-indigo-400',
      buttonBg: 'bg-purple-600',
      buttonText: 'text-purple-600',
      buttonBorder: 'border-purple-600'
    },
    'coral-orange': {
      primary: 'from-orange-500 to-red-500',
      secondary: 'bg-orange-50',
      accent: 'bg-red-100',
      text: 'text-orange-800',
      logo: 'from-orange-500 to-red-400',
      buttonBg: 'bg-orange-500',
      buttonText: 'text-orange-500',
      buttonBorder: 'border-orange-500'
    }
  };

  const currentTheme = themes[colorTheme];

  return (
    <header className="bg-card shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/account">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Retailers Bar */}
      {retailers.length >= 3 && (
        <div className="bg-secondary/10 border-t border-border">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-center overflow-x-auto gap-6">
              {retailers.map((retailer, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center gap-2 min-w-[80px]"
                >
                  <img
                    src={retailer.logo}
                    alt={retailer.name}
                    className="h-12 w-12 object-contain bg-background rounded-lg p-1 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <span className="text-xs font-medium text-foreground">{retailer.name}</span>
                  <span className="text-[10px] text-muted-foreground">{retailer.offerDate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
