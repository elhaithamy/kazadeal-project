
import React from 'react';
import { getNewArrivals } from '@/data/products';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';
import ProductTag from '@/components/ProductTag';

const NewArrivals = () => {
  const newArrivals = getNewArrivals(5);
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        <h2 className="text-xl font-bold">New Arrivals</h2>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
          containScroll: false
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-3">
          {newArrivals.map((product) => (
            <CarouselItem 
              key={product.id} 
              className="pl-2 md:pl-3 basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-3">
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 mb-2">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover rounded-full border-2 border-app-green shadow-md"
                      />
                      <div className="absolute -top-2 -right-2">
                        <ProductTag type="new" />
                      </div>
                    </div>
                    <h3 className="font-medium text-center text-sm mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 text-center">{product.category}</p>
                    <div className="mt-2 text-xs bg-gradient-to-r from-green-500 to-green-400 text-white px-2 py-0.5 rounded-full">
                      NEW IN STORES
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="left-0 lg:-left-6" />
        <CarouselNext className="right-0 lg:-right-6" />
      </Carousel>
    </div>
  );
};

export default NewArrivals;
