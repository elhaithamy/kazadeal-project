
import React, { useContext } from 'react';
import { ShoppingBasket, Plus, Check, ShoppingCart } from 'lucide-react';
import { products, Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductSelectionContext } from '@/contexts/ProductSelectionContext';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PriceComparison = () => {
  const { selectedProducts, toggleProductSelection } = useContext(ProductSelectionContext);
  const { toast } = useToast();

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
      products.filter(p => selectedProducts.includes(p.id)) : 
      products;

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
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Card className="mb-4 bg-white">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Price Comparison</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {selectedProducts.length > 0 
                  ? `${selectedProducts.length} products selected` 
                  : 'Showing all products'}
              </span>
              {selectedProducts.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleProductSelection("clear")}
                >
                  Clear Selection
                </Button>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-1/3">Product</TableHead>
                  <TableHead className="text-center">Tamimi</TableHead>
                  <TableHead className="text-center">Panda</TableHead>
                  <TableHead className="text-center">Danube</TableHead>
                  <TableHead className="text-center">Carrefour</TableHead>
                  <TableHead className="text-center">Othaim</TableHead>
                  <TableHead className="text-center">LuLu</TableHead>
                  <TableHead className="text-center">Compare</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const lowestPrice = findLowestPrice(product.prices);
                  const isSelected = selectedProducts.includes(product.id);
                  
                  return (
                    <TableRow key={product.id} className={`border-b hover:bg-gray-50 transition-colors ${isSelected ? 'bg-app-lowlight' : ''}`}>
                      <TableCell className="py-3">
                        <div className="flex items-center">
                          <div className="w-12 h-12 mr-3 flex-shrink-0">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">Count: {product.count}</div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className={`${product.prices.tamimi === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                          {product.prices.tamimi}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className={`${product.prices.panda === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                          {product.prices.panda}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className={`${product.prices.danube === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                          {product.prices.danube}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className={`${product.prices.carrefour === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                          {product.prices.carrefour}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className={`${product.prices.othaim === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                          {product.prices.othaim}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className={`${product.prices.lulu === lowestPrice ? 'text-app-green font-bold' : ''}`}>
                          {product.prices.lulu}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className={isSelected ? "bg-app-green hover:bg-app-green-dark" : ""}
                          onClick={() => handleSelectProduct(product)}
                        >
                          {isSelected ? <Check className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                          {isSelected ? 'Selected' : 'Compare'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Summary Card */}
      <Card className="mb-4 bg-white">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            {selectedProducts.length > 0 ? 'Selected Products Total' : 'All Products Total'}
          </h3>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div className={`p-4 rounded-lg ${lowestTotalStore === 'tamimi' ? 'bg-app-lowlight border-2 border-app-green' : 'bg-gray-50'}`}>
              <div className="text-sm font-medium text-gray-500">Tamimi</div>
              <div className={`text-xl font-bold ${lowestTotalStore === 'tamimi' ? 'text-app-green' : ''}`}>
                {totals.tamimi.toFixed(2)}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${lowestTotalStore === 'panda' ? 'bg-app-lowlight border-2 border-app-green' : 'bg-gray-50'}`}>
              <div className="text-sm font-medium text-gray-500">Panda</div>
              <div className={`text-xl font-bold ${lowestTotalStore === 'panda' ? 'text-app-green' : ''}`}>
                {totals.panda.toFixed(2)}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${lowestTotalStore === 'danube' ? 'bg-app-lowlight border-2 border-app-green' : 'bg-gray-50'}`}>
              <div className="text-sm font-medium text-gray-500">Danube</div>
              <div className={`text-xl font-bold ${lowestTotalStore === 'danube' ? 'text-app-green' : ''}`}>
                {totals.danube.toFixed(2)}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${lowestTotalStore === 'carrefour' ? 'bg-app-lowlight border-2 border-app-green' : 'bg-gray-50'}`}>
              <div className="text-sm font-medium text-gray-500">Carrefour</div>
              <div className={`text-xl font-bold ${lowestTotalStore === 'carrefour' ? 'text-app-green' : ''}`}>
                {totals.carrefour.toFixed(2)}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${lowestTotalStore === 'othaim' ? 'bg-app-lowlight border-2 border-app-green' : 'bg-gray-50'}`}>
              <div className="text-sm font-medium text-gray-500">Othaim</div>
              <div className={`text-xl font-bold ${lowestTotalStore === 'othaim' ? 'text-app-green' : ''}`}>
                {totals.othaim.toFixed(2)}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${lowestTotalStore === 'lulu' ? 'bg-app-lowlight border-2 border-app-green' : 'bg-gray-50'}`}>
              <div className="text-sm font-medium text-gray-500">LuLu</div>
              <div className={`text-xl font-bold ${lowestTotalStore === 'lulu' ? 'text-app-green' : ''}`}>
                {totals.lulu.toFixed(2)}
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Button 
              variant="default" 
              className="bg-app-green hover:bg-app-green-dark"
              disabled={selectedProducts.length === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Shop at {lowestTotalStore.charAt(0).toUpperCase() + lowestTotalStore.slice(1)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceComparison;
