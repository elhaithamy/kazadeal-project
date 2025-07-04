import React, { useContext, useMemo, useState, useEffect } from 'react';
import { Plus, ThumbsUp, Search, Palette } from 'lucide-react';
import { products, Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ProductSelectionContext } from '@/contexts/ProductSelectionContext';
import { useIsMobile } from '@/hooks/use-mobile';
import NewArrivals from '@/components/NewArrivals';
import ProductTag, { TagType } from '@/components/ProductTag';
import LastUpdateOffers from '@/components/LastUpdateOffers';

interface PriceComparisonProps {
  searchQuery?: string;
  activeCategory?: string;
  onSearch?: (value: string) => void;
  onCategoryChange?: (category: string) => void;
}

const getProductTag = (productId: number): TagType | null => {
  if (productId % 10 === 0) return 'hot-deal';
  if (productId % 7 === 0) return 'bulky';
  if (productId % 5 === 0) return 'heavy-carry';
  if (productId % 8 === 0) return 'bestseller';
  return null;
};

// Professional engagement colors for mature audience
const engagementColors = [
  { name: 'Trust Blue', bg: '#2563EB', border: '#1D4ED8', text: '#FFFFFF' },
  { name: 'Forest Green', bg: '#059669', border: '#047857', text: '#FFFFFF' },
  { name: 'Professional Navy', bg: '#1E40AF', border: '#1E3A8A', text: '#FFFFFF' },
  { name: 'Success Green', bg: '#16A34A', border: '#15803D', text: '#FFFFFF' },
  { name: 'Deep Teal', bg: '#0D9488', border: '#0F766E', text: '#FFFFFF' },
  { name: 'Rich Purple', bg: '#7C3AED', border: '#6D28D9', text: '#FFFFFF' },
];

