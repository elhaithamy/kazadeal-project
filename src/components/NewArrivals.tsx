
import React from 'react';
import { getNewArrivals } from '@/data/products';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Star } from 'lucide-react';
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
  const newArrivals = getNewArrivals(8);
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-3 rounded-xl card-gradient shadow border border-app-green/30">
      <div className="flex items-center gap-2 mb-3 px-3 pt-3">
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
        <CarouselContent className="-ml-1 md:-ml-2 pb-2">
          {newArrivals.map((product) => (
            <CarouselItem 
              key={product.id} 
              className="pl-1 md:pl-2 basis-2/3 sm:basis-2/5 md:basis-1/3 lg:basis-1/4"
            >
              <Card className="hover:shadow-lg transition-shadow h-full rounded-xl border-2 border-transparent bg-white/90 card-gradient">
                <CardContent className="p-3">
                  <div className="flex flex-col items-center">
                    <div className="relative w-14 h-14 mb-2">
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
                    <div className="mt-2 text-xs bg-gradient-to-r from-green-500 to-green-400 text-white px-2 py-0.5 rounded-full flex items-center">
                      <Star className="h-3 w-3 mr-1" />
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
