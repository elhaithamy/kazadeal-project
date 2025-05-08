import React, { useContext, useMemo, useState } from 'react';
import { ShoppingBasket, Plus, Check, ChevronUp, Calendar } from 'lucide-react';
import { products, Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductSelectionContext } from '@/contexts/ProductSelectionContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import NewArrivals from '@/components/NewArrivals';
import ProductTag, { TagType } from '@/components/ProductTag';
import LastUpdateOffers from '@/components/LastUpdateOffers';
import ComparisonBar from '@/components/ComparisonBar';
import { useInView } from 'react-intersection-observer';

interface PriceComparisonProps {
  searchQuery?: string;
  activeCategory?: string;
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

// Get today's date in a readable format
const getLastUpdateDate = () => {
  const today = new Date();
  return today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const PriceComparison = ({ searchQuery = '', activeCategory = 'All' }: PriceComparisonProps) => {
  const { selectedProducts, toggleProductSelection } = useContext(ProductSelectionContext);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [displayedItems, setDisplayedItems] = useState(15);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const lastUpdateDate = getLastUpdateDate();

  const getQuantity = (productId: number) => quantities[productId] || 1;

  const handleQuantityChange = (productId: number, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, value)
    }));
  };

  const increaseQuantity = (productId: number) => {
    handleQuantityChange(productId, getQuantity(productId) + 1);
    toast({
      title: "Item quantity updated",
      description: "Product quantity has been increased",
    });
  };

  const calculateTotalPrice = (basePrice: number, productId: number) => {
    return basePrice * getQuantity(productId);
  };

  const calculateUnitPrice = (product: Product) => {
    return `${product.prices.lulu.toFixed(2)} EGP/unit`;
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
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || 
        (activeCategory.toLowerCase() === product.category?.toLowerCase());
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, products]);

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

  const currentProducts = useMemo(() => {
    return filteredProducts.slice(0, displayedItems);
  }, [filteredProducts, displayedItems]);

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
      calculatedTotals.lulu += product.prices.lulu;
      calculatedTotals.othaim += product.prices.othaim;
      calculatedTotals.carrefour += product.prices.carrefour;
      calculatedTotals.danube += product.prices.danube;
      calculatedTotals.panda += product.prices.panda;
      calculatedTotals.tamimi += product.prices.tamimi;
    });

    return calculatedTotals;
  }, [filteredProducts, selectedProducts]);

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

  const getRankingColorClass = (store: string) => {
    if (!priceRankings[store] || selectedProducts.length <= 1) return '';
    
    switch (priceRankings[store]) {
      case 'lowest':
        return 'bg-app-green text-white';
      case 'medium':
        return 'bg-yellow-400';
      case 'highest':
        return 'bg-red-500 text-white';
      default:
        return '';
    }
  };

  const getRankingBadge = (store: string) => {
    if (!priceRankings[store] || selectedProducts.length <= 1) return null;
    
    switch (priceRankings[store]) {
      case 'lowest':
        return <Badge className="ml-2 bg-app-green">Lowest</Badge>;
      case 'medium':
        return <Badge className="ml-2 bg-yellow-400">Medium</Badge>;
      case 'highest':
        return <Badge className="ml-2 bg-red-500">Highest</Badge>;
      default:
        return null;
    }
  };

  const renderProductItem = (product: Product) => {
    const lowestPrice = findLowestPrice(product.prices);
    const isSelected = selectedProducts.includes(product.id);
    const productTag = getProductTag(product.id);
    const quantity = getQuantity(product.id);
    const unitPrice = calculateUnitPrice(product);
    
    return (
      <Card className={`h-full ${isSelected ? 'border-app-green border-2' : ''}`}>
        <CardContent className="p-2 h-full">
          <div className="flex flex-col h-full">
            <div className="flex flex-col items-center mb-2 relative">
              <div className="w-12 h-12 mb-1 relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover rounded-full border border-gray-200 shadow-sm"
                />
                {productTag && (
                  <div className="absolute -top-2 -right-2">
                    <ProductTag type={productTag} />
                  </div>
                )}
              </div>
              <h3 className="font-medium text-center text-xs line-clamp-2 leading-relaxed tracking-wide min-h-[3rem]">
                {product.name}
              </h3>
              <div className="text-xs text-gray-500">Count: {product.count}</div>
            </div>
            
            <div className="flex items-center justify-between mb-2 relative">
              <div className="flex items-center">
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                  className="w-12 text-xs p-1 border rounded"
                />
                <button 
                  onClick={() => increaseQuantity(product.id)}
                  className="ml-1 bg-app-green text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
              </div>
              <span className="text-xs text-gray-500 font-semibold">{unitPrice}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-1 mb-2 text-xs">
              <div className="text-center p-1 bg-gray-50 rounded">
                <div className="text-gray-500 text-[10px]">LuLu</div>
                <div className={`${product.prices.lulu === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                  {calculateTotalPrice(product.prices.lulu, product.id)}
                </div>
              </div>
              <div className="text-center p-1 bg-gray-50 rounded">
                <div className="text-gray-500 text-[10px]">Panda</div>
                <div className={`${product.prices.panda === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                  {calculateTotalPrice(product.prices.panda, product.id)}
                </div>
              </div>
              <div className="text-center p-1 bg-gray-50 rounded">
                <div className="text-gray-500 text-[10px]">Othaim</div>
                <div className={`${product.prices.othaim === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                  {calculateTotalPrice(product.prices.othaim, product.id)}
                </div>
              </div>
            </div>
            
            <div className="mt-auto">
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`w-full text-xs py-1 h-7 ${isSelected ? "bg-app-green hover:bg-app-green-dark" : ""}`}
                onClick={() => handleSelectProduct(product)}
              >
                {isSelected ? <Check className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                {isSelected ? 'Selected' : 'Compare'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCarouselProducts = () => {
    if (activeCategory !== 'All') {
      const categoryProducts = filteredProducts.filter(
        product => product.category?.toLowerCase() === activeCategory.toLowerCase()
      );
      
      return (
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">{activeCategory}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categoryProducts.slice(0, displayedItems).map((product) => (
              <div key={product.id} className="mb-0">
                {renderProductItem(product)}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {categories.map((category, index) => {
          const categoryProducts = productsByCategory[category];
          
          const showOffers = index === 1;
          const showArrivals = index === 2;
          
          return (
            <React.Fragment key={category}>
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">{category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categoryProducts.slice(0, displayedItems).map((product) => (
                    <div key={product.id}>
                      {renderProductItem(product)}
                    </div>
                  ))}
                </div>
              </div>

              {showOffers && (
                <div
                  ref={offersRef}
                  className={`transition-opacity duration-500 ${
                    offersInView ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Card className="mb-4 bg-white">
                    <CardContent className="pt-6">
                      <LastUpdateOffers />
                    </CardContent>
                  </Card>
                </div>
              )}

              {showArrivals && (
                <div
                  ref={arrivalsRef}
                  className={`transition-opacity duration-500 ${
                    arrivalsInView ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Card className="mb-4 bg-white">
                    <CardContent className="pt-6">
                      <NewArrivals />
                    </CardContent>
                  </Card>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-0 md:px-4 py-2">
      <Card className="mb-4 bg-white">
        <CardContent className="pt-6">
          <div className="flex flex-col mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Price Comparison</h2>
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
                    Clear
                  </Button>
                )}
              </div>
            </div>
            
            {/* Added last update date */}
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Last Updated: {lastUpdateDate}</span>
            </div>
          </div>
          
          {renderCarouselProducts()}
          
          {currentProducts.length < filteredProducts.length && (
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
