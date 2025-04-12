
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';

const categories = [
  { name: "All", icon: "🛒" },
  { name: "Fruits & Vegetables", icon: "🍅" },
  { name: "Meat & Poultry", icon: "🍗" },
  { name: "Dairy & Eggs", icon: "🥚" },
  { name: "Bakery", icon: "🍞" },
  { name: "Beverages", icon: "🥤" },
  { name: "Snacks", icon: "🍫" },
  { name: "Household", icon: "🧹" },
  { name: "Personal Care", icon: "🧴" }
];

interface CategoryFilterProps {
  onSearch: (value: string) => void;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ onSearch, onCategoryChange }: CategoryFilterProps) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Set initial category
    onCategoryChange(activeCategory);
  }, []);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    onCategoryChange(category);
  };

  const handleSearch = () => {
    onSearch(searchValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search products..."
            className="pl-9 pr-4 py-2 w-full"
            onKeyDown={handleKeyPress}
          />
        </div>
        <Button 
          variant="default" 
          size="sm"
          onClick={handleSearch}
          className="flex-shrink-0 bg-app-green hover:bg-app-green/80"
        >
          <Search className="h-4 w-4 mr-1" />
          {!isMobile && "Search"}
        </Button>
      </div>
      
      <div className="mb-6">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {categories.map((category) => (
              <CarouselItem key={category.name} className="pl-2 md:pl-4 basis-1/3 md:basis-1/5 lg:basis-1/6">
                <div 
                  onClick={() => handleCategoryChange(category.name)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                    activeCategory === category.name 
                      ? 'bg-app-green/10 border-2 border-app-green' 
                      : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent'
                  }`}
                >
                  <div className="text-3xl">{category.icon}</div>
                  <span className="text-xs font-medium truncate">{category.name}</span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default CategoryFilter;
