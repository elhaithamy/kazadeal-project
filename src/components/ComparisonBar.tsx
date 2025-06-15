
import React from 'react';
import { ShoppingBasket, Save } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

import { products } from '@/data/products';

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
  const { toast } = useToast();

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

  // Retailer display names for tooltips
  const retailerNames = {
    lulu: 'LuLu',
    othaim: 'Othaim',
    carrefour: 'Carrefour',
    danube: 'Danube',
    panda: 'Panda',
    tamimi: 'Tamimi'
  };

  const formatStoreTotal = (store: string, value: number) => {
    const storeColor = retailerColors[store as keyof typeof retailerColors] || '#6E59A5';
    const storeName = retailerNames[store as keyof typeof retailerNames];

    return (
      <div className="flex flex-col items-center">
        <div
          className="rounded-lg p-2 w-full text-center shadow-sm relative"
          style={{ backgroundColor: storeColor }}
          title={`${storeName}: ${value.toFixed(2)}`}
        >
          <span className="text-white font-bold text-xs md:text-base">{value.toFixed(2)}</span>
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-1 rounded text-[8px] border border-gray-200">
            {storeName}
          </div>
        </div>
        {store === lowestTotalStore && (
          <Badge className="mt-1 text-[10px] bg-white text-green-700">Best Price</Badge>
        )}
      </div>
    );
  };

  const handleSaveList = () => {
    const now = new Date();
    const saveDate = now.toLocaleDateString();

    toast({
      title: "Cart saved!",
      description: `Your selection has been saved (${saveDate})`,
    });
  };

  // Compact product card for the cart slider
  const renderProductCard = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return null;
    return (
      <div className="flex flex-col items-center justify-center bg-white border rounded-lg shadow px-2 py-2 w-28 md:w-32 h-32 md:h-36 mx-auto">
        <img
          src={product.image}
          alt={product.name}
          className="w-12 h-12 object-cover mb-1 rounded"
        />
        <div className="text-xs font-bold text-center mb-1 line-clamp-2 w-full">{product.name}</div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500 text-xs">Qty:</span>
          <span className="bg-app-green text-white px-2 py-0.5 rounded-full text-xs font-semibold">{1}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full ${isMobile ? 'fixed bottom-16 left-0 z-30 h-auto max-h-44' : 'mb-4'}`}>
      <Card className="rounded-lg shadow-lg border-t md:border border-gray-300">
        <CardContent className="p-3 md:p-4 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex items-center gap-2 mb-1 md:mb-0">
              <div className="bg-app-green text-white p-2 rounded-full">
                <ShoppingBasket size={18} />
              </div>
              <div>
                <div className="text-xs font-medium">Comparing</div>
                <div className="font-bold text-sm">{selectedProducts.length} Products</div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <Carousel
                opts={{
                  align: "start",
                  dragFree: true,
                  slidesToScroll: isMobile ? 2 : 3,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {selectedProducts.map((id) => (
                    <CarouselItem
                      className="basis-1/2 md:basis-1/4 px-1"
                      key={id}
                    >
                      {renderProductCard(id)}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {selectedProducts.length > (isMobile ? 2 : 4) && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 flex-1 max-w-none md:max-w-md my-2 md:my-0">
              {Object.entries(totals).map(([store, value]) => (
                <div key={store} className="text-center">
                  {formatStoreTotal(store, value)}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-10 flex items-center gap-1"
                onClick={handleSaveList}
              >
                <Save size={16} />
                <span>Save</span>
              </Button>
              <Link to="/checklist">
                <Button size="sm" className="h-10 bg-app-green hover:bg-app-green/90">View Saved</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonBar;

