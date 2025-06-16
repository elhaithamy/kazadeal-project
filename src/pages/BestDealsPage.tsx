
import React, { useMemo } from 'react';
import { ArrowLeft, TrendingDown, Calendar, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';

const BestDealsPage = () => {
  // Get products with their best prices and retailer info
  const bestDeals = useMemo(() => {
    return products.map(product => {
      const prices = [
        { retailer: 'LuLu', price: product.prices.lulu },
        { retailer: 'Othaim', price: product.prices.othaim },
        { retailer: 'Carrefour', price: product.prices.carrefour },
        { retailer: 'Danube', price: product.prices.danube },
        { retailer: 'Panda', price: product.prices.panda },
        { retailer: 'Tamimi', price: product.prices.tamimi }
      ];
      
      const bestPrice = prices.reduce((min, current) => 
        current.price < min.price ? current : min
      );
      
      // Generate random expiry dates for demo
      const expiryDates = [
        'Apr 25, 2025',
        'May 01, 2025', 
        'Apr 30, 2025',
        'May 05, 2025',
        'Apr 28, 2025'
      ];
      
      return {
        ...product,
        bestPrice: bestPrice.price,
        bestRetailer: bestPrice.retailer,
        expiry: expiryDates[product.id % expiryDates.length],
        discount: Math.floor(Math.random() * 30) + 10 // Random discount 10-40%
      };
    }).sort((a, b) => a.bestPrice - b.bestPrice); // Sort by best price
  }, []);

  const retailerColors = {
    'LuLu': 'bg-blue-100 text-blue-800',
    'Othaim': 'bg-purple-100 text-purple-800',
    'Carrefour': 'bg-orange-100 text-orange-800',
    'Danube': 'bg-cyan-100 text-cyan-800',
    'Panda': 'bg-indigo-100 text-indigo-800',
    'Tamimi': 'bg-violet-100 text-violet-800'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-6 w-6 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-900">Best Deals</h1>
            </div>
          </div>
          <p className="text-gray-600 mt-2">Lowest prices across all retailers</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bestDeals.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-600">
                          {product.bestPrice.toFixed(2)} SR
                        </span>
                        <Badge className="bg-red-100 text-red-800 text-xs">
                          {product.discount}% OFF
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-gray-500" />
                        <Badge 
                          className={`text-xs ${retailerColors[product.bestRetailer as keyof typeof retailerColors] || 'bg-gray-100 text-gray-800'}`}
                        >
                          {product.bestRetailer}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Expires: {product.expiry}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Bottom spacing for mobile nav */}
      <div className="pb-20 md:pb-4"></div>
    </div>
  );
};

export default BestDealsPage;
