
import React from 'react';
import { Tag, Clock, Star, ThumbsUp, TrendingUp } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';
import ProductTag from '@/components/ProductTag';

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
    image: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png'
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
    image: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png'
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
    image: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png'
  },
  {
    id: 4,
    store: 'Danube',
    title: '15% Off Household',
    expiry: '28 Apr 2025',
    description: 'Cleaning supplies and organization items',
    color: 'bg-yellow-500',
    image: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png'
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
    image: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png'
  },
  {
    id: 6,
    store: 'Tamimi',
    title: '10% Off Personal Care',
    expiry: '29 Apr 2025',
    description: 'Shampoo, soap, and personal hygiene products',
    color: 'bg-gray-700',
    image: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png'
  },
];

const LastUpdateOffers = () => {
  const isMobile = useIsMobile();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4 px-4">
        <Tag className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-bold">Latest Offers</h2>
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
            {offers.map((offer) => (
              <CarouselItem 
                key={offer.id} 
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 pl-3"
              >
                <div className="flex flex-col items-center py-4 px-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                  <div className="relative w-14 h-14 mb-3">
                    <img 
                      src={offer.image} 
                      alt={offer.title} 
                      className="w-full h-full object-cover rounded-full border-2 border-gray-100 shadow-sm bg-white"
                    />
                    {offer.badge && (
                      <div className="absolute -top-1 -right-1">
                        <ProductTag type={offer.badgeType === 'hot' ? 'hot-deal' : (offer.badgeType === 'best' ? 'bestseller' : 'bulky')} />
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-center text-xs mb-2 line-clamp-2 leading-relaxed tracking-wide min-h-[2.5rem] px-1">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-gray-500 text-center mb-3">{offer.store}</p>
                  <div className="text-[9px] flex items-center bg-gray-100 px-2 py-1 rounded-full">
                    <Clock className="h-2.5 w-2.5 mr-1 text-gray-500" />
                    <span className="font-medium text-gray-700">Expires: {offer.expiry}</span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-8 z-10 bg-white shadow-md hover:bg-gray-50" />
          <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 z-10 bg-white shadow-md hover:bg-gray-50" />
        </Carousel>
      </div>
    </div>
  );
};

export default LastUpdateOffers;
