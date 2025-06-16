
import React, { useState } from 'react';
import Header from '@/components/Header';
import PriceComparison from '@/components/PriceComparison';
import BottomNav from '@/components/BottomNav';
import USPFooter from '@/components/USPFooter';
import { ProductSelectionProvider } from '@/contexts/ProductSelectionContext';
import TopActionBar from '@/components/TopActionBar';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <ProductSelectionProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 pb-3">
          <div className="container mx-auto px-2">
            {/* Top Action Bar */}
            <div className="mt-4">
              <TopActionBar />
            </div>

            {/* Main Content - Single Column for Mobile Friendly */}
            <div className="w-full">
              <PriceComparison 
                searchQuery={searchQuery} 
                activeCategory={activeCategory} 
                onSearch={setSearchQuery}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </div>
        </main>
        
        {/* USP Footer */}
        <USPFooter />
        
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
