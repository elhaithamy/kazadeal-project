
import React from 'react';
import { ShoppingBasket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ComparisonBarProps {
  totals: {
    lulu: number;
    othaim: number;
    carrefour: number;
    danube: number;
    panda: number;
    tamimi: number;
  };
  selectedProducts: number[];
  priceRankings: Record<string, 'lowest' | 'medium' | 'highest'>;
  lowestTotalStore: string;
}

const ComparisonBar = ({ totals, selectedProducts, priceRankings, lowestTotalStore }: ComparisonBarProps) => {
  const isMobile = useIsMobile();
  
  if (selectedProducts.length === 0) {
    return null;
  }

  // Color palette for retailers
  const retailerColors = {
    lulu: '#0EA5E9', // Ocean Blue
    othaim: '#9b87f5', // Primary Purple
    carrefour: '#F97316', // Bright Orange
    danube: '#1EAEDB', // Bright Blue
    panda: '#7E69AB', // Secondary Purple
    tamimi: '#6E59A5', // Tertiary Purple
  };

  const formatStoreTotal = (store: string, value: number) => {
    const storeColor = retailerColors[store as keyof typeof retailerColors] || '#6E59A5';
    
    return (
      <div className="flex flex-col items-center">
        <div 
          className="rounded-lg p-2 w-full text-center shadow-sm" 
          style={{ backgroundColor: storeColor }}
        >
          <span className="text-white font-bold text-sm md:text-base">{value.toFixed(2)}</span>
        </div>
        {store === lowestTotalStore && (
          <Badge className="mt-1 text-[10px] bg-white text-green-700">Best Price</Badge>
        )}
      </div>
    );
  };

  return (
    <div className={`w-full ${isMobile ? 'fixed bottom-16 left-0 z-30' : 'mb-4'}`}>
      <Card className="rounded-lg shadow-lg border-t md:border border-gray-300">
        <CardContent className="p-3 md:p-4 bg-gray-50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-app-green text-white p-2 rounded-full">
                <ShoppingBasket size={18} />
              </div>
              <div>
                <div className="text-xs font-medium">Comparing</div>
                <div className="font-bold text-sm">{selectedProducts.length} Products</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 md:gap-3 flex-1 max-w-xs">
              {Object.entries(totals).slice(0, 3).map(([store, value]) => (
                <div key={store}>
                  {formatStoreTotal(store, value)}
                </div>
              ))}
            </div>
            
            <Link to="/basket">
              <Button size="sm" className="h-10 bg-app-green hover:bg-app-green/90">View Basket</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonBar;
