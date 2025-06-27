
import React, { useContext } from 'react';
import { getNewArrivals } from '@/data/products';
import { Sparkles, Star, Zap, Crown } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';
import { ProductSelectionContext } from '@/contexts/ProductSelectionContext';

const NewArrivals = () => {
  const newArrivals = getNewArrivals(12);
  const isMobile = useIsMobile();
  const { toggleProductSelection } = useContext(ProductSelectionContext);

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

  const handleProductClick = (productId: number) => {
    toggleProductSelection(productId);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3 px-2">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        <h2 className="text-lg font-bold">New Arrivals</h2>
      </div>
      <div className="px-1">
        <Carousel
          opts={{
            align: "start",
            loop: false,
            containScroll: false,
            slidesToScroll: isMobile ? 2 : 3,
            dragFree: true
          }}
          className="w-full"
        >
          <CarouselContent className="pb-1 -ml-1">
            {newArrivals.map((product, index) => {
              const statusBadge = getStatusBadge(index);
              const isLast = index === newArrivals.length - 1;
              
              return (
                <CarouselItem 
                  key={product.id} 
                  className={`basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-1 ${
                    !isLast ? 'pr-0' : 'pr-1'
                  }`}
                >
                  <div 
                    className={`flex flex-col items-center py-2 px-1 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 h-full cursor-pointer hover:scale-105 ${
                      !isLast ? 'opacity-100' : 'opacity-100'
                    }`}
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="relative w-10 h-10 mb-1">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover rounded-full border-2 border-gray-100 shadow-sm bg-white"
                      />
                    </div>
                    <h3 className="font-medium text-center text-[9px] mb-1 line-clamp-2 leading-tight min-h-[1.5rem] px-0.5">
                      {product.name}
                    </h3>
                    <p className="text-[8px] text-gray-500 text-center mb-1">{product.category}</p>
                    <div className={`text-[7px] px-1 py-0.5 rounded-full flex items-center ${statusBadge.color}`}>
                      {statusBadge.icon}
                      {statusBadge.text}
                    </div>
                  </div>
                  {/* Sneak peek of next card */}
                  {!isLast && (
                    <div className="absolute right-0 top-0 w-6 h-full opacity-30 pointer-events-none z-10">
                      <div className="w-full h-full bg-gradient-to-l from-gray-200 to-transparent"></div>
                    </div>
                  )}
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
