
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BottomNav from '@/components/BottomNav';
import { products as initialProducts, Product } from '@/data/products';

const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    setEditingProduct({...product});
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;
    
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === editingProduct.id ? editingProduct : p)
    );
    setEditingProduct(null);
    
    // In a real application, you would save this to your database or API
    alert('Product updated! (Note: This is demo functionality. In a real app, this would save to a database)');
  };

  const handlePriceChange = (store: keyof Product['prices'], value: string) => {
    if (!editingProduct) return;
    
    setEditingProduct({
      ...editingProduct,
      prices: {
        ...editingProduct.prices,
        [store]: Number(value) || 0
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 mb-16">
        <h1 className="text-2xl font-bold mb-6">Product Management</h1>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            This is a simple demo of how you could manage products. 
            In a real application, you would connect this to a database through Supabase.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Product List */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="border-b pb-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded-md mr-3"
                    />
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        Price range: {Math.min(...Object.values(product.prices))} - {Math.max(...Object.values(product.prices))}
                      </p>
                    </div>
                  </div>
                  <button 
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Edit Product */}
          {editingProduct && (
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <img 
                    src={editingProduct.image} 
                    alt={editingProduct.name} 
                    className="w-16 h-16 object-cover rounded-md mr-3"
                  />
                  <div>
                    <h3 className="font-medium">{editingProduct.name}</h3>
                  </div>
                </div>
                
                <h4 className="font-medium">Store Prices</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price-lulu">LuLu</Label>
                    <Input 
                      id="price-lulu"
                      type="number" 
                      value={editingProduct.prices.lulu} 
                      onChange={(e) => handlePriceChange('lulu', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price-othaim">Othaim</Label>
                    <Input 
                      id="price-othaim"
                      type="number" 
                      value={editingProduct.prices.othaim} 
                      onChange={(e) => handlePriceChange('othaim', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price-carrefour">Carrefour</Label>
                    <Input 
                      id="price-carrefour"
                      type="number" 
                      value={editingProduct.prices.carrefour} 
                      onChange={(e) => handlePriceChange('carrefour', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price-danube">Danube</Label>
                    <Input 
                      id="price-danube"
                      type="number" 
                      value={editingProduct.prices.danube} 
                      onChange={(e) => handlePriceChange('danube', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price-panda">Panda</Label>
                    <Input 
                      id="price-panda"
                      type="number" 
                      value={editingProduct.prices.panda} 
                      onChange={(e) => handlePriceChange('panda', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price-tamimi">Tamimi</Label>
                    <Input 
                      id="price-tamimi"
                      type="number" 
                      value={editingProduct.prices.tamimi} 
                      onChange={(e) => handlePriceChange('tamimi', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button 
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                    onClick={handleSaveProduct}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default AdminPage;
