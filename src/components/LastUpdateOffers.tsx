
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tag, Clock } from 'lucide-react';
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
}

const offers: OfferItem[] = [
  {
    id: 1,
    store: 'LuLu',
    title: '20% Off Fresh Produce',
    expiry: '25 Apr 2025',
    description: 'Get 20% off all fresh fruits and vegetables',
    color: 'bg-app-green',
  },
  {
    id: 2,
    store: 'Othaim',
    title: 'Buy 1 Get 1 Free',
    expiry: '30 Apr 2025',
    description: 'On selected dairy products and bakery items',
    color: 'bg-red-600',
  },
  {
    id: 3,
    store: 'Carrefour',
    title: '30% Off Kitchen Items',
    expiry: '22 Apr 2025',
    description: 'Special discount on all kitchenware',
    color: 'bg-blue-600',
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

const LastUpdateOffers = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-bold">Latest Offers</h2>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
          containScroll: "trimSnaps"
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {offers.map((offer) => (
            <CarouselItem 
              key={offer.id} 
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3"
            >
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-4">
                  <div className="flex flex-col h-full">
                    <div className={`${offer.color} text-white px-3 py-1.5 rounded-t-md -mt-4 -mx-4 mb-3`}>
                      <div className="font-bold">{offer.store}</div>
                    </div>
                    <h3 className="font-medium mb-2">{offer.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 flex-grow">{offer.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Expires: {offer.expiry}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="left-0 lg:-left-8" />
        <CarouselNext className="right-0 lg:-right-8" />
      </Carousel>
    </div>
  );
};

export default LastUpdateOffers;
