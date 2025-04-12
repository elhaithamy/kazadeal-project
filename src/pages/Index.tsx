
import React, { useState } from 'react';
import Header from '@/components/Header';
import PriceComparison from '@/components/PriceComparison';
import BottomNav from '@/components/BottomNav';
import { ProductSelectionProvider } from '@/contexts/ProductSelectionContext';
import ThemeToggle from '@/components/ThemeToggle';
import CategoryFilter from '@/components/CategoryFilter';
import UserAccountPanel from '@/components/UserAccountPanel';
import NotificationCenter from '@/components/NotificationCenter';
import { Share2, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NearbyStores from '@/components/NearbyStores';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

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
      // Fallback for browsers that don't support Web Share API
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const handleAvatarClick = () => {
    // In a real application, this would toggle a user menu or navigate to a profile page
    console.log('Avatar clicked');
  };

  return (
    <ProductSelectionProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        
        <main className="flex-1 mb-16 py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">KazaDeal</h1>
              <div className="flex gap-2 items-center">
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

            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              We bring the truth about deals. No bullshit.
            </p>
            
            {!isSignedIn && (
              <Card className="mb-6 bg-app-green/10 border border-app-green">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <Bell className="h-8 w-8 text-app-green flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100">Get notified about price drops!</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Sign up to receive alerts when prices drop and save your shopping lists</p>
                      </div>
                    </div>
                    <Button 
                      className="bg-app-green hover:bg-app-green/90 flex-shrink-0"
                      onClick={() => setIsSignedIn(true)}
                    >
                      Sign Up
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
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
