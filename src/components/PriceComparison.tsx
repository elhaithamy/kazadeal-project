import React, { useContext, useState, useMemo } from 'react';
import { Search, Filter, Grid3X3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductSelectionContext } from '@/contexts/ProductSelectionContext';
import ComparisonBar from '@/components/ComparisonBar';
import { products } from '@/data/products';
import ProductTag from '@/components/ProductTag';

interface PriceComparisonProps {
  searchQuery: string;
  activeCategory: string;
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
}

const PriceComparison = ({ searchQuery, onSearch }: PriceComparisonProps) => {
  const { selectedProducts, toggleProductSelection } = useContext(ProductSelectionContext);
  const [sortBy, setSortBy] = useState<'name' | 'lowest-price' | 'highest-price'>('name');

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    
    switch (sortBy) {
      case 'lowest-price':
        return sorted.sort((a, b) => {
          const minPriceA = Math.min(...Object.values(a.prices));
          const minPriceB = Math.min(...Object.values(b.prices));
          return minPriceA - minPriceB;
        });
      case 'highest-price':
        return sorted.sort((a, b) => {
          const maxPriceA = Math.max(...Object.values(a.prices));
          const maxPriceB = Math.max(...Object.values(b.prices));
          return maxPriceB - maxPriceA;
        });
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [filteredProducts, sortBy]);

  const calculatePriceRankings = (product: any) => {
    const prices = Object.values(product.prices) as number[];
    const sortedPrices = [...prices].sort((a, b) => a - b);
    const lowestPrice = sortedPrices[0];
    const highestPrice = sortedPrices[sortedPrices.length - 1];

    const rankings: Record<string, 'lowest' | 'medium' | 'highest'> = {};
    
    Object.entries(product.prices).forEach(([store, price]) => {
      if (price === lowestPrice) {
        rankings[store] = 'lowest';
      } else if (price === highestPrice) {
        rankings[store] = 'highest';
      } else {
        rankings[store] = 'medium';
      }
    });

    return rankings;
  };

  const calculateTotals = () => {
    const totals = {
      lulu: 0,
      othaim: 0,
      carrefour: 0,
      danube: 0,
      panda: 0,
      tamimi: 0
    };

    selectedProducts.forEach(productId => {
      const product = products.find(p => p.id === productId);
      if (product) {
        totals.lulu += product.prices.lulu;
        totals.othaim += product.prices.othaim;
        totals.carrefour += product.prices.carrefour;
        totals.danube += product.prices.danube;
        totals.panda += product.prices.panda;
        totals.tamimi += product.prices.tamimi;
      }
    });

    return totals;
  };

  const totals = calculateTotals();
  const lowestTotalStore = Object.entries(totals).reduce((lowest, current) =>
    current[1] < lowest[1] ? current[0] : lowest[0], 
    Object.keys(totals)[0]
  );

  const formatPrice = (price: number, ranking: 'lowest' | 'medium' | 'highest') => {
    const baseClasses = "px-2 py-1 rounded text-sm font-medium";
    const colorClasses = {
      lowest: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800", 
      highest: "bg-red-100 text-red-800"
    };

    return (
      <span className={`${baseClasses} ${colorClasses[ranking]}`}>
        {price.toFixed(2)}
      </span>
    );
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-6 px-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 px-2">
        <div className="flex items-center gap-2">
          <Grid3X3 className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {sortedProducts.length} Products
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
          >
            <option value="name">Sort by Name</option>
            <option value="lowest-price">Lowest Price</option>
            <option value="highest-price">Highest Price</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-3 px-2">
        {sortedProducts.map((product) => {
          const priceRankings = calculatePriceRankings(product);
          const isSelected = selectedProducts.includes(product.id);
          
          return (
            <Card key={product.id} className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-app-green shadow-md' : 'hover:shadow-md'}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleProductSelection(product.id)}
                      className="mr-3"
                    />
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="absolute -top-1 -right-1">
                        <ProductTag type={product.id % 3 === 0 ? 'hot-deal' : (product.id % 3 === 1 ? 'bestseller' : 'new')} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                      </div>
                      {isSelected && (
                        <Badge className="bg-app-green text-white text-xs">
                          Selected
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                      {Object.entries(product.prices).map(([store, price]) => (
                        <div key={store} className="text-center">
                          <div className="font-medium text-gray-600 mb-1 capitalize text-[10px]">
                            {store}
                          </div>
                          {formatPrice(price, priceRankings[store])}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your search.</p>
        </div>
      )}

      <ComparisonBar 
        totals={totals}
        selectedProducts={selectedProducts}
        priceRankings={{}}
        lowestTotalStore={lowestTotalStore}
      />
    </div>
  );
};

export default PriceComparison;
