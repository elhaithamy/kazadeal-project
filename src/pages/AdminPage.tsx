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
import { ChevronDown, ChevronUp, Image as ImageIcon, Save, Trash2, Plus, CheckCircle2, XCircle, Download, Upload, FileText, Calendar, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductTag, { TagType } from '@/components/ProductTag';

interface Leaflet {
  id: number;
  title: string;
  store: string;
  uploadDate: Date;
  startDate: Date;
  expiryDate: Date;
  pdfUrl: string;
  isActive: boolean;
}

const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('products');
  const [leaflets, setLeaflets] = useState<Leaflet[]>([]);
  const [newLeaflet, setNewLeaflet] = useState<Partial<Leaflet>>({
    title: '',
    store: '',
    startDate: new Date(),
    expiryDate: new Date(),
    pdfUrl: ''
  });
  const [newProduct, setNewProduct] = useState<Partial<Product & { selectedTags: TagType[] }>>({
    name: '',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100',
    count: 1,
    category: '',
    addedDate: new Date(),
    selectedTags: [],
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

  const availableTags: TagType[] = ['hot-deal', 'bulky', 'heavy-carry', 'new', 'bestseller'];

  const handleEditProduct = (product: Product) => {
    setEditingProduct({...product});
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;
    
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === editingProduct.id ? editingProduct : p)
    );
    setEditingProduct(null);
    
    toast({
      title: 'Product updated!',
      description: 'Your changes have been saved successfully.',
    });
  };

  const handleAddProduct = () => {
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
      selectedTags: [],
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

  const handleExportProducts = () => {
    const csvContent = [
      ['ID', 'Name', 'Category', 'Image', 'Count', 'LuLu Price', 'Othaim Price', 'Carrefour Price', 'Danube Price', 'Panda Price', 'Tamimi Price', 'Available'],
      ...products.map(p => [
        p.id,
        p.name,
        p.category,
        p.image,
        p.count,
        p.prices.lulu,
        p.prices.othaim,
        p.prices.carrefour,
        p.prices.danube,
        p.prices.panda,
        p.prices.tamimi,
        p.isAvailable === false ? 'No' : 'Yes'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Products exported!',
      description: 'CSV file has been downloaded.',
    });
  };

  const handleImportProducts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        // Basic CSV parsing - in production, use a proper CSV parser
        toast({
          title: 'Import started',
          description: 'Processing your CSV file...',
        });
      } catch (error) {
        toast({
          title: 'Import failed',
          description: 'Please check your CSV format.',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleAddLeaflet = () => {
    const newId = leaflets.length > 0 ? Math.max(...leaflets.map(l => l.id)) + 1 : 1;
    
    const leafletToAdd = {
      ...newLeaflet,
      id: newId,
      uploadDate: new Date(),
      isActive: true
    } as Leaflet;
    
    setLeaflets([...leaflets, leafletToAdd]);
    setNewLeaflet({
      title: '',
      store: '',
      startDate: new Date(),
      expiryDate: new Date(),
      pdfUrl: ''
    });
    
    toast({
      title: 'Leaflet added!',
      description: 'New leaflet has been uploaded.',
    });
  };

  const handleDeleteLeaflet = (id: number) => {
    setLeaflets(leaflets.filter(l => l.id !== id));
    toast({
      title: 'Leaflet deleted',
      description: 'The leaflet has been removed.',
    });
  };

  const toggleLeafletStatus = (leaflet: Leaflet) => {
    setLeaflets(prevLeaflets => 
      prevLeaflets.map(l => 
        l.id === leaflet.id ? { ...l, isActive: !l.isActive } : l
      )
    );
    
    toast({
      title: leaflet.isActive ? 'Leaflet deactivated' : 'Leaflet activated',
      description: `${leaflet.title} is now ${leaflet.isActive ? 'inactive' : 'active'}.`,
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
  const stores = ['LuLu', 'Othaim', 'Carrefour', 'Danube', 'Panda', 'Tamimi'];

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
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="products">Product Management</TabsTrigger>
            <TabsTrigger value="add">Add New Product</TabsTrigger>
            <TabsTrigger value="leaflets">Leaflet Management</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Products</h2>
                  <div className="flex gap-2">
                    <Button onClick={handleExportProducts} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleImportProducts}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Import CSV
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">ID</TableHead>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Tags</TableHead>
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
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {/* Simulated tags based on product ID */}
                              {product.id % 10 === 0 && <ProductTag type="hot-deal" />}
                              {product.id % 7 === 0 && <ProductTag type="bulky" />}
                              {product.id % 8 === 0 && <ProductTag type="bestseller" />}
                            </div>
                          </TableCell>
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

                  <div className="space-y-2">
                    <Label>Product Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map(tag => (
                        <div key={tag} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`tag-${tag}`}
                            checked={newProduct.selectedTags?.includes(tag)}
                            onChange={(e) => {
                              const currentTags = newProduct.selectedTags || [];
                              if (e.target.checked) {
                                setNewProduct({
                                  ...newProduct,
                                  selectedTags: [...currentTags, tag]
                                });
                              } else {
                                setNewProduct({
                                  ...newProduct,
                                  selectedTags: currentTags.filter(t => t !== tag)
                                });
                              }
                            }}
                          />
                          <label htmlFor={`tag-${tag}`}>
                            <ProductTag type={tag} />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Store Prices</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.keys(newProduct.prices || {}).map(store => (
                        <div key={store} className="space-y-2">
                          <Label htmlFor={`new-price-${store}`}>{store.charAt(0).toUpperCase() + store.slice(1)}</Label>
                          <Input 
                            id={`new-price-${store}`}
                            type="number" 
                            value={newProduct.prices?.[store as keyof Product['prices']] || 0} 
                            onChange={(e) => handlePriceChange(store as keyof Product['prices'], e.target.value, false)}
                          />
                        </div>
                      ))}
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

          <TabsContent value="leaflets" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Leaflet Management</h2>
                
                {/* Add New Leaflet Form */}
                <div className="border-b pb-6 mb-6">
                  <h3 className="font-medium mb-4">Upload New Leaflet</h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="leaflet-title">Leaflet Title</Label>
                        <Input 
                          id="leaflet-title"
                          value={newLeaflet.title} 
                          onChange={(e) => setNewLeaflet({...newLeaflet, title: e.target.value})}
                          placeholder="Enter leaflet title"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="leaflet-store">Store</Label>
                        <Select onValueChange={(value) => setNewLeaflet({...newLeaflet, store: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select store" />
                          </SelectTrigger>
                          <SelectContent>
                            {stores.map(store => (
                              <SelectItem key={store} value={store}>{store}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="leaflet-start">Start Date</Label>
                        <Input 
                          id="leaflet-start"
                          type="date"
                          value={newLeaflet.startDate?.toISOString().split('T')[0]} 
                          onChange={(e) => setNewLeaflet({...newLeaflet, startDate: new Date(e.target.value)})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="leaflet-expiry">Expiry Date</Label>
                        <Input 
                          id="leaflet-expiry"
                          type="date"
                          value={newLeaflet.expiryDate?.toISOString().split('T')[0]} 
                          onChange={(e) => setNewLeaflet({...newLeaflet, expiryDate: new Date(e.target.value)})}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="leaflet-pdf">PDF File URL</Label>
                        <Input 
                          id="leaflet-pdf"
                          value={newLeaflet.pdfUrl} 
                          onChange={(e) => setNewLeaflet({...newLeaflet, pdfUrl: e.target.value})}
                          placeholder="Enter PDF URL or upload file"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleAddLeaflet}
                        className="bg-app-green"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Leaflet
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Leaflets Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Store</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaflets.map(leaflet => (
                        <TableRow key={leaflet.id} className={!leaflet.isActive ? 'opacity-50' : ''}>
                          <TableCell className="font-medium">{leaflet.title}</TableCell>
                          <TableCell>{leaflet.store}</TableCell>
                          <TableCell>{leaflet.startDate.toLocaleDateString()}</TableCell>
                          <TableCell>{leaflet.expiryDate.toLocaleDateString()}</TableCell>
                          <TableCell>{leaflet.uploadDate.toLocaleDateString()}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <Switch
                                checked={leaflet.isActive}
                                onCheckedChange={() => toggleLeafletStatus(leaflet)}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(leaflet.pdfUrl, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteLeaflet(leaflet.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {leaflets.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                            No leaflets uploaded yet. Add your first leaflet above.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
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
                      {Object.keys(editingProduct.prices).map(store => (
                        <div key={store} className="space-y-2">
                          <Label htmlFor={`edit-price-${store}`}>{store.charAt(0).toUpperCase() + store.slice(1)}</Label>
                          <Input 
                            id={`edit-price-${store}`}
                            type="number" 
                            value={editingProduct.prices[store as keyof Product['prices']]} 
                            onChange={(e) => handlePriceChange(store as keyof Product['prices'], e.target.value)}
                          />
                        </div>
                      ))}
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
