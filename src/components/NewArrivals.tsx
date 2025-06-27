
import React from 'react';
import { getNewArrivals } from '@/data/products';
import { Sparkles, Star, Zap, Crown } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
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
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3 px-2">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        <h2 className="text-lg font-bold">New Arrivals</h2>
      </div>
      <div className="px-2">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            containScroll: false,
            slidesToScroll: isMobile ? 2 : 3
          }}
          className="w-full"
        >
          <CarouselContent className="pb-1 -ml-2">
            {newArrivals.map((product, index) => {
              const statusBadge = getStatusBadge(index);
              return (
                <CarouselItem 
                  key={product.id} 
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-2"
                >
                  <div className="flex flex-col items-center py-3 px-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 h-full">
                    <div className="relative w-12 h-12 mb-2">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover rounded-full border-2 border-gray-100 shadow-sm bg-white"
                      />
                    </div>
                    <h3 className="font-medium text-center text-[10px] mb-2 line-clamp-2 leading-tight min-h-[2rem] px-1">
                      {product.name}
                    </h3>
                    <p className="text-[9px] text-gray-500 text-center mb-2">{product.category}</p>
                    <div className={`text-[8px] px-1.5 py-0.5 rounded-full flex items-center ${statusBadge.color}`}>
                      {statusBadge.icon}
                      {statusBadge.text}
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default NewArrivals;