const PriceComparison = ({ searchQuery = '', activeCategory = 'All', onSearch, onCategoryChange }: PriceComparisonProps) => {
  const { selectedProducts, toggleProductSelection } = useContext(ProductSelectionContext);
  const isMobile = useIsMobile();
  const [displayedItems, setDisplayedItems] = useState(100);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [selectedEngagementColor, setSelectedEngagementColor] = useState(engagementColors[0]);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const getQuantity = (productId: number) => quantities[productId] || 1;

  const handleQuantityChange = (productId: number, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, value)
    }));
  };

  const handleQuantityInputChange = (productId: number, value: string) => {
    const numValue = parseInt(value) || 1;
    handleQuantityChange(productId, Math.max(1, numValue));
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(localSearchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = (searchQuery === '' && localSearchQuery === '') || 
        product.name.toLowerCase().includes((searchQuery || localSearchQuery).toLowerCase());
      
      return matchesSearch && product.isAvailable !== false;
    });
  }, [searchQuery, localSearchQuery, products]);

  const handleSelectProduct = (product: Product) => {
    toggleProductSelection(product.id);
  };

  // Professional color palette for retailers
  const retailerColors = {
    lulu: '#2563EB',
    othaim: '#7C3AED', 
    carrefour: '#DC2626',
    danube: '#0891B2',
    panda: '#7C2D12',
    tamimi: '#6D28D9',
  };

  const renderCompactPriceTable = (product: Product) => {
    const prices = [
      { label: 'LuLu', value: product.prices.lulu, key: 'lulu' },
      { label: 'Panda', value: product.prices.panda, key: 'panda' },
      { label: 'Othaim', value: product.prices.othaim, key: 'othaim' },
      { label: 'Carrefour', value: product.prices.carrefour, key: 'carrefour' },
      { label: 'Danube', value: product.prices.danube, key: 'danube' },
      { label: 'Tamimi', value: product.prices.tamimi, key: 'tamimi' }
    ];
    
    const lowestPrice = Math.min(...prices.map(p => p.value));

    return (
      <div className="grid grid-cols-2 gap-2 w-full">
        {prices.map(({ label, value, key }) => {
          const color = retailerColors[key as keyof typeof retailerColors];
          const isLowest = value === lowestPrice;
          
          return (
            <div
              key={label}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl border text-xs`}
              style={{
                backgroundColor: isLowest ? selectedEngagementColor.bg : '#f8f9fa',
                borderColor: isLowest ? selectedEngagementColor.border : '#e9ecef',
                color: isLowest ? selectedEngagementColor.text : '#495057'
              }}
            >
              <span className="font-semibold text-[11px] mb-0.5">{label}</span>
              <span className={`text-base ${isLowest ? 'font-extrabold' : 'font-medium'}`}>
                {value.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderProductItem = (product: Product) => {
    const lowestPrice = Math.min(...Object.values(product.prices));
    const isSelected = selectedProducts.includes(product.id);
    const productTag = getProductTag(product.id);
    const quantity = getQuantity(product.id);
    
    return (
      <Card className={`h-full rounded-lg transition-all duration-200 ${isSelected ? 'border-blue-600 border-2 shadow-md ring-1 ring-blue-600/20' : 'border-gray-200 hover:border-blue-400'} font-spacegrotesk`}>
        <CardContent className="p-3 h-full">
          <div className="flex flex-col h-full">
            <div className="flex flex-col items-center mb-3 relative">
              <div className="w-16 h-16 mb-2 relative bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg flex items-center justify-center shadow-sm border">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-14 h-14 object-cover rounded-md"
                />
                {productTag && (
                  <div className="absolute -top-2 -right-2">
                    <ProductTag type={productTag} />
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-center text-sm line-clamp-2 leading-tight min-h-[2.5rem] text-gray-800">
                {product.name}
              </h3>
            </div>
            
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center bg-gray-100 rounded-full border">
                <button 
                  onClick={() => handleQuantityChange(product.id, quantity - 1)}
                  className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-semibold hover:bg-blue-700"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityInputChange(product.id, e.target.value)}
                  className="w-16 h-7 text-center text-sm font-semibold border-0 bg-transparent focus:ring-0 focus:border-0"
                  min="1"
                />
                <button 
                  onClick={() => handleQuantityChange(product.id, quantity + 1)}
                  className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-semibold hover:bg-blue-700"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="mb-3 w-full">
              {renderCompactPriceTable(product)}
            </div>
            
            <div className="mt-auto">
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`w-full text-sm py-2 h-10 rounded-lg font-semibold border transition-all duration-200 ${
                  isSelected 
                    ? "bg-blue-600 hover:bg-blue-700 border-blue-600 text-white shadow-sm" 
                    : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                }`}
                onClick={() => handleSelectProduct(product)}
              >
                {isSelected ? (
                  <>
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Selected
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Compare
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Pagination for products
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Split products into sections for the layout
  const firstSection = filteredProducts.slice(0, 20);
  const secondSection = filteredProducts.slice(20, 40);
  const thirdSection = filteredProducts.slice(40, 100);

  return (
    <div className="max-w-6xl mx-auto px-0 md:px-4 py-2">
      <Card className="mb-6 bg-white shadow-sm border border-gray-200">
        <CardContent className="pt-6">
          {/* Search Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  placeholder="Search for the best deals..."
                  className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onKeyDown={handleKeyPress}
                />
              </div>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSearch}
                className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 px-6 rounded-lg"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Color Palette Selector */}
          <div className="mb-4 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColorPalette(!showColorPalette)}
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Palette className="h-4 w-4" />
              Choose Highlight Color
            </Button>
          </div>

          {showColorPalette && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-semibold mb-2 text-gray-800">Select highlight color for lowest prices:</h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {engagementColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedEngagementColor(color);
                      setShowColorPalette(false);
                    }}
                    className="p-2 rounded-lg border-2 transition-all hover:scale-105"
                    style={{
                      backgroundColor: color.bg,
                      borderColor: selectedEngagementColor.name === color.name ? '#000' : color.border,
                      color: color.text
                    }}
                  >
                    <div className="text-xs font-semibold">{color.name}</div>
                    <div className="text-xs">49.99</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col mb-2">
            {selectedProducts.length > 0 && (
              <div className="flex justify-end mb-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleProductSelection("clear")}
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>

          {/* Products Grid with Carousels */}
          <div className="space-y-8">
            {/* First Section - Fresh Produce */}
            <div>
              <h3 className="font-bold text-xl text-gray-800 mb-4">Fresh Produce</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {firstSection.map((product) => (
                  <div key={product.id}>
                    {renderProductItem(product)}
                  </div>
                ))}
              </div>
            </div>

            {/* New Arrivals Carousel */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="pt-4">
                <NewArrivals />
              </CardContent>
            </Card>

            {/* Second Section - Dairy & Pantry */}
            <div>
              <h3 className="font-bold text-xl text-gray-800 mb-4">Dairy & Pantry Essentials</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {secondSection.map((product) => (
                  <div key={product.id}>
                    {renderProductItem(product)}
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Offers Carousel */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="pt-4">
                <LastUpdateOffers />
              </CardContent>
            </Card>

            {/* Third Section - All Remaining Products */}
            {thirdSection.length > 0 && (
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-4">More Products</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {thirdSection.map((product) => (
                    <div key={product.id}>
                      {renderProductItem(product)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceComparison;
