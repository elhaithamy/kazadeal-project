
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
      <div className="flex flex-col items-center justify-center bg-white border rounded-lg shadow px-2 py-2 w-24 md:w-28 h-28 md:h-32 mx-auto">
        <img
          src={product.image}
          alt={product.name}
          className="w-10 h-10 object-cover mb-1 rounded"
        />
        <div className="text-[10px] font-bold text-center mb-1 line-clamp-2 w-full">{product.name}</div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500 text-[8px]">Qty:</span>
          <span className="bg-app-green text-white px-1.5 py-0.5 rounded-full text-[8px] font-semibold">{1}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full ${isMobile ? 'fixed bottom-16 left-0 z-40 bg-white border-t-2 border-app-green shadow-2xl' : 'mb-4'}`}>
      <Card className="rounded-none md:rounded-lg shadow-lg border-0 md:border border-gray-300">
        <CardContent className="p-2 md:p-4 bg-gray-50">
          <div className="flex flex-col gap-2">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-app-green text-white p-2 rounded-full">
                  <ShoppingBasket size={16} />
                </div>
                <div>
                  <div className="text-xs font-medium">Comparing</div>
                  <div className="font-bold text-sm">{selectedProducts.length} Products</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 flex items-center gap-1 text-xs"
                  onClick={handleSaveList}
                >
                  <Save size={14} />
                  <span>Save</span>
                </Button>
                <Link to="/checklist">
                  <Button size="sm" className="h-8 bg-app-green hover:bg-app-green/90 text-xs">View</Button>
                </Link>
              </div>
            </div>

            {/* Products Slider */}
            <div className="flex-1 min-w-0 mb-2">
              <Carousel
                opts={{
                  align: "start",
                  dragFree: true,
                  slidesToScroll: isMobile ? 2 : 3,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2">
                  {selectedProducts.map((id) => (
                    <CarouselItem
                      className="basis-1/3 md:basis-1/4 pl-2"
                      key={id}
                    >
                      {renderProductCard(id)}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {selectedProducts.length > (isMobile ? 3 : 4) && (
                  <>
                    <CarouselPrevious className="left-0 h-6 w-6" />
                    <CarouselNext className="right-0 h-6 w-6" />
                  </>
                )}
              </Carousel>
            </div>

            {/* Store Totals */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 flex-1 max-w-none">
              {Object.entries(totals).map(([store, value]) => (
                <div key={store} className="text-center">
                  {formatStoreTotal(store, value)}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonBar;
