
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
    <div>
      <div className="flex items-center gap-2 mb-3 px-2 pt-2">
        <Tag className="h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-bold">Latest Offers</h2>
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
            {offers.map((offer) => (
              <CarouselItem 
                key={offer.id} 
                className="basis-2/3 sm:basis-2/5 md:basis-1/3 lg:basis-1/4 px-1 md:px-2"
              >
                <div className="flex flex-col items-center py-3 px-1 hover-scale">
                  <div className="relative w-12 h-12 mb-2">
                    <img 
                      src={offer.image} 
                      alt={offer.title} 
                      className="w-full h-full object-cover rounded-full border border-gray-200 shadow-sm bg-white"
                    />
                    {offer.badge && (
                      <div className="absolute -top-2 -right-2">
                        <ProductTag type={offer.badgeType === 'hot' ? 'hot-deal' : (offer.badgeType === 'best' ? 'bestseller' : 'bulky')} />
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-center text-xs mb-1 line-clamp-2 leading-relaxed tracking-wide min-h-[3rem]">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-gray-500 text-center mb-2">{offer.store}</p>
                  <div className="mt-auto text-xs flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-gray-500" />
                    <span className="font-medium text-gray-700">Expires: {offer.expiry}</span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 z-10" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 z-10" />
        </Carousel>
      </div>
    </div>
  );
};

export default LastUpdateOffers;
