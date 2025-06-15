
import React, { useState } from 'react';
import { Share2, User, Bell, MessageCircle, FileText, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TopActionBar = () => {
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Deals Tank - Best Price Comparison',
        text: 'Check out these amazing deals!',
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
    setShowSharePopup(false);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      {/* Leaflet Banner - 30% */}
      <div className="flex-[3] bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">📰 Retailers Magazines</h3>
            <p className="text-sm opacity-90">Exclusive catalogs & insider deals! 💎</p>
          </div>
          <Link to="/leaflets">
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 border-0 font-bold px-4 py-2 rounded-full transition-all hover:scale-105">
              <FileText className="h-4 w-4 mr-1" />
              Explore
            </Button>
          </Link>
        </div>
      </div>

      {/* User Panels - 50% */}
      <div className="flex-[5] grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-3 text-white text-center cursor-pointer hover:scale-105 transition-all">
          <Bell className="h-6 w-6 mx-auto mb-1" />
          <p className="text-xs font-medium">Price Alerts</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 text-white text-center cursor-pointer hover:scale-105 transition-all">
          <User className="h-6 w-6 mx-auto mb-1" />
          <p className="text-xs font-medium">Your Account</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-3 text-white text-center cursor-pointer hover:scale-105 transition-all">
          <MessageCircle className="h-6 w-6 mx-auto mb-1" />
          <p className="text-xs font-medium">Support</p>
        </div>
      </div>

      {/* Actions - 20% */}
      <div className="flex-[2] flex gap-2 items-center justify-end">
        <Popover open={showSharePopup} onOpenChange={setShowSharePopup}>
          <PopoverTrigger asChild>
            <div className="bg-gradient-to-r from-app-green to-app-highlight rounded-xl p-3 text-white text-center cursor-pointer hover:scale-105 transition-all">
              <Share2 className="h-5 w-5 mx-auto" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <div className="text-center">
              <h4 className="font-semibold mb-2">Share Deals Tank! 🚀</h4>
              <p className="text-sm text-gray-600 mb-3">Spread the word about amazing deals!</p>
              <Button onClick={handleShare} className="w-full bg-app-green hover:bg-app-green/90">
                Share Now
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={showUserPopup} onOpenChange={setShowUserPopup}>
          <PopoverTrigger asChild>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3 text-white text-center cursor-pointer hover:scale-105 transition-all">
              <User className="h-5 w-5 mx-auto" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <div className="text-center">
              <h4 className="font-semibold mb-2">Join Deals Tank! 💪</h4>
              <p className="text-sm text-gray-600 mb-3">Sign up now to save your favorite deals and get personalized recommendations!</p>
              <Button className="w-full bg-app-green hover:bg-app-green/90">
                Sign Up Now
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div 
          onClick={toggleDarkMode}
          className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl p-3 text-white text-center cursor-pointer hover:scale-105 transition-all"
        >
          {darkMode ? <Sun className="h-5 w-5 mx-auto" /> : <Moon className="h-5 w-5 mx-auto" />}
        </div>
      </div>
    </div>
  );
};

export default TopActionBar;
