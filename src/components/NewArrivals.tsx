import React from 'react';
import { Carousel, CarouselItem, CarouselContent, CarouselPrevious, CarouselNext } from './Carousel';
import { Sparkles, Star } from 'lucide-react';

const NewArrivals = () => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        <h2 className="text-xl font-bold">New Arrivals</h2>
      </div>
      <div className="relative pb-8">
        <Carousel
          opts={{
            align: "start",
          }}
        >
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="basis-2/3 sm:basis-2/5 md:basis-1/3 lg:basis-1/4 px-1 md:px-2"
              >
                <div className="flex flex-col items-center py-3 px-1 hover-scale">
                  <div className="relative w-12 h-12 mb-2">
                    <img
                      src="https://via.placeholder.com/150"
                      alt="Product"
                      className="rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Star className="h-3 w-3 mr-1 text-app-green" />
                    </div>
                  </div>
                  <h3 className="font-medium text-center text-xs mb-1 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                    Product Name
                  </h3>
                  <p className="text-xs text-gray-500 text-center mb-2">Category</p>
                  <div className="mt-auto text-xs text-app-green font-bold bg-app-green/10 px-2 py-0.5 rounded-full flex items-center">
                    <Star className="h-3 w-3 mr-1 text-app-green" />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex w-full justify-between px-4 absolute bottom-0 left-0 right-0">
            <CarouselPrevious className="static relative" />
            <CarouselNext className="static relative" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default NewArrivals;
