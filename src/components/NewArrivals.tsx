
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

const NewArrivals = () => {
  const newArrivals = getNewArrivals(5);
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        <h2 className="text-xl font-bold">New Arrivals</h2>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {newArrivals.map((product) => (
            <CarouselItem 
              key={product.id} 
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 mb-3">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <h3 className="font-medium text-center mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 text-center">{product.category}</p>
                    <div className="mt-3 text-xs text-app-green font-medium">
                      NEW IN STORES
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {!isMobile && (
          <>
            <CarouselPrevious className="left-0 lg:-left-12" />
            <CarouselNext className="right-0 lg:-right-12" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default NewArrivals;
