
import React from 'react';
import { getNewArrivals } from '@/data/products';
import { Sparkles, Star, Zap, Crown } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';

const NewArrivals = () => {
  const newArrivals = getNewArrivals(12);
  const isMobile = useIsMobile();

  const getStatusBadge = (index: number) => {
    const statusType = index % 3;
    switch (statusType) {
      case 0:
        return {
          text: "New Arrival",
          icon: <Star className="h-3 w-3 mr-1" />,
          color: "bg-gradient-to-r from-green-500 to-green-400 text-white"
        };
      case 1:
        return {
          text: "New Offer",
          icon: <Zap className="h-3 w-3 mr-1" />,
          color: "bg-gradient-to-r from-orange-500 to-orange-400 text-white"
        };
      case 2:
        return {
          text: "Exclusive Deal",
          icon: <Crown className="h-3 w-3 mr-1" />,
          color: "bg-gradient-to-r from-purple-500 to-purple-400 text-white"
        };
      default:
        return {
          text: "New Arrival",
          icon: <Star className="h-3 w-3 mr-1" />,
          color: "bg-gradient-to-r from-green-500 to-green-400 text-white"
        };
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 px-2 pt-2">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        <h2 className="text-xl font-bold">New Arrivals</h2>
      </div>
      <div className="relative px-8">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            containScroll: false
          }}
          className="w-full"
        >
          <CarouselContent className="pb-1">
            {newArrivals.map((product, index) => {
              const statusBadge = getStatusBadge(index);
              return (
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
                    </div>
                    <h3 className="font-medium text-center text-xs mb-1 line-clamp-2 leading-relaxed tracking-wide min-h-[3rem]">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 text-center mb-2">{product.category}</p>
                    <div className={`mt-auto text-[10px] px-2 py-1 rounded-full flex items-center ${statusBadge.color}`}>
                      {statusBadge.icon}
                      {statusBadge.text}
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 z-10" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 z-10" />
        </Carousel>
      </div>
    </div>
  );
};

export default NewArrivals;
