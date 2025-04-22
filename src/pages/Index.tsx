
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
import { Share2, User, Star, TrendingUp, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NearbyStores from '@/components/NearbyStores';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const uspList = [
  {
    icon: <Star className="w-6 h-6 text-yellow-400" />,
    label: "Real Savings"
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-green-400" />,
    label: "Trend Watch"
  },
  {
    icon: <ThumbsUp className="w-6 h-6 text-blue-400" />,
    label: "Verified Deals"
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

            {/* Start: New Icons USP row */}
            <div className="flex items-center justify-center gap-5 mb-2 mt-2">
              {!isSignedIn && (
                <button 
                  className="flex flex-col items-center justify-center group focus:outline-none"
                  onClick={() => setIsSignedIn(true)}
                  aria-label="Sign Up"
                >
                  <div className="w-10 h-10 rounded-full bg-app-green/90 flex items-center justify-center mb-1 shadow group-hover:scale-105 transition-transform">
                    <User className="text-white w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-app-green group-hover:underline">Sign Up</span>
                </button>
              )}
              {uspList.map((item, i) => (
                <div key={item.label} className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-1 shadow">
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-200 text-center">{item.label}</span>
                </div>
              ))}
            </div>
            {/* End: Icons USP row */}

            <p className="text-center text-gray-600 dark:text-gray-300 mb-3 mt-0 max-w-2xl mx-auto text-sm">
              We bring the truth about deals. No bullshit.
            </p>
            
            {/* The main table now appears immediately */}
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
