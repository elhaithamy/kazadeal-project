
import React, { useState } from 'react';
import { Share2, User, Bell, MessageCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ThemeToggle from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TopActionBar = () => {
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);

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

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      {/* Leaflet Banner - 30% */}
      <div className="flex-[3] bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">📑 Weekly Leaflets</h3>
            <p className="text-sm opacity-90">Fresh deals dropping daily! 🔥</p>
          </div>
          <Link to="/leaflets">
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 border-0">
              <FileText className="h-4 w-4 mr-1" />
              Browse
            </Button>
          </Link>
        </div>
      </div>

      {/* User Panels - 50% */}
      <div className="flex-[5] grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-3 text-white text-center">
          <Bell className="h-6 w-6 mx-auto mb-1" />
          <p className="text-xs font-medium">Price Alerts</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 text-white text-center">
          <User className="h-6 w-6 mx-auto mb-1" />
          <p className="text-xs font-medium">Your Account</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-3 text-white text-center">
          <MessageCircle className="h-6 w-6 mx-auto mb-1" />
          <p className="text-xs font-medium">Support</p>
        </div>
      </div>

      {/* Actions - 20% */}
      <div className="flex-[2] flex gap-2 items-center justify-end">
        <Popover open={showSharePopup} onOpenChange={setShowSharePopup}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-gray-100">
              <Share2 className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <div className="text-center">
              <h4 className="font-semibold mb-2">Share Deals Tank! 🚀</h4>
              <p className="text-sm text-gray-600 mb-3">Spread the word about amazing deals!</p>
              <Button onClick={handleShare} className="w-full">
                Share Now
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={showUserPopup} onOpenChange={setShowUserPopup}>
          <PopoverTrigger asChild>
            <Avatar className="cursor-pointer hover:opacity-80">
              <AvatarFallback className="bg-app-green text-white">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
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

        <ThemeToggle />
      </div>
    </div>
  );
};

export default TopActionBar;
