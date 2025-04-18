import React, { useContext, useMemo, useState } from 'react';
import { ShoppingBasket, Plus, Check } from 'lucide-react';
import { products, Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductSelectionContext } from '@/contexts/ProductSelectionContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import NewArrivals from '@/components/NewArrivals';
import ProductTag, { TagType } from '@/components/ProductTag';
import LastUpdateOffers from '@/components/LastUpdateOffers';
import ComparisonBar from '@/components/ComparisonBar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PriceComparisonProps {
  searchQuery?: string;
  activeCategory?: string;
}

const ITEMS_PER_PAGE = 15;

const getProductTag = (productId: number): TagType | null => {
  if (productId % 10 === 0) return 'hot-deal';
  if (productId % 7 === 0) return 'bulky';
  if (productId % 5 === 0) return 'heavy-carry';
  if (productId % 8 === 0) return 'bestseller';
  return null;
};

const PriceComparison = ({ searchQuery = '', activeCategory = 'All' }: PriceComparisonProps) => {
  const { selectedProducts, toggleProductSelection } = useContext(ProductSelectionContext);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  
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

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const isLastPage = currentPage === totalPages;

  const calculateTotals = () => {
    const totals = {
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
      totals.lulu += product.prices.lulu;
      totals.othaim += product.prices.othaim;
      totals.carrefour += product.prices.carrefour;
      totals.danube += product.prices.danube;
      totals.panda += product.prices.panda;
      totals.tamimi += product.prices.tamimi;
    });

    return totals;
  };

  const totals = calculateTotals();
  
  const findLowestPrice = (prices: Record<string, number>) => {
    return Math.min(...Object.values(prices));
  };

  const findLowestTotal = () => {
    const lowestTotal = Math.min(...Object.values(totals));
    return Object.entries(totals).find(([_, value]) => value === lowestTotal)?.[0] || '';
  };

  const getPriceRankings = () => {
    const sortedStores = Object.entries(totals)
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

  const priceRankings = getPriceRankings();
  const lowestTotalStore = findLowestTotal();

  const handleSelectProduct = (product: Product) => {
    toggleProductSelection(product.id);
    
    if (!selectedProducts.includes(product.id)) {
      toast({
        title: "Product added to comparison",
        description: `${product.name} added to your comparison list`,
      });
    } else {
      toast({
        title: "Product removed from comparison",
        description: `${product.name} removed from your comparison list`,
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    return (
      <Card className={`h-full ${isSelected ? 'border-app-green border-2' : ''}`}>
        <CardContent className="p-4 h-full">
          <div className="flex flex-col h-full">
            <div className="flex flex-col items-center mb-3 relative">
              <div className="w-16 h-16 mb-2 relative">
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
              <h3 className="font-medium text-center text-sm">{product.name}</h3>
              <div className="text-xs text-gray-500">Count: {product.count}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-1 mb-2 text-xs">
              <div className="text-center p-1 bg-gray-50 rounded">
                <div className="text-gray-500">LuLu</div>
                <div className={`${product.prices.lulu === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                  {product.prices.lulu}
                </div>
              </div>
              <div className="text-center p-1 bg-gray-50 rounded">
                <div className="text-gray-500">Panda</div>
                <div className={`${product.prices.panda === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                  {product.prices.panda}
                </div>
              </div>
              <div className="text-center p-1 bg-gray-50 rounded">
                <div className="text-gray-500">Othaim</div>
                <div className={`${product.prices.othaim === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                  {product.prices.othaim}
                </div>
              </div>
            </div>
            
            <div className="mt-auto">
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`w-full ${isSelected ? "bg-app-green hover:bg-app-green-dark" : ""}`}
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
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {categoryProducts.map((product) => (
                <CarouselItem 
                  key={product.id} 
                  className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  {renderProductItem(product)}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 lg:-left-12 hidden sm:flex" />
            <CarouselNext className="right-0 lg:-right-12 hidden sm:flex" />
          </Carousel>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category} className="mb-6">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">{category}</h3>
            
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {productsByCategory[category].map((product) => (
                  <CarouselItem 
                    key={product.id} 
                    className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                  >
                    {renderProductItem(product)}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 lg:-left-12 hidden sm:flex" />
              <CarouselNext className="right-0 lg:-right-12 hidden sm:flex" />
            </Carousel>
          </div>
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <Pagination className="my-6">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
            </PaginationItem>
          )}
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            
            if (page === 2 && currentPage > 3) {
              return (
                <PaginationItem key="ellipsis-start">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            
            if (page === totalPages - 1 && currentPage < totalPages - 2) {
              return (
                <PaginationItem key="ellipsis-end">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            
            return null;
          })}
          
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-0 md:px-4 py-6">
      <Card className="mb-4 bg-white">
        <CardContent className="pt-6">
          <LastUpdateOffers />
        </CardContent>
      </Card>
      
      <Card className="mb-4 bg-white">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
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
          
          {renderCarouselProducts()}
        </CardContent>
      </Card>

      {isLastPage && (
        <Card className="mb-4 bg-white">
          <CardContent className="pt-6">
            <NewArrivals />
          </CardContent>
        </Card>
      )}

      <ComparisonBar 
        totals={totals}
        selectedProducts={selectedProducts}
        priceRankings={priceRankings}
        lowestTotalStore={lowestTotalStore}
      />
      
      {renderPagination()}
    </div>
  );
};

export default PriceComparison;
