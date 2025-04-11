
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

const BasketPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="bg-white shadow-sm mb-4">
        <div className="container mx-auto px-4 py-2 flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold">Your Basket</h1>
        </div>
      </div>
      
      <main className="flex-1 mb-16 px-4">
        <div className="p-8 text-center text-gray-500">
          <p className="mb-4">Your basket is empty</p>
          <Link 
            to="/" 
            className="inline-block bg-app-green text-white px-4 py-2 rounded-md"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default BasketPage;
