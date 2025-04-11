
import React from 'react';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import BottomNav from '@/components/BottomNav';

const CategoryPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 mb-16">
        <CategoryNav />
      </main>
      
      <BottomNav />
    </div>
  );
};

export default CategoryPage;
