
import React from 'react';
import Header from '@/components/Header';
import PriceComparison from '@/components/PriceComparison';
import BottomNav from '@/components/BottomNav';
import { ProductSelectionProvider } from '@/contexts/ProductSelectionContext';

const Index = () => {
  return (
    <ProductSelectionProvider>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        
        <main className="flex-1 mb-16 py-4">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Offer Spotter</h1>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Compare prices across major supermarkets in Saudi Arabia and find the best deals.
              Select products to compare and build your optimal shopping list.
            </p>
            
            <PriceComparison />
          </div>
        </main>
        
        <BottomNav />
      </div>
    </ProductSelectionProvider>
  );
};

export default Index;
