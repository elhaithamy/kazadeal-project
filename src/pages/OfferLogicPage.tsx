import React, { useContext } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import OfferLogic from '@/components/OfferLogic';
import { ProductSelectionContext } from '@/contexts/ProductSelectionContext';
import { useProducts } from '@/hooks/useProducts';

const OfferLogicPage = () => {
  const { selectedProducts } = useContext(ProductSelectionContext);
  const { products } = useProducts();

  const selectedProductData = products.filter(product => 
    selectedProducts.includes(product.id)
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 pb-20">
        <div className="container mx-auto px-4 py-6">
          <OfferLogic products={selectedProductData} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default OfferLogicPage;