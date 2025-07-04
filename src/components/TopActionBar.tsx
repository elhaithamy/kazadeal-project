
import React from 'react';
import { TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TopActionBar = () => {
  return (
    <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Best Deals Button - Centered and Red */}
      <Link to="/best-deals">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 px-4 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 font-semibold"
        >
          <TrendingDown className="h-4 w-4 mr-2" />
          Search for Best Deals
        </Button>
      </Link>
    </div>
  );
};

export default TopActionBar;
