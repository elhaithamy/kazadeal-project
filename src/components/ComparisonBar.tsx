import React, { useState, useEffect } from 'react';
import { ShoppingBasket, List, EyeOff, Eye } from 'lucide-react';
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
  const [isHidden, setIsHidden] = useState(false);
  const [autoHideTimeout, setAutoHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [savedListsCount, setSavedListsCount] = useState(1);

  // Auto-hide effect when products are added
  useEffect(() => {
    if (selectedProducts.length > 0) {
      // Clear existing timeout
      if (autoHideTimeout) {
        clearTimeout(autoHideTimeout);
      }

      // Set new timeout for 5 seconds
      const timeout = setTimeout(() => {
        setIsHidden(true);
      }, 5000);

      setAutoHideTimeout(timeout);
      setIsHidden(false); // Show the bar when products are added
    }

    return () => {
      if (autoHideTimeout) {
        clearTimeout(autoHideTimeout);
      }
    };
  }, [selectedProducts.length]);

  if (selectedProducts.length === 0) {
    return null;
  }

  // Color palette for retailers
  const retailerColors = {
    lulu: '#0EA5E9',
    othaim: '#9b87f5',
    carrefour: '#F97316',
    danube: '#1EAEDB',
    panda: '#7E69AB',
    tamimi: '#6E59A5',
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
          className="rounded-lg p-1.5 w-full text-center shadow-sm relative"
          style={{ backgroundColor: storeColor }}
          title={`${storeName}: ${value.toFixed(2)}`}
        >
          <span className="text-white font-bold text-xs">{value.toFixed(2)}</span>
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white px-1 rounded text-[8px] border border-gray-200">
            {storeName}
          </div>
        </div>
        {store === lowestTotalStore && (
          <Badge className="mt-1 text-[8px] bg-white text-green-700">Best</Badge>
        )}
      </div>
    );
  };

  const handleAddToList = () => {
    const now = new Date();
    const saveDate = now.toLocaleDateString();
    const listName = `List ${savedListsCount} - ${saveDate}`;

    // In a real app, this would save to database
    const savedList = {
      name: listName,
      products: selectedProducts,
      createdAt: now,
    };

    console.log('Saving list:', savedList);
    setSavedListsCount(prev => prev + 1);

    toast({
      title: "Added to Lists!",
      description: `"${listName}" has been created with ${selectedProducts.length} products`,
    });
  };

  const handleToggleVisibility = () => {
    setIsHidden(!isHidden);
    if (autoHideTimeout) {
      clearTimeout(autoHideTimeout);
    }
  };

  // Compact product card for the cart slider
  const renderProductCard = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return null;
    return (
      <div className="flex flex-col items-center justify-center bg-white border rounded-lg shadow-sm px-1.5 py-1.5 w-16 h-20 mx-auto">
        <img
          src={product.image}
          alt={product.name}
          className="w-6 h-6 object-cover mb-1 rounded"
        />
        <div className="text-[8px] font-medium text-center mb-1 line-clamp-2 w-full leading-tight">{product.name}</div>
        <div className="flex items-center gap-0.5">
          <span className="bg-app-green text-white px-1 py-0.5 rounded-full text-[7px] font-semibold">1</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full transition-transform duration-300 ${isHidden ? 'translate-y-full' : 'translate-y-0'} ${isMobile ? 'fixed bottom-16 left-0 z-40' : 'fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-4xl z-40'} bg-white border-t md:border border-gray-200 shadow-lg ${!isMobile ? 'rounded-lg' : ''}`}>
      <Card className="rounded-none md:rounded-lg shadow-md border-0 md:border border-gray-300">
        <CardContent className="p-2 bg-gray-50">
          <div className="flex flex-col gap-2">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-app-green text-white p-1.5 rounded-full">
                  <ShoppingBasket size={12} />
                </div>
                <div>
                  <div className="text-[10px] font-medium">Comparing</div>
                  <div className="font-bold text-xs">{selectedProducts.length} Products</div>
                </div>
              </div>
              
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 flex items-center gap-1 text-[10px] px-2"
                  onClick={handleAddToList}
                >
                  <List size={10} />
                  <span>Add to List</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 flex items-center gap-1 text-[10px] px-2"
                  onClick={handleToggleVisibility}
                >
                  <EyeOff size={10} />
                  <span>Hide</span>
                </Button>
                <Link to="/basket">
                  <Button size="sm" className="h-6 bg-app-green hover:bg-app-green/90 text-[10px] px-2">View</Button>
                </Link>
              </div>
            </div>

            {/* Products Slider */}
            <div className="flex-1 min-w-0 mb-1">
              <Carousel
                opts={{
                  align: "start",
                  dragFree: true,
                  slidesToScroll: isMobile ? 3 : 4,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-1">
                  {selectedProducts.map((id) => (
                    <CarouselItem
                      className="basis-1/4 md:basis-1/6 pl-1"
                      key={id}
                    >
                      {renderProductCard(id)}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {selectedProducts.length > (isMobile ? 4 : 6) && (
                  <>
                    <CarouselPrevious className="left-0 h-5 w-5" />
                    <CarouselNext className="right-0 h-5 w-5" />
                  </>
                )}
              </Carousel>
            </div>

            {/* Store Totals */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 flex-1 max-w-none">
              {Object.entries(totals).map(([store, value]) => (
                <div key={store} className="text-center">
                  {formatStoreTotal(store, value)}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Show button when hidden */}
      {isHidden && (
        <div className={`${isMobile ? 'fixed bottom-16 right-4 z-50' : 'fixed bottom-4 right-4 z-50'}`}>
          <Button
            size="sm"
            className="bg-app-green hover:bg-app-green/90 rounded-full p-2"
            onClick={handleToggleVisibility}
          >
            <Eye size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ComparisonBar;
