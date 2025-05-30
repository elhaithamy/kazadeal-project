
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
import { Share2, User, Bell, Tag, CircleArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NearbyStores from '@/components/NearbyStores';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

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
        <main className="flex-1 pb-3">
          <div className="container mx-auto px-2">
            {/* Title/Top Bar - Moved inside container to reduce spacing */}
            <div className="flex justify-between items-center mb-3 mt-2">
              <div className="flex gap-2">
                <Link to="/leaflets">
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Retailer Leaflets</span>
                    <span className="sm:hidden">Leaflets</span>
                  </Button>
                </Link>
              </div>
              
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

            {/* Main Grid - Adjusted for more visibility of pricing table */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
              <div className="order-2 md:order-1">
                <div className="mb-3">
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
                <div className="md:sticky md:top-4 space-y-3">
                  {/* Combined User Account Panel */}
                  <UserAccountPanel />
                  
                  {/* Alerts and Nearby stores in a horizontal strip */}
                  {isSignedIn && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <NotificationCenter />
                      <NearbyStores />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Fixed bottom nav spacing */}
        <div className="pb-16 md:pb-0">
          {/* Bottom navigation */}
        </div>
        <BottomNav />
      </div>
    </ProductSelectionProvider>
  );
};

export default Index;
