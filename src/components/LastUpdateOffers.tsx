
import React, { useContext } from 'react';
import { Tag, Clock, Star, ThumbsUp, TrendingUp } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';
import ProductTag from '@/components/ProductTag';
import { ProductSelectionContext } from '@/contexts/ProductSelectionContext';

interface OfferItem {
  id: number;
  store: string;
  title: string;
  expiry: string;
  description: string;
  color: string;
  badge?: string;
  badgeType?: 'hot' | 'best' | 'trending';
  image: string;
  productId: number; // Link to actual product for adding to comparison
}

const offers: OfferItem[] = [
  {
    id: 1,
    store: 'LuLu',
    title: '20% Off Fresh Produce',
    expiry: '25 Apr 2025',
    description: 'Get 20% off all fresh fruits and vegetables',
    color: 'bg-app-green',
    badge: 'Best Deal',
    badgeType: 'best',
    image: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    productId: 1
  },
  {
    id: 2,
    store: 'Othaim',
    title: 'Buy 1 Get 1 Free',
    expiry: '30 Apr 2025',
    description: 'On selected dairy products and bakery items',
    color: 'bg-red-600',
    badge: 'Hot Deal',
    badgeType: 'hot',
    image: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    productId: 2
  },
  {
    id: 3,
    store: 'Carrefour',
    title: '30% Off Kitchen Items',
    expiry: '22 Apr 2025',
    description: 'Special discount on all kitchenware',
    color: 'bg-blue-600',
    badge: 'Trending',
    badgeType: 'trending',
    image: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    productId: 3
  },
  {
    id: 4,
    store: 'Danube',
    title: '15% Off Household',
    expiry: '28 Apr 2025',
    description: 'Cleaning supplies and organization items',
    color: 'bg-yellow-500',
    image: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    productId: 4
  },
  {
    id: 5,
    store: 'Panda',
    title: '25% Off Frozen Foods',
    expiry: '23 Apr 2025',
    description: 'All frozen meals and vegetables on discount',
    color: 'bg-red-500',
    badge: 'Hot Deal',
    badgeType: 'hot',
    image: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    productId: 5
  },
  {
    id: 6,
    store: 'Tamimi',
    title: '10% Off Personal Care',
    expiry: '29 Apr 2025',
    description: 'Shampoo, soap, and personal hygiene products',
    color: 'bg-gray-700',
    image: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png',
    productId: 6
  },
];

const LastUpdateOffers = () => {
  const isMobile = useIsMobile();
  const { toggleProductSelection } = useContext(ProductSelectionContext);

  const handleOfferClick = (offer: OfferItem) => {
    toggleProductSelection(offer.productId);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3 px-2">
        <Tag className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-bold">Latest Offers</h2>
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
            {offers.map((offer, index) => {
              const isLast = index === offers.length - 1;
              
              return (
                <CarouselItem 
                  key={offer.id} 
                  className={`basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-1 ${
                    !isLast ? 'pr-0' : 'pr-1'
                  }`}
                >
                  <div 
                    className={`flex flex-col items-center py-2 px-1 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 h-full cursor-pointer hover:scale-105 ${
                      !isLast ? 'opacity-100' : 'opacity-100'
                    }`}
                    onClick={() => handleOfferClick(offer)}
                  >
                    <div className="relative w-10 h-10 mb-1">
                      <img 
                        src={offer.image} 
                        alt={offer.title} 
                        className="w-full h-full object-cover rounded-full border-2 border-gray-100 shadow-sm bg-white"
                      />
                      {offer.badge && (
                        <div className="absolute -top-0.5 -right-0.5">
                          <ProductTag type={offer.badgeType === 'hot' ? 'hot-deal' : (offer.badgeType === 'best' ? 'bestseller' : 'bulky')} />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-center text-[9px] mb-1 line-clamp-2 leading-tight min-h-[1.5rem] px-0.5">
                      {offer.title}
                    </h3>
                    <p className="text-[8px] text-gray-500 text-center mb-1">{offer.store}</p>
                    <div className="text-[7px] flex items-center bg-gray-100 px-1 py-0.5 rounded-full">
                      <Clock className="h-1.5 w-1.5 mr-0.5 text-gray-500" />
                      <span className="font-medium text-gray-700">Expires: {offer.expiry}</span>
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

export default LastUpdateOffers;
