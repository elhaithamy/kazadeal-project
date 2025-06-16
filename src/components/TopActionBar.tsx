
import React from 'react';
import { Search, Filter, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const TopActionBar = () => {
  return (
    <div className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search products..."
          className="pl-10 h-9 text-sm"
        />
      </div>
      
      {/* Filter Button */}
      <Button variant="outline" size="sm" className="h-9 px-3">
        <Filter className="h-4 w-4 mr-1" />
        Filter
      </Button>
      
      {/* Best Deals Button */}
      <Link to="/best-deals">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 px-3 bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
        >
          <TrendingDown className="h-4 w-4 mr-1" />
          Best Deals
        </Button>
      </Link>
    </div>
  );
};

export default TopActionBar;
