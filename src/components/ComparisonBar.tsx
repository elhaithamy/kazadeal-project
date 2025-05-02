
import React from 'react';
import { ShoppingBasket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

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

  const formatStoreTotal = (store: string, value: number) => {
    let bgColorClass = '';
    let textColorClass = '';
    
    if (priceRankings[store]) {
      switch (priceRankings[store]) {
        case 'lowest':
          bgColorClass = 'bg-app-green/10';
          textColorClass = 'text-app-green';
          break;
        case 'medium':
          bgColorClass = 'bg-yellow-400/10';
          textColorClass = 'text-yellow-600';
          break;
        case 'highest':
          bgColorClass = 'bg-red-500/10';
          textColorClass = 'text-red-600';
          break;
      }
    }

    return (
      <div className={`flex flex-col items-center p-1 rounded ${bgColorClass}`}>
        <span className="text-xs text-gray-500 capitalize">{store}</span>
        <span className={`font-bold ${textColorClass}`}>{value.toFixed(2)}</span>
        {store === lowestTotalStore && <Badge className="bg-app-green mt-1 text-[10px]">Lowest</Badge>}
      </div>
    );
  };

  return (
    // Remove sticky positioning for desktop
    <div className={`w-full bottom-16 left-0 z-30 ${isMobile ? 'fixed' : ''}`}>
      <Card className="rounded-none md:rounded-lg shadow-lg border-t md:border">
        <CardContent className="p-3 md:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-app-green text-white p-2 rounded-full">
                <ShoppingBasket size={16} />
              </div>
              <div>
                <div className="text-xs font-medium">Comparing</div>
                <div className="font-bold text-sm">{selectedProducts.length} Products</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-1 md:gap-2 flex-1 max-w-xs">
              {Object.entries(totals).slice(0, 3).map(([store, value]) => (
                <div key={store}>
                  {formatStoreTotal(store, value)}
                </div>
              ))}
            </div>
            
            <Button size="sm" className="h-10">View Basket</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonBar;
