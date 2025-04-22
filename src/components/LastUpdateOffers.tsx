
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

interface OfferItem {
  id: number;
  store: string;
  title: string;
  expiry: string;
  description: string;
  color: string;
  badge?: string;
  badgeType?: 'hot' | 'best' | 'trending';
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
  },
  {
    id: 4,
    store: 'Danube',
    title: '15% Off Household',
    expiry: '28 Apr 2025',
    description: 'Cleaning supplies and organization items',
    color: 'bg-yellow-500',
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
  },
  {
    id: 6,
    store: 'Tamimi',
    title: '10% Off Personal Care',
    expiry: '29 Apr 2025',
    description: 'Shampoo, soap, and personal hygiene products',
    color: 'bg-gray-700',
  },
];

const getBadgeIcon = (type?: 'hot' | 'best' | 'trending') => {
  switch (type) {
    case 'hot':
      return <Star className="h-3 w-3 mr-1 text-red-500" />;
    case 'best':
      return <ThumbsUp className="h-3 w-3 mr-1 text-app-green" />;
    case 'trending':
      return <TrendingUp className="h-3 w-3 mr-1 text-blue-500" />;
    default:
      return null;
  }
};

const LastUpdateOffers = () => {
  const isMobile = useIsMobile();

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 px-2 pt-2">
        <Tag className="h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-bold">Latest Offers</h2>
      </div>
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
              {/* Frameless/soft row - matches table */}
              <div className="flex flex-col py-3 px-1 hover-scale items-start">
                <div className="flex justify-between w-full mb-1 gap-2 items-center">
                  <span className={`font-bold text-xs ${offer.color} bg-opacity-10 rounded-full px-2 py-0.5`}>
                    {offer.store}
                  </span>
                  {offer.badge && (
                    <span className="flex items-center bg-white/90 text-xs px-2 py-0.5 rounded-full shadow-sm">
                      {getBadgeIcon(offer.badgeType)}
                      <span className="font-semibold">{offer.badge}</span>
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-xs mb-1 text-gray-900 dark:text-white">{offer.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{offer.description}</p>
                <div className="flex items-center text-xs text-gray-500 mt-auto">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="font-medium">Expires: {offer.expiry}</span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 lg:-left-6" />
        <CarouselNext className="right-0 lg:-right-6" />
      </Carousel>
    </div>
  );
};

export default LastUpdateOffers;

