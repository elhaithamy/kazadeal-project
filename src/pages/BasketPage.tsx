
import React, { useContext, useState } from 'react';
import { ArrowLeft, Save, Share, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ProductSelectionContext } from '@/contexts/ProductSelectionContext';
import { products, Product } from '@/data/products';
import ProductTag, { TagType } from '@/components/ProductTag';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

const getProductTag = (productId: number): TagType | null => {
  if (productId % 10 === 0) return 'hot-deal';
  if (productId % 7 === 0) return 'bulky';
  if (productId % 5 === 0) return 'heavy-carry';
  if (productId % 8 === 0) return 'bestseller';
  return null;
};

const BasketPage = () => {
  const { selectedProducts, toggleProductSelection } = useContext(ProductSelectionContext);
  const { toast } = useToast();
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [listName, setListName] = useState('');

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

  const handleRemoveProduct = (productId: number) => {
    toggleProductSelection(productId);
    toast({
      title: 'Product removed',
      description: 'Product has been removed from comparison.',
    });
  };

  const handleSaveAsList = () => {
    if (!listName.trim()) {
      toast({
        title: 'List name required',
        description: 'Please enter a name for your list.',
      });
      return;
    }

    // In a real app, this would save to database
    const savedList = {
      name: listName,
      products: selectedProducts,
      quantities: quantities,
      createdAt: new Date(),
    };

    console.log('Saving list:', savedList);

    toast({
      title: 'List saved!',
      description: `"${listName}" has been saved to your lists.`,
    });

    setListName('');
  };

  const handleShareList = () => {
    // In a real app, this would generate a shareable link
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link copied!',
      description: 'Comparison link has been copied to clipboard.',
    });
  };

  const selectedProductsData = products.filter(p => selectedProducts.includes(p.id));

  // Color palette for retailers
  const retailerColors = {
    lulu: '#0EA5E9',
    othaim: '#9b87f5', 
    carrefour: '#F97316',
    danube: '#1EAEDB',
    panda: '#7E69AB',
    tamimi: '#6E59A5',
  };

  const renderProductCard = (product: Product) => {
    const isSelected = selectedProducts.includes(product.id);
    const productTag = getProductTag(product.id);
    const quantity = getQuantity(product.id);

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
      <Card key={product.id} className="h-full rounded-2xl transition-all duration-200 border-gray-200">
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
                  <Minus className="w-3 h-3" />
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
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            {/* Price comparison table */}
            <div className="mb-3 w-full">
              <div className="grid grid-cols-2 gap-2 w-full">
                {prices.map(({ label, value, key }) => {
                  const color = retailerColors[key as keyof typeof retailerColors];
                  const isLowest = value === lowestPrice;
                  const totalPrice = value * quantity;
                  
                  return (
                    <div
                      key={label}
                      className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl border text-xs`}
                      style={{
                        backgroundColor: isLowest ? `${color}20` : '#f8f9fa',
                        borderColor: isLowest ? color : '#e9ecef',
                        color: isLowest ? color : '#495057'
                      }}
                    >
                      <span className="font-semibold text-[11px] mb-0.5">{label}</span>
                      <span className={`text-sm ${isLowest ? 'font-extrabold' : 'font-medium'}`}>
                        {totalPrice.toFixed(2)}
                      </span>
                      <span className="text-[9px] opacity-70">
                        ({value.toFixed(2)} each)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-auto">
              <Button
                variant="destructive"
                size="sm"
                className="w-full text-sm py-2 h-10 rounded-xl font-bold"
                onClick={() => handleRemoveProduct(product.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Calculate totals for each store
  const calculateTotals = () => {
    const totals = {
      lulu: 0,
      othaim: 0,
      carrefour: 0,
      danube: 0,
      panda: 0,
      tamimi: 0
    };

    selectedProductsData.forEach(product => {
      const quantity = getQuantity(product.id);
      totals.lulu += product.prices.lulu * quantity;
      totals.othaim += product.prices.othaim * quantity;
      totals.carrefour += product.prices.carrefour * quantity;
      totals.danube += product.prices.danube * quantity;
      totals.panda += product.prices.panda * quantity;
      totals.tamimi += product.prices.tamimi * quantity;
    });

    return totals;
  };

  const totals = calculateTotals();
  const lowestTotal = Math.min(...Object.values(totals));
  const bestStore = Object.entries(totals).find(([_, value]) => value === lowestTotal)?.[0];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 mb-16">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Shopping Comparison</h1>
        </div>

        {selectedProductsData.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500 mb-4">No products selected for comparison yet.</p>
              <Link to="/">
                <Button className="bg-app-green hover:bg-app-green/90">
                  Start Comparing Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Comparison Summary</span>
                  <Badge variant="secondary">{selectedProductsData.length} products</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {Object.entries(totals).map(([store, total]) => {
                    const storeName = store.charAt(0).toUpperCase() + store.slice(1);
                    const color = retailerColors[store as keyof typeof retailerColors];
                    const isBest = store === bestStore;
                    
                    return (
                      <div
                        key={store}
                        className={`p-3 rounded-lg border-2 text-center ${
                          isBest ? 'border-green-500 bg-green-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="font-semibold text-sm mb-1">{storeName}</div>
                        <div 
                          className="text-xl font-bold"
                          style={{ color: isBest ? '#059669' : color }}
                        >
                          {total.toFixed(2)}
                        </div>
                        {isBest && (
                          <Badge className="mt-1 bg-green-500 text-white text-xs">
                            Best Price
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleShareList}
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Selected Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedProductsData.map(renderProductCard)}
              </div>
            </div>

            {/* Save as List Section */}
            <Card>
              <CardHeader>
                <CardTitle>Save as List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter list name..."
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSaveAsList}
                    className="bg-app-green hover:bg-app-green/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save List
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default BasketPage;
