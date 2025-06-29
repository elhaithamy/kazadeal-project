
import React, { useEffect } from 'react';
import { Tag, Clock, Star, ThumbsUp, TrendingUp } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';
import ProductTag from '@/components/ProductTag';
import { useContext } from 'react';
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
  // Add more offers to reach 15-20 items
  {
    id: 7,
    store: 'LuLu',
    title: '40% Off Electronics',
    expiry: '26 Apr 2025',
    description: 'Limited time offer on all electronics',
    color: 'bg-purple-600',
    badge: 'Hot Deal',
    badgeType: 'hot',
    image: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png'
  },
  {
    id: 8,
    store: 'Panda',
    title: '50% Off Clothing',
    expiry: '24 Apr 2025',
    description: 'Huge savings on seasonal clothing',
    color: 'bg-pink-600',
    badge: 'Best Deal',
    badgeType: 'best',
    image: 'https://shop.sage.co.za/wp-content/uploads/2017/09/green-shopping-cart-icon-5-1.png'
  }
];

const LastUpdateOffers = () => {
  const isMobile = useIsMobile();
  const { toggleProductSelection } = useContext(ProductSelectionContext);
  const [api, setApi] = React.useState<CarouselApi>();

  // Auto-slide effect
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000); // Auto-slide every 4 seconds (slightly different from NewArrivals)

    return () => clearInterval(interval);
  }, [api]);

  const handleOfferClick = (offerId: number) => {
    // For demo purposes, add a random product to comparison
    const randomProductId = Math.floor(Math.random() * 100) + 1;
    toggleProductSelection(randomProductId);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3 px-2">
        <Tag className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-bold">Latest Offers</h2>
      </div>
      <div className="px-2">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            containScroll: false,
            slidesToScroll: isMobile ? 2 : 3
          }}
          className="w-full"
        >
          <CarouselContent className="pb-1 -ml-2">
            {offers.map((offer) => (
              <CarouselItem 
                key={offer.id} 
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-2"
              >
                <div 
                  className="flex flex-col items-center py-3 px-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 h-full cursor-pointer transform hover:scale-105"
                  onClick={() => handleOfferClick(offer.id)}
                >
                  <div className="relative w-12 h-12 mb-2">
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
                  <h3 className="font-medium text-center text-[10px] mb-2 line-clamp-2 leading-tight min-h-[2rem] px-1">
                    {offer.title}
                  </h3>
                  <p className="text-[9px] text-gray-500 text-center mb-2">{offer.store}</p>
                  <div className="text-[8px] flex items-center bg-gray-100 px-1.5 py-0.5 rounded-full">
                    <Clock className="h-2 w-2 mr-1 text-gray-500" />
                    <span className="font-medium text-gray-700">Expires: {offer.expiry}</span>
                  </div>
                </div>
                {/* Sneak peek effect */}
                <div className="absolute right-0 top-0 w-6 h-full bg-gradient-to-l from-white/80 to-transparent pointer-events-none opacity-30"></div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default LastUpdateOffers;
