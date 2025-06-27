
import React, { useContext, useMemo, useState } from 'react';
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, Store, MapPin, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { ProductSelectionContext } from '@/contexts/ProductSelectionContext';
import { products } from '@/data/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const BasketPage = () => {
  const { selectedProducts, toggleProductSelection } = useContext(ProductSelectionContext);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const getQuantity = (productId: number) => quantities[productId] || 1;

  const handleQuantityChange = (productId: number, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, value)
    }));
  };

  const selectedProductsData = useMemo(() => {
    return products.filter(product => selectedProducts.includes(product.id));
  }, [selectedProducts]);

  const calculateStoreTotals = useMemo(() => {
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
  }, [selectedProductsData, quantities]);

  const bestStore = useMemo(() => {
    const entries = Object.entries(calculateStoreTotals);
    return entries.reduce((best, current) => 
      current[1] < best[1] ? current : best
    );
  }, [calculateStoreTotals]);

  const storeInfo = {
    lulu: { name: 'LuLu Hypermarket', color: 'bg-blue-500', rating: 4.5, delivery: '30-45 min' },
    othaim: { name: 'Othaim Markets', color: 'bg-purple-500', rating: 4.3, delivery: '25-40 min' },
    carrefour: { name: 'Carrefour', color: 'bg-orange-500', rating: 4.4, delivery: '35-50 min' },
    danube: { name: 'Danube', color: 'bg-blue-600', rating: 4.2, delivery: '40-55 min' },
    panda: { name: 'Panda', color: 'bg-green-500', rating: 4.6, delivery: '20-35 min' },
    tamimi: { name: 'Tamimi Markets', color: 'bg-indigo-500', rating: 4.4, delivery: '30-45 min' }
  };

  if (selectedProducts.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <div className="bg-white shadow-sm mb-4">
          <div className="container mx-auto px-4 py-2 flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold">Your Basket</h1>
          </div>
        </div>
        
        <main className="flex-1 mb-16 px-4">
          <div className="max-w-md mx-auto mt-16">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your basket is empty</h2>
              <p className="text-gray-500 mb-6">Add products to compare prices and start saving!</p>
              <Link 
                to="/" 
                className="inline-block bg-app-green text-white px-6 py-3 rounded-md font-semibold hover:bg-app-green/90 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </main>
        
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="bg-white shadow-sm mb-4">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold">Your Basket</h1>
          </div>
          <Badge variant="secondary" className="bg-app-green text-white">
            {selectedProducts.length} items
          </Badge>
        </div>
      </div>
      
      <main className="flex-1 mb-16 px-4 max-w-4xl mx-auto w-full">
        {/* Best Deal Banner */}
        <Card className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-green-800">Best Deal Found!</h3>
                  <p className="text-green-600 text-sm">
                    {storeInfo[bestStore[0] as keyof typeof storeInfo].name} - Save SAR {(Math.max(...Object.values(calculateStoreTotals)) - bestStore[1]).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-700">SAR {bestStore[1].toFixed(2)}</div>
                <div className="flex items-center text-sm text-green-600">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {storeInfo[bestStore[0] as keyof typeof storeInfo].rating}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product List */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Selected Products
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {selectedProductsData.map((product, index) => (
              <div key={product.id}>
                <div className="p-4 flex items-center space-x-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleQuantityChange(product.id, getQuantity(product.id) - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                      disabled={getQuantity(product.id) <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <Input
                      type="number"
                      value={getQuantity(product.id)}
                      onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                      className="w-16 text-center"
                      min="1"
                    />
                    <button 
                      onClick={() => handleQuantityChange(product.id, getQuantity(product.id) + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => toggleProductSelection(product.id)}
                    className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {index < selectedProductsData.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Store Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Store Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(calculateStoreTotals).map(([store, total]) => {
                const info = storeInfo[store as keyof typeof storeInfo];
                const isBest = store === bestStore[0];
                
                return (
                  <div 
                    key={store}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isBest ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${info.color} rounded-full flex items-center justify-center`}>
                          <Store className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{info.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                              {info.rating}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {info.delivery}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${isBest ? 'text-green-700' : 'text-gray-800'}`}>
                          SAR {total.toFixed(2)}
                        </div>
                        {isBest && (
                          <Badge className="bg-green-500 text-white text-xs">Best Price</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default BasketPage;
