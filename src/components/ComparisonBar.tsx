
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
          bgColorClass = 'bg-app-green/20';
          textColorClass = 'text-app-green font-bold';
          break;
        case 'medium':
          bgColorClass = 'bg-yellow-400/20';
          textColorClass = 'text-yellow-600 font-bold';
          break;
        case 'highest':
          bgColorClass = 'bg-red-500/20';
          textColorClass = 'text-red-600 font-bold';
          break;
      }
    }

    return (
      <div className={`flex flex-col items-center p-2 rounded-lg ${bgColorClass}`}>
        <span className="text-xs text-gray-700 font-medium capitalize">{store}</span>
        <span className={`font-bold ${textColorClass} text-base`}>{value.toFixed(2)}</span>
        {store === lowestTotalStore && <Badge className="bg-app-green mt-1 text-[10px]">Best Price</Badge>}
      </div>
    );
  };

  return (
    <div className={`w-full bottom-16 left-0 z-30 ${isMobile ? 'fixed' : ''}`}>
      <Card className="rounded-lg shadow-lg border-t md:border">
        <CardContent className="p-3 md:p-4">
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
            
            <Button size="sm" className="h-10 bg-app-green hover:bg-app-green/90">View Basket</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonBar;
