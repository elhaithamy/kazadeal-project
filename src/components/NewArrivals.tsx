
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
          text: "New",
          icon: <Star className="h-2.5 w-2.5 mr-1" />,
          color: "bg-gradient-to-r from-green-500 to-green-400 text-white"
        };
      case 1:
        return {
          text: "Offer",
          icon: <Zap className="h-2.5 w-2.5 mr-1" />,
          color: "bg-gradient-to-r from-orange-500 to-orange-400 text-white"
        };
      case 2:
        return {
          text: "Exclusive",
          icon: <Crown className="h-2.5 w-2.5 mr-1" />,
          color: "bg-gradient-to-r from-purple-500 to-purple-400 text-white"
        };
      default:
        return {
          text: "New",
          icon: <Star className="h-2.5 w-2.5 mr-1" />,
          color: "bg-gradient-to-r from-green-500 to-green-400 text-white"
        };
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4 px-4">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        <h2 className="text-lg font-bold">New Arrivals</h2>
      </div>
      <div className="relative px-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            containScroll: false,
            slidesToScroll: isMobile ? 2 : 3
          }}
          className="w-full"
        >
          <CarouselContent className="pb-2 -ml-3">
            {newArrivals.map((product, index) => {
              const statusBadge = getStatusBadge(index);
              return (
                <CarouselItem 
                  key={product.id} 
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 pl-3"
                >
                  <div className="flex flex-col items-center py-4 px-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                    <div className="relative w-14 h-14 mb-3">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover rounded-full border-2 border-gray-100 shadow-sm bg-white"
                      />
                    </div>
                    <h3 className="font-medium text-center text-xs mb-2 line-clamp-2 leading-relaxed tracking-wide min-h-[2.5rem] px-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 text-center mb-3">{product.category}</p>
                    <div className={`text-[9px] px-2 py-1 rounded-full flex items-center ${statusBadge.color}`}>
                      {statusBadge.icon}
                      {statusBadge.text}
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-8 z-10 bg-white shadow-md hover:bg-gray-50" />
          <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 z-10 bg-white shadow-md hover:bg-gray-50" />
        </Carousel>
      </div>
    </div>
  );
};

export default NewArrivals;
