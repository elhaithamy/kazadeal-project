import React, { useContext, useMemo, useState } from 'react';
import { ShoppingBasket, Plus, Check, ShoppingCart } from 'lucide-react';
import { products, Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductSelectionContext } from '@/contexts/ProductSelectionContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import NewArrivals from '@/components/NewArrivals';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PriceComparisonProps {
  searchQuery?: string;
  activeCategory?: string;
}

const ITEMS_PER_PAGE = 15;

const PriceComparison = ({ searchQuery = '', activeCategory = 'All' }: PriceComparisonProps) => {
  const { selectedProducts, toggleProductSelection } = useContext(ProductSelectionContext);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter products based on search query and active category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || 
        (activeCategory.toLowerCase() === product.category?.toLowerCase());
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, products]);

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(filteredProducts.map(product => product.category))
    ).filter(Boolean) as string[];
    
    return uniqueCategories;
  }, [filteredProducts]);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    
    categories.forEach(category => {
      grouped[category] = filteredProducts.filter(
        product => product.category === category
      );
    });
    
    return grouped;
  }, [filteredProducts, categories]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  
  // Get current page products
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Check if it's the last page
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

    // If there are selected products, calculate totals only for them
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
  
  // Find the lowest price for each product
  const findLowestPrice = (prices: Record<string, number>) => {
    return Math.min(...Object.values(prices));
  };

  // Find which store has the lowest total
  const findLowestTotal = () => {
    const lowestTotal = Math.min(...Object.values(totals));
    return Object.entries(totals).find(([_, value]) => value === lowestTotal)?.[0] || '';
  };

  // Determine price rankings (lowest, middle, highest)
  const getPriceRankings = () => {
    const sortedStores = Object.entries(totals)
      .sort(([_, priceA], [__, priceB]) => priceA - priceB);
    
    // Create a map of store to ranking
    const rankings: Record<string, 'lowest' | 'medium' | 'highest'> = {};
    
    if (sortedStores.length === 0) return rankings;
    
    // Always mark the first as lowest
    rankings[sortedStores[0][0]] = 'lowest';
    
    // For remaining stores
    if (sortedStores.length > 1) {
      // Last one is always highest
      rankings[sortedStores[sortedStores.length - 1][0]] = 'highest';
      
      // Middle ones are medium
      for (let i = 1; i < sortedStores.length - 1; i++) {
        rankings[sortedStores[i][0]] = 'medium';
      }
      
      // If only two stores, second one is highest
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

  // Get color class based on price ranking
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

  // Get indicator badge based on price ranking
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

  // Render product item for carousel
  const renderProductItem = (product: Product) => {
    const lowestPrice = findLowestPrice(product.prices);
    const isSelected = selectedProducts.includes(product.id);
    
    return (
      <Card className={`h-full ${isSelected ? 'border-app-green border-2' : ''}`}>
        <CardContent className="p-4 h-full">
          <div className="flex flex-col h-full">
            <div className="flex flex-col items-center mb-3">
              <div className="w-16 h-16 mb-2">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover rounded-md"
                />
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

  // Render by category
  const renderCategoryCarousels = () => (
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

  // Render regular product grid (for non-mobile or when filtering)
  const renderProductGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {currentProducts.map((product) => {
        const lowestPrice = findLowestPrice(product.prices);
        const isSelected = selectedProducts.includes(product.id);
        return (
          <Card key={product.id} className={`hover:shadow-md transition-shadow ${isSelected ? 'border-app-green border-2' : ''}`}>
            <CardContent className="p-4">
              <div className="flex flex-col items-center mb-3">
                <div className="w-20 h-20 mb-2">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <h3 className="font-medium text-center">{product.name}</h3>
                <div className="text-sm text-gray-500">Count: {product.count}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">LuLu</div>
                  <div className={`${product.prices.lulu === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                    {product.prices.lulu}
                  </div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Panda</div>
                  <div className={`${product.prices.panda === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                    {product.prices.panda}
                  </div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Othaim</div>
                  <div className={`${product.prices.othaim === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                    {product.prices.othaim}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Carrefour</div>
                  <div className={`${product.prices.carrefour === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                    {product.prices.carrefour}
                  </div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Danube</div>
                  <div className={`${product.prices.danube === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                    {product.prices.danube}
                  </div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Tamimi</div>
                  <div className={`${product.prices.tamimi === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                    {product.prices.tamimi}
                  </div>
                </div>
              </div>
              
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`w-full ${isSelected ? "bg-app-green hover:bg-app-green-dark" : ""}`}
                onClick={() => handleSelectProduct(product)}
              >
                {isSelected ? <Check className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                {isSelected ? 'Selected' : 'Compare'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Render pagination
  const renderPagination = () => {
    // Don't show pagination if there's only one page
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
            // Show first page, last page, and pages around current page
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
            
            // Show ellipsis for skipped pages
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
          
          {/* Mobile view with category carousels */}
          {isMobile && activeCategory === 'All' ? (
            renderCategoryCarousels()
          ) : (
            // Desktop view or filtered results
            <>
              {renderProductGrid()}
              {renderPagination()}
            </>
          )}
        </CardContent>
      </Card>

      {/* New Arrivals (only on last page) */}
      {isLastPage && !isMobile && (
        <Card className="mb-4 bg-white">
          <CardContent className="pt-6">
            <NewArrivals />
          </CardContent>
        </Card>
      )}

      {/* Comparison Summary Card */}
      <Card className="mb-4 bg-white">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            {selectedProducts.length > 0 ? 'Selected Products Total' : 'All Products Total'}
          </h3>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div className={`p-4 rounded-lg ${getRankingColorClass('tamimi')} ${lowestTotalStore === 'tamimi' ? 'border-2 border-app-green' : 'bg-gray-50'}`}>
              <div className={`text-sm font-medium ${priceRankings['tamimi'] === 'lowest' || priceRankings['tamimi'] === 'highest' ? 'text-white' : 'text-gray-500'}`}>
                Tamimi
                {getRankingBadge('tamimi')}
              </div>
              <div className={`text-xl font-bold ${lowestTotalStore === 'tamimi' ? 'text-app-green' : ''} ${priceRankings['tamimi'] === 'lowest' || priceRankings['tamimi'] === 'highest' ? 'text-white' : ''}`}>
                {totals.tamimi.toFixed(2)}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${getRankingColorClass('panda')} ${lowestTotalStore === 'panda' ? 'border-2 border-app-green' : 'bg-gray-50'}`}>
              <div className={`text-sm font-medium ${priceRankings['panda'] === 'lowest' || priceRankings['panda'] === 'highest' ? 'text-white' : 'text-gray-500'}`}>
                Panda
                {getRankingBadge('panda')}
              </div>
              <div className={`text-xl font-bold ${lowestTotalStore === 'panda' ? 'text-app-green' : ''} ${priceRankings['panda'] === 'lowest' || priceRankings['panda'] === 'highest' ? 'text-white' : ''}`}>
                {totals.panda.toFixed(2)}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${getRankingColorClass('danube')} ${lowestTotalStore === 'danube' ? 'border-2 border-app-green' : 'bg-gray-50'}`}>
              <div className={`text-sm font-medium ${priceRankings['danube'] === 'lowest' || priceRankings['danube'] === 'highest' ? 'text-white' : 'text-gray-500'}`}>
                Danube
                {getRankingBadge('danube')}
              </div>
              <div className={`text-xl font-bold ${lowestTotalStore === 'danube' ? 'text-app-green' : ''} ${priceRankings['danube'] === 'lowest' || priceRankings['danube'] === 'highest' ? 'text-white' : ''}`}>
                {totals.danube.toFixed(2)}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${getRankingColorClass('carrefour')} ${lowestTotalStore === 'carrefour' ? 'border-2 border-app-green' : 'bg-gray-50'}`}>
              <div className={`text-sm font-medium ${priceRankings['carrefour'] === 'lowest' || priceRankings['carrefour'] === 'highest' ? 'text-white' : 'text-gray-500'}`}>
                Carrefour
                {getRankingBadge('carrefour')}
              </div>
              <div className={`text-xl font-bold ${lowestTotalStore === 'carrefour' ? 'text-app-green' : ''} ${priceRankings['carrefour'] === 'lowest' || priceRankings['carrefour'] === 'highest' ? 'text-white' : ''}`}>
                {totals.carrefour.toFixed(2)}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${getRankingColorClass('othaim')} ${lowestTotalStore === 'othaim' ? 'border-2 border-app-green' : 'bg-gray-50'}`}>
              <div className={`text-sm font-medium ${priceRankings['othaim'] === 'lowest' || priceRankings['othaim'] === 'highest' ? 'text-white' : 'text-gray-500'}`}>
                Othaim
                {getRankingBadge('othaim')}
              </div>
              <div className={`text-xl font-bold ${lowestTotalStore === 'othaim' ? 'text-app-green' : ''} ${priceRankings['othaim'] === 'lowest' || priceRankings['othaim'] === 'highest' ? 'text-white' : ''}`}>
                {totals.othaim.toFixed(2)}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${getRankingColorClass('lulu')} ${lowestTotalStore === 'lulu' ? 'border-2 border-app-green' : 'bg-gray-50'}`}>
              <div className={`text-sm font-medium ${priceRankings['lulu'] === 'lowest' || priceRankings['lulu'] === 'highest' ? 'text-white' : 'text-gray-500'}`}>
                LuLu
                {getRankingBadge('lulu')}
              </div>
              <div className={`text-xl font-bold ${lowestTotalStore === 'lulu' ? 'text-app-green' : ''} ${priceRankings['lulu'] === 'lowest' || priceRankings['lulu'] === 'highest' ? 'text-white' : ''}`}>
                {totals.lulu.toFixed(2)}
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            {selectedProducts.length > 0 ? (
              <div className="flex flex-col items-center">
                <p className="text-gray-600 mb-2">
                  Select multiple products above to compare prices across stores
                </p>
                <Button 
                  variant="default" 
                  className="bg-app-green hover:bg-app-green-dark"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Shop at {lowestTotalStore.charAt(0).toUpperCase() + lowestTotalStore.slice(1)}
                </Button>
              </div>
            ) : (
              <p className="text-gray-600">
                Select products above to compare prices
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceComparison;
