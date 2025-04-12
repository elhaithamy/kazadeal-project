
import React from 'react';
import { getNewArrivals } from '@/data/products';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const NewArrivals = () => {
  const newArrivals = getNewArrivals(5);
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        <h2 className="text-xl font-bold">New Arrivals</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {newArrivals.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 mb-3">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <h3 className="font-medium text-center mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 text-center">{product.category}</p>
                <div className="mt-3 text-xs text-app-green font-medium">
                  NEW IN STORES
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;
