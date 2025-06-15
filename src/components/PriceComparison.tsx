import React, { useContext, useMemo, useState } from 'react';
import { ShoppingBasket, Plus, ThumbsUp, ChevronUp, Calendar, Search } from 'lucide-react';
import { products, Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ProductSelectionContext } from '@/contexts/ProductSelectionContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import NewArrivals from '@/components/NewArrivals';
import ProductTag, { TagType } from '@/components/ProductTag';
import LastUpdateOffers from '@/components/LastUpdateOffers';
import ComparisonBar from '@/components/ComparisonBar';
import { useInView } from 'react-intersection-observer';
import CategoryNav from '@/components/CategoryNav';

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
  const { toast } = useToast();
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
      
      const matchesCategory = activeCategory === 'All' || 
        (activeCategory.toLowerCase() === product.category?.toLowerCase());
      
      return matchesSearch && matchesCategory && product.isAvailable !== false;
    });
  }, [searchQuery, localSearchQuery, activeCategory, products]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(filteredProducts.map(product => product.category))
    ).filter(Boolean) as string[];
    
    return uniqueCategories;
  }, [filteredProducts]);

  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    
    categories.forEach(category => {
      grouped[category] = filteredProducts.filter(
        product => product.category === category
      );
    });
    
    return grouped;
  }, [filteredProducts, categories]);

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
    toast({
      title: selectedProducts.includes(product.id) ? "Removed from comparison" : "Added to comparison",
      description: selectedProducts.includes(product.id) ? "Product removed from your comparison list" : "Product added to your comparison list",
    });
  };

  const renderProductItem = (product: Product) => {
    const lowestPrice = findLowestPrice(product.prices);
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
                <span className="px-3 py-1 text-sm font-bold">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(product.id, quantity + 1)}
                  className="bg-app-green text-white rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-3 text-xs font-semibold">
              <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border">
                <div className="text-gray-500 text-[10px] mb-1">LuLu</div>
                <div className={`${product.prices.lulu === lowestPrice ? 'text-app-green font-extrabold text-sm' : 'text-gray-700'}`}>
                  {calculateTotalPrice(product.prices.lulu, product.id).toFixed(2)}
                </div>
              </div>
              <div className="text-center p-2 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border">
                <div className="text-gray-500 text-[10px] mb-1">Panda</div>
                <div className={`${product.prices.panda === lowestPrice ? 'text-app-green font-extrabold text-sm' : 'text-gray-700'}`}>
                  {calculateTotalPrice(product.prices.panda, product.id).toFixed(2)}
                </div>
              </div>
              <div className="text-center p-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border">
                <div className="text-gray-500 text-[10px] mb-1">Othaim</div>
                <div className={`${product.prices.othaim === lowestPrice ? 'text-app-green font-extrabold text-sm' : 'text-gray-700'}`}>
                  {calculateTotalPrice(product.prices.othaim, product.id).toFixed(2)}
                </div>
              </div>
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
                    Selected! 🎉
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Compare
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
          {/* Deals Truth Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-app-green via-app-highlight to-app-green bg-clip-text mb-2">
              DEALS TRUTH
            </h1>
            <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Last Updated: {lastUpdateDate}</span>
            </div>
          </div>

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
                  className="pl-9 pr-4 py-2 w-full rounded-xl border-2 border-gray-200 focus:border-app-green"
                  onKeyDown={handleKeyPress}
                />
              </div>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSearch}
                className="flex-shrink-0 bg-app-green hover:bg-app-green/80 px-6 rounded-xl"
              >
                Search
              </Button>
            </div>
          </div>

          <div className="flex flex-col mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {selectedProducts.length > 0 
                    ? `${selectedProducts.length} products selected` 
                    : filteredProducts.length === products.length 
                      ? 'Showing all products'
                      : `Showing ${filteredProducts.length} products`}
                </span>
                {selectedProducts.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleProductSelection("clear")}
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Categories</h3>
            <CategoryNav />
          </div>

          {/* Products Grid */}
          <div className="space-y-8">
            {activeCategory !== 'All' ? (
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-4">{activeCategory}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts
                    .filter(product => product.category?.toLowerCase() === activeCategory.toLowerCase())
                    .slice(0, displayedItems)
                    .map((product) => (
                      <div key={product.id}>
                        {renderProductItem(product)}
                      </div>
                    ))
                  }
                </div>
              </div>
            ) : (
              categories.map((category, index) => {
                const categoryProducts = productsByCategory[category];
                const showOffers = index === 1;
                const showArrivals = index === 2;
                
                return (
                  <React.Fragment key={category}>
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 mb-4">{category}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categoryProducts.slice(0, displayedItems).map((product) => (
                          <div key={product.id}>
                            {renderProductItem(product)}
                          </div>
                        ))}
                      </div>
                    </div>

                    {showOffers && (
                      <Card className="bg-white">
                        <CardContent className="pt-6">
                          <LastUpdateOffers />
                        </CardContent>
                      </Card>
                    )}

                    {showArrivals && (
                      <Card className="bg-white">
                        <CardContent className="pt-6">
                          <NewArrivals />
                        </CardContent>
                      </Card>
                    )}
                  </React.Fragment>
                );
              })
            )}
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
