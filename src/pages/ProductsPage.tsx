import React from 'react';
import { Package } from 'lucide-react';
import ProductManagementSheet from '@/components/ProductManagementSheet';

const ProductsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Package className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Product Management</h1>
        </div>
        <p className="text-muted-foreground">Manage products, add single items, or bulk import with retailer prices</p>
      </div>
      
      <ProductManagementSheet />
    </div>
  );
};

export default ProductsPage;