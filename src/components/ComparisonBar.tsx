
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

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

const ComparisonBar: React.FC<ComparisonBarProps> = ({
  totals,
  selectedProducts,
  priceRankings,
  lowestTotalStore,
}) => {
  const getLowestStoreDisplay = () => {
    return {
      name: lowestTotalStore.charAt(0).toUpperCase() + lowestTotalStore.slice(1),
      total: totals[lowestTotalStore as keyof typeof totals].toFixed(2),
    };
  };

  const getRankingColorClass = (store: string) => {
    if (!priceRankings[store] || selectedProducts.length <= 1) return '';
    
    switch (priceRankings[store]) {
      case 'lowest':
        return 'bg-app-green text-white';
      case 'medium':
        return 'bg-yellow-400';
      case 'highest':
        return 'bg-red-500 text-white';
      default:
        return '';
    }
  };

  const getRankingBadge = (store: string) => {
    if (!priceRankings[store] || selectedProducts.length <= 1) return null;
    
    switch (priceRankings[store]) {
      case 'lowest':
        return <Badge className="ml-2 bg-app-green">Lowest</Badge>;
      case 'medium':
        return <Badge className="ml-2 bg-yellow-400">Medium</Badge>;
      case 'highest':
        return <Badge className="ml-2 bg-red-500">Highest</Badge>;
      default:
        return null;
    }
  };

  const ComparisonContent = () => (
    <div className="space-y-3">
      <h3 className="text-lg font-bold mb-4 text-gray-800">
        {selectedProducts.length > 0 ? 'Selected Products Total' : 'All Products Total'}
      </h3>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        {Object.entries(totals).map(([store, total]) => (
          <Card
            key={store}
            className={`${getRankingColorClass(store)} ${
              lowestTotalStore === store ? 'border-2 border-app-green' : ''
            }`}
          >
            <CardContent className="p-3">
              <div className={`text-sm font-medium flex items-center justify-between ${
                priceRankings[store] === 'lowest' || priceRankings[store] === 'highest'
                  ? 'text-white'
                  : 'text-gray-500'
              }`}>
                <span className="capitalize">{store}</span>
                {getRankingBadge(store)}
              </div>
              <div className={`text-xl font-bold ${
                lowestTotalStore === store ? 'text-app-green' : ''
              } ${
                priceRankings[store] === 'lowest' || priceRankings[store] === 'highest'
                  ? 'text-white'
                  : ''
              }`}>
                {total.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProducts.length > 0 && (
        <Button 
          variant="default"
          className="w-full bg-app-green hover:bg-app-green/90 relative overflow-hidden h-16 shadow-md"
        >
          <div className="flex items-center justify-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <div className="flex flex-col items-start">
              <span className="text-lg font-bold">{getLowestStoreDisplay().total}</span>
              <span className="text-xs opacity-90">Best price at {getLowestStoreDisplay().name}</span>
            </div>
          </div>
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop view - Sticky vertical bar */}
      <div className="hidden lg:block fixed right-4 top-20 w-72 z-40">
        <Card className="bg-white shadow-lg border border-green-100">
          <CardContent className="p-4">
            <ComparisonContent />
          </CardContent>
        </Card>
      </div>

      {/* Mobile view - Drawer with floating button */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              size="icon"
              className="h-16 w-16 rounded-full bg-app-green hover:bg-app-green/90 shadow-lg"
            >
              {selectedProducts.length > 0 ? (
                <div className="flex flex-col items-center justify-center text-xs">
                  <ShoppingCart className="h-6 w-6 mb-1" />
                  <span className="font-bold">{getLowestStoreDisplay().total}</span>
                </div>
              ) : (
                <ShoppingCart className="h-6 w-6" />
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="p-4 max-w-lg mx-auto">
              <ComparisonContent />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};

export default ComparisonBar;
