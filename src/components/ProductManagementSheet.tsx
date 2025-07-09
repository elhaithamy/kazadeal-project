import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  unit: string;
  barcode: string;
  image_url: string;
}

interface PriceData {
  retailer_id: string;
  price: number;
  is_available: boolean;
}

const ProductManagementSheet = () => {
  const { products, loading, reloadProducts } = useProducts();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [retailers, setRetailers] = useState<any[]>([]);
  
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    unit: 'each',
    barcode: '',
    image_url: ''
  });

  const [priceData, setPriceData] = useState<PriceData[]>([]);

  useEffect(() => {
    loadRetailers();
  }, []);

  const loadRetailers = async () => {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setRetailers(data || []);
      
      // Initialize price data with retailers
      setPriceData(data?.map(retailer => ({
        retailer_id: retailer.id,
        price: 0,
        is_available: true
      })) || []);
    } catch (error) {
      console.error('Error loading retailers:', error);
    }
  };

  const categories = ['Fresh Produce', 'Dairy', 'Meat', 'Bakery', 'Beverages', 'Snacks', 'Household', 'Personal Care', 'Other'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveProduct = async () => {
    try {
      // First, save/update the product
      let productId;
      
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update({
            name: productForm.name,
            description: productForm.description,
            category: productForm.category,
            unit: productForm.unit,
            image_url: productForm.image_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProduct.id);

        if (error) throw error;
        productId = editingProduct.id;
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert({
            name: productForm.name,
            description: productForm.description,
            category: productForm.category,
            unit: productForm.unit,
            image_url: productForm.image_url,
            is_active: true
          })
          .select()
          .single();

        if (error) throw error;
        productId = data.id;
      }

      // Save price data
      const pricesWithProduct = priceData
        .filter(price => price.price > 0)
        .map(price => ({
          product_id: productId,
          retailer_id: price.retailer_id,
          price: price.price,
          is_available: price.is_available
        }));

      if (pricesWithProduct.length > 0) {
        // Delete existing prices first
        await supabase
          .from('product_prices')
          .delete()
          .eq('product_id', productId);

        // Insert new prices
        const { error: priceError } = await supabase
          .from('product_prices')
          .insert(pricesWithProduct);

        if (priceError) throw priceError;
      }

      toast({
        title: 'Success',
        description: `Product ${editingProduct ? 'updated' : 'created'} successfully`
      });

      // Reset form
      setProductForm({
        name: '',
        description: '',
        category: '',
        unit: 'each',
        barcode: '',
        image_url: ''
      });
      setPriceData(retailers.map(retailer => ({
        retailer_id: retailer.id,
        price: 0,
        is_available: true
      })));
      setShowAddProduct(false);
      setEditingProduct(null);
      reloadProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive'
      });
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      category: product.category || '',
      unit: product.unit || 'each',
      barcode: '',
      image_url: product.image_url || ''
    });
    
    // Load existing prices
    const existingPrices = retailers.map(retailer => {
      const existingPrice = product.prices?.find((p: any) => p.retailer_id === retailer.id);
      return {
        retailer_id: retailer.id,
        price: existingPrice?.price || 0,
        is_available: existingPrice?.is_available ?? true
      };
    });
    setPriceData(existingPrices);
    setShowAddProduct(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product deleted successfully'
      });
      reloadProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive'
      });
    }
  };

  const updatePriceData = (retailerId: string, field: keyof PriceData, value: any) => {
    setPriceData(prev => prev.map(price => 
      price.retailer_id === retailerId 
        ? { ...price, [field]: value }
        : price
    ));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products Table</TabsTrigger>
          <TabsTrigger value="latest">Latest Offers</TabsTrigger>
          <TabsTrigger value="new">New Arrivals</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Product Management</span>
                <Button onClick={() => setShowAddProduct(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Products Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-6 gap-4 p-4 bg-muted font-medium text-sm">
                  <div>Product</div>
                  <div>Category</div>
                  <div>Unit</div>
                  <div>Prices</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                
                {filteredProducts.map(product => (
                  <div key={product.id} className="grid grid-cols-6 gap-4 p-4 border-t items-center">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.description}</div>
                      </div>
                    </div>
                    <div>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <div className="text-sm">{product.unit}</div>
                    <div>
                      {product.prices?.length > 0 ? (
                        <div className="text-sm">
                          ${Math.min(...product.prices.map((p: any) => p.price)).toFixed(2)} - 
                          ${Math.max(...product.prices.map((p: any) => p.price)).toFixed(2)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No prices</span>
                      )}
                    </div>
                    <div>
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add/Edit Product Form */}
          {showAddProduct && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Product Name</Label>
                    <Input
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    placeholder="Product description"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Unit Type</Label>
                    <Select value={productForm.unit} onValueChange={(value) => setProductForm({...productForm, unit: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="each">Each</SelectItem>
                        <SelectItem value="kg">Kilogram</SelectItem>
                        <SelectItem value="g">Gram</SelectItem>
                        <SelectItem value="l">Liter</SelectItem>
                        <SelectItem value="ml">Milliliter</SelectItem>
                        <SelectItem value="pack">Pack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Barcode (Optional)</Label>
                    <Input
                      value={productForm.barcode}
                      onChange={(e) => setProductForm({...productForm, barcode: e.target.value})}
                      placeholder="Product barcode"
                    />
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      value={productForm.image_url}
                      onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                      placeholder="Product image URL"
                    />
                  </div>
                </div>

                {/* Retailer Prices */}
                <div>
                  <Label className="text-base font-semibold">Retailer Prices</Label>
                  <div className="space-y-3 mt-2">
                    {retailers.map(retailer => {
                      const priceInfo = priceData.find(p => p.retailer_id === retailer.id);
                      return (
                        <div key={retailer.id} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{retailer.name}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              step="0.01"
                              value={priceInfo?.price || ''}
                              onChange={(e) => updatePriceData(retailer.id, 'price', parseFloat(e.target.value) || 0)}
                              placeholder="Price"
                              className="w-24"
                            />
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={priceInfo?.is_available ?? true}
                                onChange={(e) => updatePriceData(retailer.id, 'is_available', e.target.checked)}
                              />
                              <span className="text-sm">Available</span>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveProduct}>
                    {editingProduct ? 'Update Product' : 'Save Product'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAddProduct(false);
                      setEditingProduct(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="latest">
          <Card>
            <CardHeader>
              <CardTitle>Latest Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Latest offer management will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>New Arrivals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">New arrivals management will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductManagementSheet;