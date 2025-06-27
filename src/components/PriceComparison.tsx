
import React, { useContext, useMemo, useState } from 'react';
import { ShoppingBasket, Plus, ThumbsUp, ChevronUp, Calendar, Search } from 'lucide-react';
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
import ComparisonBar from '@/components/ComparisonBar';
import { useInView } from 'react-intersection-observer';

interface PriceComparisonProps {
  searchQuery?: string;
  activeCategory?: string;
  onSearch?: (value: string) => void;
  onCategoryChange?: (category: string) => void;
}

interface TotalsType {
  lulu: number;
  othaim: number;
  carrefour: number;
  danube: number;
  panda: number;
  tamimi: number;
}

const getProductTag = (productId: number): TagType | null => {
  if (productId % 10 === 0) return 'hot-deal';
  if (productId % 7 === 0) return 'bulky';
  if (productId % 5 === 0) return 'heavy-carry';
  if (productId % 8 === 0) return 'bestseller';
  return null;
};

const getLastUpdateDate = () => {
  const today = new Date();
  return today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const PriceComparison = ({ searchQuery = '', activeCategory = 'All', onSearch, onCategoryChange }: PriceComparisonProps) => {
  const { selectedProducts, toggleProductSelection } = useContext(ProductSelectionContext);
  const isMobile = useIsMobile();
  const [displayedItems, setDisplayedItems] = useState(15);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const lastUpdateDate = getLastUpdateDate();

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

  const calculateTotalPrice = (basePrice: number, productId: number) => {
    return basePrice * getQuantity(productId);
  };

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    onChange: (inView) => {
      if (inView) {
        setDisplayedItems(prev => prev + 15);
      }
    },
  });

  const { ref: offersRef, inView: offersInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { ref: arrivalsRef, inView: arrivalsInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = (searchQuery === '' && localSearchQuery === '') || 
        product.name.toLowerCase().includes((searchQuery || localSearchQuery).toLowerCase());
      
      return matchesSearch && product.isAvailable !== false;
    });
  }, [searchQuery, localSearchQuery, products]);

  const calculateTotals = useMemo(() => {
    const calculatedTotals: TotalsType = {
      lulu: 0,
      othaim: 0,
      carrefour: 0,
      danube: 0,
      panda: 0,
      tamimi: 0
    };

    const productsToCalculate = selectedProducts.length > 0 ? 
      filteredProducts.filter(p => selectedProducts.includes(p.id)) : 
      filteredProducts;

    productsToCalculate.forEach(product => {
      calculatedTotals.lulu += product.prices.lulu * getQuantity(product.id);
      calculatedTotals.othaim += product.prices.othaim * getQuantity(product.id);
      calculatedTotals.carrefour += product.prices.carrefour * getQuantity(product.id);
      calculatedTotals.danube += product.prices.danube * getQuantity(product.id);
      calculatedTotals.panda += product.prices.panda * getQuantity(product.id);
      calculatedTotals.tamimi += product.prices.tamimi * getQuantity(product.id);
    });

    return calculatedTotals;
  }, [filteredProducts, selectedProducts, quantities]);

  const findLowestPrice = (prices: Record<string, number>) => {
    return Math.min(...Object.values(prices));
  };

  const findLowestTotal = () => {
    const lowestTotal = Math.min(...Object.values(calculateTotals));
    return Object.entries(calculateTotals).find(([_, value]) => value === lowestTotal)?.[0] || '';
  };

  const getPriceRankings = () => {
    const sortedStores = Object.entries(calculateTotals)
      .sort(([_, priceA], [__, priceB]) => priceA - priceB);
    
    const rankings: Record<string, 'lowest' | 'medium' | 'highest'> = {};
    
    if (sortedStores.length === 0) return rankings;
    
    rankings[sortedStores[0][0]] = 'lowest';
    
    if (sortedStores.length > 1) {
      rankings[sortedStores[sortedStores.length - 1][0]] = 'highest';
      
      for (let i = 1; i < sortedStores.length - 1; i++) {
        rankings[sortedStores[i][0]] = 'medium';
      }
      
      if (sortedStores.length === 2) {
        rankings[sortedStores[1][0]] = 'highest';
      }
    }
    
    return rankings;
  };

  const priceRankings = useMemo(() => getPriceRankings(), [calculateTotals]);
  const lowestTotalStore = useMemo(() => findLowestTotal(), [calculateTotals]);

  const handleSelectProduct = (product: Product) => {
    toggleProductSelection(product.id);
  };

  // Color palette for retailers
  const retailerColors = {
    lulu: '#0EA5E9',
    othaim: '#9b87f5', 
    carrefour: '#F97316',
    danube: '#1EAEDB',
    panda: '#7E69AB',
    tamimi: '#6E59A5',
  };

  // Helper for rendering the store price grid for a single product.
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
                backgroundColor: isLowest ? `${color}20` : '#f8f9fa',
                borderColor: isLowest ? color : '#e9ecef',
                color: isLowest ? color : '#495057'
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
      <Card className={`h-full rounded-2xl transition-all duration-200 ${isSelected ? 'border-app-green border-3 scale-105 shadow-lg ring-2 ring-app-green/30' : 'border-gray-200 hover:border-app-green/50'} font-spacegrotesk`}>
        <CardContent className="p-3 h-full">
          <div className="flex flex-col h-full">
            <div className="flex flex-col items-center mb-3 relative">
              <div className="w-16 h-16 mb-2 relative bg-gradient-to-br from-app-green/10 to-app-highlight/10 rounded-2xl flex items-center justify-center shadow-sm">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-14 h-14 object-cover rounded-xl shadow-sm"
                />
                {productTag && (
                  <div className="absolute -top-2 -right-2">
                    <ProductTag type={productTag} />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-center text-sm line-clamp-2 leading-tight min-h-[2.5rem] text-gray-800">
                {product.name}
              </h3>
            </div>
            
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center bg-gray-100 rounded-full">
                <button 
                  onClick={() => handleQuantityChange(product.id, quantity - 1)}
                  className="bg-app-green text-white rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityInputChange(product.id, e.target.value)}
                  className="w-16 h-7 text-center text-sm font-bold border-0 bg-transparent focus:ring-0 focus:border-0"
                  min="1"
                />
                <button 
                  onClick={() => handleQuantityChange(product.id, quantity + 1)}
                  className="bg-app-green text-white rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Responsive price table for comparison */}
            <div className="mb-3 w-full">
              {renderCompactPriceTable(product)}
            </div>
            
            <div className="mt-auto">
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`w-full text-sm py-2 h-10 rounded-xl font-bold border-2 transition-all duration-200 ${
                  isSelected 
                    ? "bg-gradient-to-r from-app-green to-app-highlight border-app-green text-white shadow-lg transform scale-105" 
                    : "border-app-green text-app-green hover:bg-app-green hover:text-white"
                }`}
                onClick={() => handleSelectProduct(product)}
              >
                {isSelected ? (
                  <>
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Selected!
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

  return (
    <div className="max-w-6xl mx-auto px-0 md:px-4 py-2">
      <Card className="mb-6 bg-white shadow-lg">
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
                  className="pl-9 pr-4 py-2 w-full rounded-xl border-2 border-gray-200 focus:border-app-primary"
                  onKeyDown={handleKeyPress}
                />
              </div>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSearch}
                className="flex-shrink-0 bg-app-primary hover:bg-app-primary/80 px-6 rounded-xl"
              >
                Search
              </Button>
            </div>
          </div>

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

          {/* Carousels - Moved between search and products */}
          <div className="space-y-4 mb-6">
            <Card className="bg-white">
              <CardContent className="pt-4">
                <NewArrivals />
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="pt-4">
                <LastUpdateOffers />
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-xl text-gray-800 mb-4">All Products</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts
                  .slice(0, displayedItems)
                  .map((product) => (
                    <div key={product.id}>
                      {renderProductItem(product)}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          
          {filteredProducts.slice(0, displayedItems).length < filteredProducts.length && (
            <div 
              ref={loadMoreRef}
              className="py-8 flex justify-center"
            >
              <div className="animate-pulse flex space-x-2 items-center text-gray-400">
                <div className="h-2 w-2 bg-current rounded-full"></div>
                <div className="h-2 w-2 bg-current rounded-full"></div>
                <div className="h-2 w-2 bg-current rounded-full"></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ComparisonBar 
        totals={calculateTotals}
        selectedProducts={selectedProducts}
        priceRankings={priceRankings}
        lowestTotalStore={lowestTotalStore}
      />
    </div>
  );
};

export default PriceComparison;
