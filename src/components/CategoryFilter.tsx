
import React, { useState, useEffect } from 'react';
import { Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

const categories = [
  "All",
  "Fruits & Vegetables",
  "Meat & Poultry",
  "Dairy & Eggs",
  "Bakery",
  "Beverages",
  "Snacks",
  "Household",
  "Personal Care"
];

interface CategoryFilterProps {
  onSearch: (value: string) => void;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ onSearch, onCategoryChange }: CategoryFilterProps) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);
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
      <div className="flex items-center gap-2 mb-3">
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
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="flex-shrink-0"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      {showFilters && (
        <div className="overflow-x-auto pb-2 mb-2">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap text-sm ${
                  activeCategory === category 
                    ? 'bg-app-green text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
