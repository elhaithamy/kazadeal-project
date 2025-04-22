
import React, { useState } from 'react';
import Header from '@/components/Header';
import PriceComparison from '@/components/PriceComparison';
import BottomNav from '@/components/BottomNav';
import { ProductSelectionProvider } from '@/contexts/ProductSelectionContext';
import ThemeToggle from '@/components/ThemeToggle';
import CategoryFilter from '@/components/CategoryFilter';
import UserAccountPanel from '@/components/UserAccountPanel';
import NotificationCenter from '@/components/NotificationCenter';
import LastUpdateOffers from '@/components/LastUpdateOffers';
import { Share2, User, Star, TrendingUp, ThumbsUp, Award, Rocket, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NearbyStores from '@/components/NearbyStores';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const uspList = [
  {
    label: "KazaDeal",
    icon: <Award className="w-6 h-6 text-violet-500" />,
    highlight: true
  },
  {
    label: "Real Savings",
    icon: <Star className="w-6 h-6 text-yellow-400" />
  },
  {
    label: "Trend Watch",
    icon: <TrendingUp className="w-6 h-6 text-green-400" />
  },
  {
    label: "Verified Deals",
    icon: <ThumbsUp className="w-6 h-6 text-blue-400" />
  },
  {
    label: "Bonuses",
    icon: <Gift className="w-6 h-6 text-pink-400" />
  },
  {
    label: "Fastest Updates",
    icon: <Rocket className="w-6 h-6 text-orange-400" />
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'KazaDeal - Price Comparison',
        text: 'Check out these great deals!',
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const handleAvatarClick = () => {
    console.log('Avatar clicked');
  };

  return (
    <ProductSelectionProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 mb-16 py-3">
          <div className="container mx-auto px-2">
            {/* Title/Top Bar */}
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">KazaDeal</h1>
              <div className="flex gap-1 items-center">
                <Button variant="ghost" size="icon" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
                <Avatar onClick={handleAvatarClick} className="cursor-pointer hover:opacity-80">
                  <AvatarFallback className="bg-gray-200 text-gray-700">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <ThemeToggle />
              </div>
            </div>

            {/* ::::: Icon Row (USP+SignUp) ::::: */}
            <div className="flex flex-nowrap overflow-auto gap-4 py-3 mb-3 border-b border-gray-100 dark:border-gray-800">
              {!isSignedIn && (
                <button 
                  className="flex flex-col items-center justify-center group focus:outline-none min-w-[70px]"
                  onClick={() => setIsSignedIn(true)}
                  aria-label="Sign Up"
                >
                  <div className="w-12 h-12 rounded-full bg-app-green/90 flex items-center justify-center mb-1 shadow group-hover:scale-105 transition-transform">
                    <User className="text-white w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-app-green group-hover:underline">Sign Up</span>
                </button>
              )}
              {uspList.map((item, i) => (
                <div key={item.label} className="flex flex-col items-center min-w-[70px]">
                  <div className={`w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center mb-1 shadow border ${item.highlight ? 'border-violet-400' : 'border-gray-100 dark:border-gray-800'}`}>
                    {item.icon}
                  </div>
                  <span className={`text-xs font-medium text-gray-700 dark:text-gray-200 text-center ${item.highlight ? "font-semibold text-violet-700 dark:text-violet-400" : ""}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            {/* ::::: END Icon Row */}

            {/* Description */}
            <p className="text-center text-gray-600 dark:text-gray-300 mb-3 mt-0 max-w-2xl mx-auto text-sm">
              We bring the truth about deals. No bullshit.
            </p>
            
            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4">
              <div className="order-2 md:order-1">
                <div className="mb-2">
                  <CategoryFilter 
                    onSearch={setSearchQuery} 
                    onCategoryChange={setActiveCategory} 
                  />
                </div>
                <PriceComparison 
                  searchQuery={searchQuery} 
                  activeCategory={activeCategory} 
                />
              </div>
              <div className="order-1 md:order-2">
                <div className="md:sticky md:top-4 space-y-4">
                  <UserAccountPanel />
                  <NotificationCenter />
                  <NearbyStores />
                </div>
              </div>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    </ProductSelectionProvider>
  );
};

export default Index;
