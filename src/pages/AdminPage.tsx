
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BottomNav from '@/components/BottomNav';
import { products as initialProducts, Product } from '@/data/products';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Image as ImageIcon, Save, Trash2, Plus, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('products');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100',
    count: 1,
    category: '',
    addedDate: new Date(),
    prices: {
      lulu: 0,
      othaim: 0,
      carrefour: 0,
      danube: 0,
      panda: 0,
      tamimi: 0
    }
  });
  const { toast } = useToast();

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
    toast({
      title: 'Product updated!',
      description: 'Your changes have been saved successfully.',
    });
  };

  const handleAddProduct = () => {
    // Simple ID generation (in a real app, this would be handled by the backend)
    const newId = Math.max(...products.map(p => p.id)) + 1;
    
    const productToAdd = {
      ...newProduct,
      id: newId,
      addedDate: new Date(),
      prices: newProduct.prices || {
        lulu: 0,
        othaim: 0,
        carrefour: 0,
        danube: 0,
        panda: 0,
        tamimi: 0
      }
    } as Product;
    
    setProducts([...products, productToAdd]);
    setNewProduct({
      name: '',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100',
      count: 1,
      category: '',
      addedDate: new Date(),
      prices: {
        lulu: 0,
        othaim: 0,
        carrefour: 0,
        danube: 0,
        panda: 0,
        tamimi: 0
      }
    });
    
    toast({
      title: 'Product added!',
      description: 'New product has been added to the catalog.',
    });
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: 'Product deleted',
      description: 'The product has been removed from the catalog.',
    });
  };

  const handlePriceChange = (store: keyof Product['prices'], value: string, isEditing: boolean = true) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        prices: {
          ...editingProduct.prices,
          [store]: Number(value) || 0
        }
      });
    } else if (!isEditing) {
      setNewProduct({
        ...newProduct,
        prices: {
          ...newProduct.prices as any,
          [store]: Number(value) || 0
        }
      });
    }
  };

  const toggleProductAvailability = (product: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(p => {
        if (p.id === product.id) {
          return { 
            ...p, 
            isAvailable: p.isAvailable === false ? true : false
          };
        }
        return p;
      })
    );
    
    toast({
      title: product.isAvailable === false ? 'Product available' : 'Product unavailable',
      description: `${product.name} is now marked as ${product.isAvailable === false ? 'in stock' : 'out of stock'}.`,
    });
  };

  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, isEditing: boolean = true) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        [field]: e.target.value
      });
    } else if (!isEditing) {
      setNewProduct({
        ...newProduct,
        [field]: e.target.value
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 mb-16">
        <h1 className="text-2xl font-bold mb-6">Product Management</h1>
        
        <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="add">Add New Product</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">ID</TableHead>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Base Price</TableHead>
                        <TableHead className="text-center w-[100px]">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map(product => (
                        <TableRow key={product.id} className={product.isAvailable === false ? 'opacity-50' : ''}>
                          <TableCell>{product.id}</TableCell>
                          <TableCell>
                            <img 
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="text-right">{product.prices.lulu.toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <Switch
                                checked={product.isAvailable !== false}
                                onCheckedChange={() => toggleProductAvailability(product)}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditProduct(product)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
                <div className="grid gap-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-name">Product Name</Label>
                      <Input 
                        id="new-name"
                        value={newProduct.name} 
                        onChange={(e) => handleInputChange(e, 'name', false)}
                        placeholder="Enter product name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-category">Category</Label>
                      <Input 
                        id="new-category"
                        value={newProduct.category} 
                        onChange={(e) => handleInputChange(e, 'category', false)}
                        placeholder="Enter category"
                        list="categories"
                      />
                      <datalist id="categories">
                        {categories.map((category, i) => (
                          <option key={i} value={category} />
                        ))}
                      </datalist>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-image">Product Image URL</Label>
                      <Input 
                        id="new-image"
                        value={newProduct.image} 
                        onChange={(e) => handleInputChange(e, 'image', false)}
                        placeholder="Enter image URL"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-count">Count/Unit</Label>
                      <Input 
                        id="new-count"
                        type="number"
                        value={newProduct.count} 
                        onChange={(e) => handleInputChange(e, 'count', false)}
                        placeholder="Enter count or unit"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Store Prices</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-price-lulu">LuLu</Label>
                        <Input 
                          id="new-price-lulu"
                          type="number" 
                          value={newProduct.prices?.lulu || 0} 
                          onChange={(e) => handlePriceChange('lulu', e.target.value, false)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-price-othaim">Othaim</Label>
                        <Input 
                          id="new-price-othaim"
                          type="number" 
                          value={newProduct.prices?.othaim || 0} 
                          onChange={(e) => handlePriceChange('othaim', e.target.value, false)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-price-carrefour">Carrefour</Label>
                        <Input 
                          id="new-price-carrefour"
                          type="number" 
                          value={newProduct.prices?.carrefour || 0} 
                          onChange={(e) => handlePriceChange('carrefour', e.target.value, false)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-price-danube">Danube</Label>
                        <Input 
                          id="new-price-danube"
                          type="number" 
                          value={newProduct.prices?.danube || 0} 
                          onChange={(e) => handlePriceChange('danube', e.target.value, false)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-price-panda">Panda</Label>
                        <Input 
                          id="new-price-panda"
                          type="number" 
                          value={newProduct.prices?.panda || 0} 
                          onChange={(e) => handlePriceChange('panda', e.target.value, false)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-price-tamimi">Tamimi</Label>
                        <Input 
                          id="new-price-tamimi"
                          type="number" 
                          value={newProduct.prices?.tamimi || 0} 
                          onChange={(e) => handlePriceChange('tamimi', e.target.value, false)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAddProduct}
                    className="bg-app-green"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                <div className="grid gap-4">
                  {categories.map((category, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>{category}</span>
                      <span className="text-sm text-gray-500">
                        {products.filter(p => p.category === category).length} products
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Edit Product</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEditingProduct(null)}
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="grid gap-4 mb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <img 
                      src={editingProduct.image} 
                      alt={editingProduct.name} 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <div className="font-medium">Product ID: {editingProduct.id}</div>
                      <div className="text-sm text-gray-500">
                        Added: {new Date(editingProduct.addedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Product Name</Label>
                      <Input 
                        id="edit-name"
                        value={editingProduct.name} 
                        onChange={(e) => handleInputChange(e, 'name')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Category</Label>
                      <Input 
                        id="edit-category"
                        value={editingProduct.category} 
                        onChange={(e) => handleInputChange(e, 'category')}
                        list="edit-categories"
                      />
                      <datalist id="edit-categories">
                        {categories.map((category, i) => (
                          <option key={i} value={category} />
                        ))}
                      </datalist>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-image">Product Image URL</Label>
                      <Input 
                        id="edit-image"
                        value={editingProduct.image} 
                        onChange={(e) => handleInputChange(e, 'image')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-count">Count/Unit</Label>
                      <Input 
                        id="edit-count"
                        type="number"
                        value={editingProduct.count} 
                        onChange={(e) => handleInputChange(e, 'count')}
                      />
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="edit-availability">Product Availability</Label>
                        <Switch
                          id="edit-availability"
                          checked={editingProduct.isAvailable !== false}
                          onCheckedChange={() => {
                            setEditingProduct({
                              ...editingProduct,
                              isAvailable: editingProduct.isAvailable === false ? true : false
                            });
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        {editingProduct.isAvailable === false ? 
                          'This product is marked as out of stock' : 
                          'This product is available for purchase'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Store Prices</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-price-lulu">LuLu</Label>
                        <Input 
                          id="edit-price-lulu"
                          type="number" 
                          value={editingProduct.prices.lulu} 
                          onChange={(e) => handlePriceChange('lulu', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-price-othaim">Othaim</Label>
                        <Input 
                          id="edit-price-othaim"
                          type="number" 
                          value={editingProduct.prices.othaim} 
                          onChange={(e) => handlePriceChange('othaim', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-price-carrefour">Carrefour</Label>
                        <Input 
                          id="edit-price-carrefour"
                          type="number" 
                          value={editingProduct.prices.carrefour} 
                          onChange={(e) => handlePriceChange('carrefour', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-price-danube">Danube</Label>
                        <Input 
                          id="edit-price-danube"
                          type="number" 
                          value={editingProduct.prices.danube} 
                          onChange={(e) => handlePriceChange('danube', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-price-panda">Panda</Label>
                        <Input 
                          id="edit-price-panda"
                          type="number" 
                          value={editingProduct.prices.panda} 
                          onChange={(e) => handlePriceChange('panda', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-price-tamimi">Tamimi</Label>
                        <Input 
                          id="edit-price-tamimi"
                          type="number" 
                          value={editingProduct.prices.tamimi} 
                          onChange={(e) => handlePriceChange('tamimi', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveProduct}
                    className="bg-app-green"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
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

export default AdminPage;
