
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
import { Share2, User, Bell, Tag, CircleArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NearbyStores from '@/components/NearbyStores';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

const uspList = [
  {
    label: "Smart Price Comparison",
    description: "Uncover the best unit-value savings, not fake discounts",
    icon: <Tag className="w-6 h-6 text-violet-500" />,
  },
  {
    label: "Offer Alerts",
    description: "Get notified when real deals hit the shelves",
    icon: <Bell className="w-6 h-6 text-blue-500" />,
  },
  {
    label: "Personalized Insights",
    description: "Tailored picks based on your shopping habits",
    icon: <CircleArrowRight className="w-6 h-6 text-green-500" />,
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Price Comparison - KazaDeal',
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
        <main className="flex-1 mb-16 pb-3">
          <div className="container mx-auto px-2">
            {/* Title/Top Bar */}
            <div className="flex justify-end items-center mb-4 mt-4">
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

            {/* ::::: USP Section ::::: */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 mb-6 border-b border-gray-100 dark:border-gray-800">
              {uspList.map((item, i) => (
                <div 
                  key={item.label} 
                  className="flex flex-col items-center text-center p-4"
                >
                  <div className="mb-3 p-3 rounded-full bg-gray-50 dark:bg-gray-800">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-sm mb-1 text-gray-800 dark:text-gray-200">
                    {item.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              ))}
              
              {!isSignedIn && (
                <button 
                  className="flex flex-col items-center justify-center group focus:outline-none p-4 md:col-span-3 bg-gradient-to-r from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 rounded-lg mt-2"
                  onClick={() => setIsSignedIn(true)}
                >
                  <div className="w-12 h-12 rounded-full bg-violet-500 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <User className="text-white w-6 h-6" />
                  </div>
                  <span className="font-bold text-violet-600 dark:text-violet-400 group-hover:underline">
                    Sign Up for More Savings
                  </span>
                </button>
              )}
            </div>
            
            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4">
              <div className="order-2 md:order-1">
                <div className="mb-4">
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
