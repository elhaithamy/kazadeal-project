
import React from 'react';
import CategoryNav from '@/components/CategoryNav';

interface TopActionBarProps {
  onCategorySelect: (category: string) => void;
  activeCategory?: string;
}

const TopActionBar: React.FC<TopActionBarProps> = ({ onCategorySelect, activeCategory }) => {
  return (
    <div className="space-y-4">
      <CategoryNav onCategorySelect={onCategorySelect} activeCategory={activeCategory} />
    </div>
  );
};

export default TopActionBar;
