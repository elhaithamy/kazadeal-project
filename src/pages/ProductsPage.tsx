import React from 'react';
import { Package } from 'lucide-react';
import SingleProductManager from '@/components/SingleProductManager';

const ProductsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Package className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Add Product</h1>
        </div>
        <p className="text-muted-foreground">Add a new product and set prices across different retailers</p>
      </div>
      
      <SingleProductManager />
    </div>
  );
};

export default ProductsPage;