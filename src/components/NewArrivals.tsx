
import React from 'react';
import { getNewArrivals } from '@/data/products';
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
    <div>
      <div className="flex items-center gap-2 mb-3 px-2 pt-2">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        <h2 className="text-xl font-bold">New Arrivals</h2>
      </div>
      <div className="relative pb-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            containScroll: false
          }}
          className="w-full"
        >
          <CarouselContent className="pb-1">
            {newArrivals.map((product) => (
              <CarouselItem 
                key={product.id} 
                className="basis-2/3 sm:basis-2/5 md:basis-1/3 lg:basis-1/4 px-1 md:px-2"
              >
                <div className="flex flex-col items-center py-3 px-1 hover-scale">
                  <div className="relative w-12 h-12 mb-2">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover rounded-full border border-gray-200 shadow-sm bg-white"
                    />
                    <div className="absolute -top-2 -right-2">
                      <ProductTag type="new" />
                    </div>
                  </div>
                  <h3 className="font-medium text-center text-xs mb-1 line-clamp-2 leading-relaxed tracking-wide min-h-[3rem]">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 text-center mb-2">{product.category}</p>
                  <div className="mt-auto text-xs text-app-green font-bold bg-app-green/10 px-2 py-0.5 rounded-full flex items-center">
                    <Star className="h-3 w-3 mr-1 text-app-green" />
                    NEW IN STORES
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex w-full justify-between px-8 absolute bottom-0 left-0 right-0">
            <CarouselPrevious className="static relative bottom-0 left-0 -translate-y-0 h-8 w-8" />
            <CarouselNext className="static relative bottom-0 right-0 -translate-y-0 h-8 w-8" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default NewArrivals;
