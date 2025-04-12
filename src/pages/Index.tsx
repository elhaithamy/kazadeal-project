
import React, { useState } from 'react';
import Header from '@/components/Header';
import PriceComparison from '@/components/PriceComparison';
import BottomNav from '@/components/BottomNav';
import { ProductSelectionProvider } from '@/contexts/ProductSelectionContext';
import ThemeToggle from '@/components/ThemeToggle';
import CategoryFilter from '@/components/CategoryFilter';
import UserAccountPanel from '@/components/UserAccountPanel';
import NotificationCenter from '@/components/NotificationCenter';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NearbyStores from '@/components/NearbyStores';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'KazaDeal - Price Comparison',
        text: 'Check out these great deals!',
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <ProductSelectionProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        
        <main className="flex-1 mb-16 py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">KazaDeal</h1>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
                <ThemeToggle />
              </div>
            </div>

            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              We bring the truth about deals. No bullshit.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
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
