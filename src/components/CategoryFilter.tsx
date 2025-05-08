
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

interface CategoryFilterProps {
  onSearch: (value: string) => void;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ onSearch, onCategoryChange }: CategoryFilterProps) => {
  const [searchValue, setSearchValue] = useState("");
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Set initial category onMount is not needed since we removed the first categories section
  }, []);

  const handleSearch = () => {
    onSearch(searchValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
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
    </div>
  );
};

export default CategoryFilter;
